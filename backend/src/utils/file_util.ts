import path from 'path';
import fs from 'fs';

export function checkFormatFile(fileName: string): boolean {
  const spliceData = fileName.split('.');
  const checkType = spliceData[spliceData.length - 1];
  const dt = new Set(['txt', 'xlsx', 'docx', 'pdf']);
  return dt.has(checkType) ? true : false;
}

export function deleteFolderRecursive(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const currentPath = path.join(dirPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        // Jika ini folder, lakukan rekursi
        deleteFolderRecursive(currentPath);
      } else {
        // Jika ini file, hapus file
        fs.unlinkSync(currentPath);
      }
    });
    // Setelah semua file di dalam folder dihapus, hapus foldernya sendiri
    fs.rmdirSync(dirPath);
  }
}
