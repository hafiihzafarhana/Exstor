import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import { ItemService } from '../services/item_service';
import { createItemDTO, updateItemDTO } from '../infra/dtos/item_dto';
import { BadRequestError, Forbidden, NotFoundError } from '../utils/error_util';
import { AuthorizeRequest } from '../middlewares/token_middleware';
import { checkFormatFile, deleteFolderRecursive } from '../utils/file_util';

export class ItemControllers {
  private itemService: ItemService;
  constructor() {
    this.itemService = new ItemService();
  }

  public createFile = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(createItemDTO.validate(req.body));

    if (error?.details) {
      throw new BadRequestError(error?.message, 'create() error in class ItemControllers');
    }

    const { name, parent_id } = req.body;

    if (!checkFormatFile(name)) {
      throw new BadRequestError('Format salah', 'create() error in class ItemControllers');
    }

    const item = await this.itemService.getById(parent_id);

    if (parent_id && !item) {
      throw new BadRequestError('Parent folder tidak ditemukan', 'createFile() error in class ItemControllers');
    }

    const filePath = path.join(item.path as string, name);
    fs.writeFileSync(filePath, '');

    const newItem = await this.itemService.createItem({
      user_id: req.user?.user_id,
      name,
      type: 'file',
      size: 0,
      path: filePath,
      parent_id: parent_id || null
    });

    res.json({
      msg: 'Create file',
      status: StatusCodes.CREATED,
      result: newItem,
      token: req.user?.acc_token
    });
  });

  public createFolder = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(createItemDTO.validate(req.body));

    if (error?.details) {
      throw new BadRequestError(error?.message, 'create() error in class ItemControllers');
    }

    const { name, parent_id } = req.body;
    const item = await this.itemService.getById(parent_id);

    if (parent_id && !item) {
      throw new BadRequestError('Parent folder tidak ditemukan', 'createFolder() error in class ItemControllers');
    }

    let folderName = name;
    let folderPath = path.join(item.path as string, folderName);

    let count = 1;
    while (fs.existsSync(folderPath)) {
      folderName = `dupli_${name}_${count}`;
      folderPath = path.join(item.path as string, folderName);
      count++;
    }

    // Buat folder baru di database
    const newFolder = await this.itemService.createItem({
      user_id: req.user?.user_id,
      name: folderName,
      type: 'folder', // Atur type sebagai 'folder'
      size: 0, // Ukuran bisa disesuaikan, misalnya 0 untuk folder
      path: folderPath, // Path bisa disesuaikan, misalnya sesuai hierarki
      parent_id: parent_id || null
    });

    fs.mkdirSync(folderPath);

    res.json({
      msg: 'Create folder',
      status: StatusCodes.CREATED,
      result: newFolder,
      token: req.user?.acc_token
    });
  });

  public update = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(updateItemDTO.validate(req.body));

    if (error?.details) {
      throw new BadRequestError(error?.message, 'update() error in class ItemControllers');
    }

    const { id, new_name } = req.body;
    // Dapatkan item berdasarkan ID
    const item = await this.itemService.getById(id);

    if (!item) {
      throw new BadRequestError('Item tidak ditemukan', 'update() error in class ItemControllers');
    }

    // Validasi jika item adalah file
    if (item.type === 'file') {
      if (!checkFormatFile(new_name)) {
        throw new BadRequestError('Format file salah', 'update() error in class ItemControllers');
      }
    }

    // Path lama dari file/folder
    const oldPath = path.join(item.path as string);

    // Buat path baru untuk file/folder
    const newPath = path.join(path.dirname(oldPath), new_name);

    // Cek jika file/folder dengan nama baru sudah ada
    if (fs.existsSync(newPath)) {
      throw new BadRequestError('File atau folder dengan nama tersebut sudah ada', 'update() error in class ItemControllers');
    }

    // Perbarui nama item di database
    await this.itemService.updateItem(id, new_name, newPath);

    // Rename file atau folder secara fisik di sistem file
    try {
      fs.renameSync(oldPath, newPath);
    } catch (err) {
      throw new BadRequestError(err as string, 'update() error in class ItemControllers');
    }

    // Kirim respon sukses
    res.json({
      msg: 'Item berhasil diperbarui',
      status: StatusCodes.OK,
      result: { ...item, name: new_name, path: newPath }, // Update nama dan path di respons
      token: req.user?.acc_token
    });
  });

  public delete = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.user_id;

    const item = await this.itemService.getById(id);

    if (!item) {
      throw new NotFoundError('Item not found', 'delete() error in class ItemControllers');
    }

    const itemPath = path.join(item.path as string);

    if (item.type === 'folder') {
      await this.itemService.deleteItemRecursively(id);
      deleteFolderRecursive(itemPath);
    } else {
      // Jika file, hapus file secara langsung
      fs.unlinkSync(itemPath);
    }

    await this.itemService.deleteById(id, userId as string);

    res.json({
      msg: 'Item deleted successfully',
      status: StatusCodes.OK,
      result: [],
      token: req.user?.acc_token
    });
  });

  public getAll = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.user_id;

    const item = await this.itemService.getById(id);

    if (!item) {
      throw new NotFoundError('Item not found', 'delete() error in class ItemControllers');
    }

    const items = await this.itemService.getAllByParent(id, userId as string);
    res.json({
      msg: 'Successfully to get data',
      status: StatusCodes.OK,
      result: items,
      token: req.user?.acc_token
    });
  });

  public getAllRoot = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    const userId = req.user?.user_id;
    const root = await this.itemService.getTheRoot(userId as string);

    if (!root) {
      throw new NotFoundError('Item not found', 'getAllRoot() error in class ItemControllers');
    }

    // Get all items
    const items = await this.itemService.getAllByParent(root.id as string, userId as string);

    res.json({
      msg: 'Successfully to get data',
      status: StatusCodes.OK,
      result: items,
      token: req.user?.acc_token
    });
  });

  public openFile = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    const userId = req.user?.user_id;
    const { id } = req.params;

    const item = await this.itemService.getByIdAndUserId(id, userId as string);

    if (!item) {
      throw new NotFoundError('Item not found', 'openFile() error in class ItemControllers');
    }

    if (userId !== item.user_id) {
      throw new Forbidden('Kamu tidak boleh akses ini', 'openFile() error in class ItemControllers');
    }

    const filePath = item.path;
    const command =
      process.platform === 'win32'
        ? `start "" "${filePath}"`
        : process.platform === 'darwin'
          ? `open "${filePath}"`
          : `xdg-open "${filePath}"`;

    // Get all items
    exec(command, (error) => {
      if (error) {
        throw new BadRequestError('Gagal membuka file', 'openFile() error in class ItemControllers');
      }

      res.json({
        msg: 'Successfully opened file',
        status: StatusCodes.OK,
        token: req.user?.acc_token
      });
    });
  });
}
