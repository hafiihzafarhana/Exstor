import path from 'path';

import multer from 'multer';

// Konfigurasi penyimpanan untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder di mana file akan disimpan
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Menambahkan timestamp
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Menyimpan dengan nama unik
  }
});

// Inisialisasi multer dengan konfigurasi
const upload = multer({ storage });

export { upload };
