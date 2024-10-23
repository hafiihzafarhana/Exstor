import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

import fsExtra from 'fs-extra';
import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import { ItemService } from '../services/item_service';
import { copyItemDTO, copyItemPathDTO, createItemDTO, updateItemDTO } from '../infra/dtos/item_dto';
import { BadRequestError, Forbidden, NotFoundError } from '../utils/error_util';
import { AuthorizeRequest } from '../middlewares/token_middleware';
import { checkFormatFile, deleteFolderRecursive } from '../utils/file_util';

export class ItemControllers {
  // service
  private itemService: ItemService;
  constructor() {
    this.itemService = new ItemService();
  }

  public createFile = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    // check dto
    const { error } = await Promise.resolve(createItemDTO.validate(req.body));

    if (error?.details) {
      throw new BadRequestError(error?.message, 'create() error in class ItemControllers');
    }

    // ambil body
    const { name, parent_id } = req.body;

    // check format yang diperbolehan
    if (!checkFormatFile(name)) {
      throw new BadRequestError('Format salah', 'create() error in class ItemControllers');
    }

    // ambil data berdasarkan parent
    const item = await this.itemService.getById(parent_id);

    if (parent_id && !item) {
      throw new BadRequestError('Parent folder tidak ditemukan', 'createFile() error in class ItemControllers');
    }

    // gabungkan path dari parent dengan nama file
    let filePath = path.join(item.path as string, name);
    // buat virtual path
    let formattedPath = filePath.replace(/\\/g, ' ');
    // ambil nama file
    const baseName = path.basename(name, path.extname(name));
    // ambil ekstensi
    const ext = path.extname(name);
    let count = 1;

    // periksa apakah ada nama file yang sama
    while (fs.existsSync(filePath)) {
      // jika ada, maka tambah dengan count, lalu ubah nama, path, dan virtual path
      const newName = `${baseName}_${count}${ext}`;
      filePath = path.join(item.path as string, newName);
      formattedPath = filePath.replace(/\\/g, ' ');
      count++;
    }

    // buat file
    fs.writeFileSync(filePath, '');
    // tambah item
    const newItem = await this.itemService.createItem({
      user_id: req.user?.user_id,
      name: path.basename(filePath),
      type: 'file',
      size: 0,
      path: filePath,
      parent_id: parent_id || null,
      virtual_path: formattedPath
    });

    res.json({
      msg: 'Create file',
      status: StatusCodes.CREATED,
      result: newItem,
      token: req.user?.acc_token
    });
  });

  public createFolder = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    // check dto
    const { error } = await Promise.resolve(createItemDTO.validate(req.body));

    if (error?.details) {
      throw new BadRequestError(error?.message, 'create() error in class ItemControllers');
    }

    // ambil body
    const { name, parent_id } = req.body;
    // ambil data dari parent id
    const item = await this.itemService.getById(parent_id);

    if (parent_id && !item) {
      throw new BadRequestError('Parent folder tidak ditemukan', 'createFolder() error in class ItemControllers');
    }

    // ambil nama folder
    let folderName = name;
    // buat folder path terbaru
    let folderPath = path.join(item.path as string, folderName);

    let count = 1;
    // periksa apakah ada nama folder yang sama
    while (fs.existsSync(folderPath)) {
      // jika iya, maka tambah count, buat nama, path, dan virtual path baru
      folderName = `${name}_${count}`;
      folderPath = path.join(item.path as string, folderName);
      count++;
    }
    const formattedPath = folderPath.replace(/\\/g, ' ');

    // Buat folder baru di database
    const newFolder = await this.itemService.createItem({
      user_id: req.user?.user_id,
      name: folderName,
      type: 'folder', // Atur type sebagai 'folder'
      size: 0, // Ukuran bisa disesuaikan, misalnya 0 untuk folder
      path: folderPath, // Path bisa disesuaikan, misalnya sesuai hierarki
      parent_id: parent_id || null,
      virtual_path: formattedPath
    });

    // buat folder
    fs.mkdirSync(folderPath);

    res.json({
      msg: 'Create folder',
      status: StatusCodes.CREATED,
      result: newFolder,
      token: req.user?.acc_token
    });
  });

  public update = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    // check dto
    const { error } = await Promise.resolve(updateItemDTO.validate(req.body));

    if (error?.details) {
      throw new BadRequestError(error?.message, 'update() error in class ItemControllers');
    }

    // ambil body
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
      // Path lama dari file
      const oldPath = path.join(item.path as string);
      // Buat path baru untuk file
      const newPath = path.join(path.dirname(oldPath), new_name);

      // Cek jika file dengan nama baru sudah ada (maka error)
      if (fs.existsSync(newPath)) {
        throw new BadRequestError('File dengan nama tersebut sudah ada', 'update() error in class ItemControllers');
      }
      // buat virtual path
      const formattedPath = newPath.replace(/\\/g, ' ');
      // Perbarui nama item di database
      await this.itemService.updateItem(id, new_name, newPath, formattedPath);

      // Rename file atau folder secara fisik di sistem file
      try {
        fs.renameSync(oldPath, newPath);
      } catch (err) {
        throw new BadRequestError(err as string, 'update() error in class ItemControllers');
      }

      res.json({
        msg: 'Item (File) berhasil diperbarui',
        status: StatusCodes.OK,
        result: { ...item, name: new_name, path: newPath }, // Update nama dan path di respons
        token: req.user?.acc_token
      });
    } else if (item.type === 'folder') {
      // item.virtual_path: D: tes teknikal kerja invokes db uploads 3e5f41c1-da16-429b-93ba-9aabc17a3011 mantapA
      // disini sudah terambil
      // ambil seluruh items berdasarkan virtual path, karena jika menggunakan path, SQL tidak bisa
      const items = await this.itemService.getItemBySearchVirtualPath(item.virtual_path as string);
      // nama folder lama
      const oldFolderName = item.name;
      // nama folder baru
      const newFolderName = new_name;
      // path lama
      const oldPath = path.join(item.path as string);
      // buat folder dengan nama baru di path yang lama
      const newPath = path.join(path.dirname(oldPath), new_name);
      // apabila ada nama yang sama, maka batal
      if (fs.existsSync(newPath)) {
        throw new BadRequestError('File dengan nama tersebut sudah ada', 'update() error in class ItemControllers');
      }

      // lakukan pengulangan untuk grand child
      for (const i of items) {
        // ambil path dari tiap item (grand child)
        const oldPath = i.path;
        /*
          disini, semisal oldpath adalah "data/dataA/data.txt"
          dan yang diubah ada parent data menjadi "memo", maka path akan menjadi "memo/dataA/data.txt"
        */
        const newPath = oldPath?.replace(oldFolderName as string, newFolderName);
        // buat virtual path dari yang terbaru
        const formattedPath = newPath?.replace(/\\/g, ' ');

        // periksa apakah ini adalah parent folder yang diubah, jika iya maka update nama, path, dan virtual path
        // sedangkan jika ini adalah child atau grand child, maka hanya hapus path dan virtual path nya saja
        if (i.path == item.path) {
          await this.itemService.updateItem(id, new_name, newPath as string, formattedPath as string);
          try {
            fs.renameSync(item.path as string, newPath as string);
          } catch (err) {
            throw new BadRequestError(err as string, 'update() error in class ItemControllers');
          }
        } else {
          //
          await this.itemService.updateItemGrandChild(i.id as string, newPath as string, formattedPath as string);
        }
      }

      res.json({
        msg: 'Item (folder) berhasil diperbarui',
        status: StatusCodes.OK,
        result: { ...item, name: new_name }, // Update nama dan path di respons
        token: req.user?.acc_token
      });
    }
  });

  public delete = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    // ambil param dari item yang akan dihapus
    const { id } = req.params;
    const userId = req.user?.user_id;

    // ambil item
    const item = await this.itemService.getById(id);

    if (!item) {
      throw new NotFoundError('Item not found', 'delete() error in class ItemControllers');
    }

    // ambil path yang sekarang
    const itemPath = path.join(item.path as string);

    // jika folder, maka hapus di db secara rekursif dan hapus grand child, child, dan parent dari foldering
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

  public bulkDelete = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    // ambil param dari item yang akan dihapus
    const id: string[] = req.body.id;
    const userId = req.user?.user_id;

    for (const i of id) {
      const item = await this.itemService.getById(i);

      if (!item) {
        throw new NotFoundError('Item not found', 'delete() error in class ItemControllers');
      }

      // ambil path yang sekarang
      const itemPath = path.join(item.path as string);

      // jika folder, maka hapus di db secara rekursif dan hapus grand child, child, dan parent dari foldering
      if (item.type === 'folder') {
        await this.itemService.deleteItemRecursively(i);
        deleteFolderRecursive(itemPath);
      } else {
        // Jika file, hapus file secara langsung
        fs.unlinkSync(itemPath);
      }

      await this.itemService.deleteById(i, userId as string);
    }

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

    const { sortBy, sortDirection } = req.query;

    // ambil seluruh data berdasarkan parent
    const items = await this.itemService.getAllByParent(id, userId as string, sortBy as string, sortDirection as 'ASC' | 'DESC');
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

    // ambil item berdasarkan id dan user id
    const item = await this.itemService.getByIdAndUserId(id, userId as string);

    if (!item) {
      throw new NotFoundError('Item not found', 'openFile() error in class ItemControllers');
    }

    // jika ini bukan user yang sesuai, maka gagal
    if (userId !== item.user_id) {
      throw new Forbidden('Kamu tidak boleh akses ini', 'openFile() error in class ItemControllers');
    }

    // ambil path
    const filePath = item.path;
    const command =
      process.platform === 'win32'
        ? `start "" "${filePath}"`
        : process.platform === 'darwin'
          ? `open "${filePath}"`
          : `xdg-open "${filePath}"`;

    // open file
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

  public uploadFile = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    // Pastikan file sudah diupload
    const file = req.file;

    if (!file) {
      throw new BadRequestError('Gagal menemukan file', 'uploadFile() error in class ItemControllers');
    }

    // Ambil parent_id dari body
    const parent_id = req.body.parent_id as string;

    try {
      // Ambil ID parent dari database
      const item = await this.itemService.getById(parent_id);

      if (parent_id && !item) {
        throw new BadRequestError('Parent folder tidak ditemukan', 'createFile() error in class ItemControllers');
      }

      // ambil path dari item
      const dir = path.join(item.path as string);
      // buat file baru
      let filePath = path.join(dir, file.originalname);
      // buat virtual path
      let formattedPath = filePath.replace(/\\/g, ' ');

      // Buat folder jika belum ada
      fs.mkdirSync(dir, { recursive: true });

      const baseName = path.basename(file.originalname, path.extname(file.originalname)); // Nama file tanpa ekstensi
      const ext = path.extname(file.originalname); // Ekstensi file
      let count = 1;

      while (fs.existsSync(filePath)) {
        // Jika file ada, tambahkan counter pada nama file
        const newName = `${baseName}_${count}${ext}`;
        filePath = path.join(dir, newName);
        formattedPath = filePath.replace(/\\/g, ' ');
        count++;
      }

      // Pindahkan file dari lokasi sementara ke lokasi yang diinginkan
      fs.renameSync(file.path, filePath);

      // create item
      const newItem = await this.itemService.createItem({
        user_id: req.user?.user_id,
        name: path.basename(filePath),
        type: 'file',
        size: file.size,
        path: filePath,
        parent_id: parent_id || null,
        virtual_path: formattedPath
      });

      res.json({
        msg: 'Create file',
        status: StatusCodes.CREATED,
        result: newItem,
        token: req.user?.acc_token
      });
    } catch (error) {
      console.error('Error processing file upload:', error);
      res.status(500).send('Error processing file upload.');
    }
  });

  //
  public async copyFolderRecursive(sourceFolder: string, destinationFolder: string, parentId: string, userId: string): Promise<void> {
    // Buat folder tujuan jika belum ada
    fs.mkdirSync(destinationFolder, { recursive: true });

    // Ambil semua item dalam folder sumber
    const allItems = await fs.promises.readdir(sourceFolder, { withFileTypes: true });

    for (const item of allItems) {
      const sourceItemPath = path.join(sourceFolder, item.name);
      const destinationItemPath = path.join(destinationFolder, item.name);

      if (item.isDirectory()) {
        // Jika item adalah folder, buat folder baru dan simpan ke database
        const newParent = await this.itemService.createItem({
          name: item.name,
          parent_id: parentId, // Set parent_id ke parentId yang diterima
          path: destinationItemPath,
          size: 0, // Ukuran folder baru di-set ke 0
          type: 'folder',
          user_id: userId,
          virtual_path: destinationItemPath.replace(/\\/g, ' ')
        });

        // Panggil fungsi rekursif dengan newParent.id sebagai parent_id
        await this.copyFolderRecursive(sourceItemPath, destinationItemPath, newParent.id as string, userId);
      } else {
        // Jika item adalah file, salin file dan simpan ke database
        fs.copyFileSync(sourceItemPath, destinationItemPath);

        // Simpan informasi file ke dalam database
        await this.itemService.createItem({
          name: item.name,
          parent_id: parentId, // Set parent_id ke parentId yang diterima
          path: destinationItemPath,
          size: (await fs.promises.stat(sourceItemPath)).size, // Ambil ukuran file
          type: 'file',
          user_id: userId,
          virtual_path: destinationItemPath.replace(/\\/g, ' ')
        });
      }
    }
  }

  public copyHere = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(copyItemDTO.validate(req.body));

    if (error?.details) {
      throw new BadRequestError(error?.message, 'create() error in class ItemControllers');
    }

    const item = await this.itemService.getById(req.body.id);

    if (!item) {
      throw new BadRequestError('Parent folder tidak ditemukan', 'copyHere() error in class ItemControllers');
    }

    if (item.type === 'file') {
      // jenis file
      // ambil nama dari item (nama) check.txt
      const originalFileName = item.name as string;
      // ambil path dari item (path) D:\tes teknikal kerja\invokes\db\uploads\3e5f41c1-da16-429b-93ba-9aabc17a3011\kawankawan\check.txt
      const originalFilePath = path.dirname(item.path as string);
      // ambil format atau ekstensi
      const extension = path.extname(originalFileName);
      // ambil nama tanpa ekstensi
      const fileNameWithoutExt = path.basename(originalFileName, extension);
      let newFileName = originalFileName;
      let counter = 1;
      // buat file path, virtual path, dan file baru
      let newFilePath = path.join(originalFilePath, newFileName);
      let formattedPath = newFilePath.replace(/\\/g, ' ');
      while (fs.existsSync(newFilePath)) {
        // Jika ada, buat nama baru dengan format check_1.txt, check_2.txt, dst.
        newFileName = `${fileNameWithoutExt}_${counter}${extension}`;
        newFilePath = path.join(originalFilePath, newFileName);
        formattedPath = newFilePath.replace(/\\/g, ' ');
        counter++;
      }

      // tambah data (file)
      const newData = await this.itemService.createItem({
        name: newFileName,
        parent_id: item.parent_id,
        path: newFilePath,
        size: item.size,
        type: item.type,
        user_id: req.user?.user_id,
        virtual_path: formattedPath
      });

      // lalu copy file D:\tes teknikal kerja\invokes\db\uploads\3e5f41c1-da16-429b-93ba-9aabc17a3011\kawankawan\check_1.txt
      fs.copyFile(item.path as string, newFilePath, (err) => {
        if (err) {
          throw new BadRequestError('Gagal menyalin file', 'copyHere() error in class ItemControllers');
        } else {
          console.log(`File copied successfully as ${newFileName}`);
        }

        res.json({
          msg: 'Create file',
          status: StatusCodes.CREATED,
          result: newData,
          token: req.user?.acc_token
        });
      });
    } else {
      // jenis folder
      // ambil nama folder dan path item
      const originalFolderName = item.name as string;
      const originalFolderPath = item.path;

      // Counter untuk menghindari duplikasi nama folder
      let newFolderName = originalFolderName;
      let counter = 1;
      let newFolderPath = path.join(path.dirname(originalFolderPath as string), newFolderName);
      let formattedPath = newFolderPath.replace(/\\/g, ' ');

      // Buat nama folder baru jika sudah ada
      while (fsExtra.existsSync(newFolderPath)) {
        newFolderName = `${originalFolderName}_${counter}`;
        newFolderPath = path.join(path.dirname(originalFolderPath as string), newFolderName);
        formattedPath = newFolderPath.replace(/\\/g, ' ');
        counter++;
      }

      // Buat folder tujuan di file system
      await fs.promises.mkdir(newFolderPath, { recursive: true });

      // Simpan folder baru ke dalam database sebagai parent untuk file atau folder yang child dan grand childnya
      const newParent = await this.itemService.createItem({
        name: newFolderName,
        parent_id: item.parent_id,
        path: newFolderPath,
        size: 0, // Ukuran folder di-set ke 0
        type: 'folder',
        user_id: item.user_id,
        virtual_path: formattedPath
      });

      // Ambil semua item dalam folder lama
      const allItems = await fs.promises.readdir(originalFolderPath as string, { withFileTypes: true });

      for (const source of allItems) {
        // buat path baru untul child dan grand childnya, untuk sekarang yang dibuat adalah childnya, dan grand childnya akan dilakukan proses rekursif
        const originalItemPath = path.join(originalFolderPath as string, source.name);
        const newItemPath = path.join(newFolderPath, source.name);

        if (source.isDirectory()) {
          // Jika item adalah folder, rekursif ke dalamnya
          const fd = await this.itemService.createItem({
            name: source.name,
            parent_id: newParent.id,
            path: newItemPath,
            size: (await fs.promises.stat(originalItemPath)).size,
            type: 'folder',
            user_id: item.user_id,
            virtual_path: newItemPath.replace(/\\/g, ' ')
          });
          // disini proses rekursif untuk grand child
          await this.copyFolderRecursive(originalItemPath, newItemPath, fd.id as string, fd.user_id as string);
        } else {
          // Jika item adalah file, salin file
          fs.copyFileSync(originalItemPath, newItemPath);

          // Simpan informasi file ke dalam database
          await this.itemService.createItem({
            name: source.name,
            parent_id: newParent.id, // Set parent_id ke folder baru
            path: newItemPath,
            size: (await fs.promises.stat(originalItemPath)).size, // Dapatkan ukuran file
            type: 'file',
            user_id: item.user_id,
            virtual_path: newItemPath.replace(/\\/g, ' ')
          });
        }
      }

      // Kembalikan respons
      res.json({
        msg: 'Create folder',
        status: StatusCodes.CREATED,
        result: newParent,
        token: req.user?.acc_token
      });
    }
  });

  public copyPath = asyncHandler(async (req: AuthorizeRequest, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(copyItemPathDTO.validate(req.body));

    if (error?.details) {
      throw new BadRequestError(error?.message, 'create() error in class ItemControllers');
    }

    const { item_id, parent_id } = req.body;
    const itemToCopy = await this.itemService.getById(item_id);
    if (!itemToCopy) {
      throw new BadRequestError('Item yang akan disalin tidak ditemukan', 'copyPath() error in class ItemControllers');
    }

    const parentFolder = await this.itemService.getById(parent_id);
    if (!parentFolder) {
      throw new BadRequestError('Folder tujuan tidak ditemukan', 'copyPath() error in class ItemControllers');
    }

    if (itemToCopy.type === 'file') {
      // Buat nama file baru jika file dengan nama yang sama sudah ada
      const fileName = itemToCopy.name;
      let destinationPath = path.join(parentFolder.path as string, fileName as string);

      let counter = 1;
      const originalFileName = path.parse(fileName as string).name;
      const fileExtension = path.extname(fileName as string);

      // Cek apakah file dengan nama yang sama sudah ada
      while (fs.existsSync(destinationPath)) {
        const newFileName = `${originalFileName}_${counter}${fileExtension}`;
        destinationPath = path.join(parentFolder.path as string, newFileName);
        counter++;
      }

      fs.copyFileSync(itemToCopy.path as string, destinationPath);

      const newItem = await this.itemService.createItem({
        name: path.basename(destinationPath),
        parent_id: parent_id,
        path: destinationPath,
        size: (await fs.promises.stat(destinationPath)).size,
        type: 'file',
        user_id: itemToCopy.user_id, // Bisa menggunakan user yang sama dengan file asli
        virtual_path: destinationPath.replace(/\\/g, ' ') // Menghilangkan backslash untuk Windows
      });

      res.json({
        msg: 'Create file',
        status: StatusCodes.CREATED,
        result: newItem,
        token: req.user?.acc_token
      });
    } else {
      const originalFolderName = itemToCopy.name as string;
      let newFolderName = originalFolderName;
      let counter = 1;
      let newFolderPath = path.join(parentFolder.path as string, newFolderName);
      let formattedPath = newFolderPath.replace(/\\/g, ' ');

      // Create new folder name if it already exists
      while (fsExtra.existsSync(newFolderPath)) {
        newFolderName = `${originalFolderName}_${counter}`;
        newFolderPath = path.join(parentFolder.path as string, newFolderName);
        formattedPath = newFolderPath.replace(/\\/g, ' ');
        counter++;
      }

      // Create the new folder
      await fs.promises.mkdir(newFolderPath, { recursive: true });

      // Save new folder to database
      const newParent = await this.itemService.createItem({
        name: newFolderName,
        parent_id: parentFolder.id,
        path: newFolderPath,
        size: 0, // Size of folder set to 0
        type: 'folder',
        user_id: parentFolder.user_id,
        virtual_path: formattedPath
      });

      // Read all items in the original folder
      const allItems = await fs.promises.readdir(itemToCopy.path as string, { withFileTypes: true });
      for (const source of allItems) {
        const originalItemPath = path.join(itemToCopy.path as string, source.name);
        const newItemPath = path.join(newFolderPath, source.name); // Corrected path for new items

        if (source.isDirectory()) {
          // Recursively copy folders
          const fd = await this.itemService.createItem({
            name: source.name,
            parent_id: newParent.id,
            path: newItemPath,
            size: 0, // Size for folder
            type: 'folder',
            user_id: itemToCopy.user_id,
            virtual_path: newItemPath.replace(/\\/g, ' ')
          });
          await this.copyFolderRecursive(originalItemPath, newItemPath, fd.id as string, fd.user_id as string);
        } else {
          // Copy files
          fs.copyFileSync(originalItemPath, newItemPath);
          await this.itemService.createItem({
            name: source.name,
            parent_id: newParent.id, // Set parent_id to new folder
            path: newItemPath,
            size: (await fs.promises.stat(originalItemPath)).size, // Get file size
            type: 'file',
            user_id: itemToCopy.user_id,
            virtual_path: newItemPath.replace(/\\/g, ' ')
          });
        }
      }

      // Return response
      res.json({
        msg: 'Create folder',
        status: StatusCodes.CREATED,
        result: newParent,
        token: req.user?.acc_token
      });
    }
  });
}
