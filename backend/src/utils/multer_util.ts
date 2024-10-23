import path from 'path';

import multer from 'multer';

import { PLACE_TEMPO } from '../constant';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${PLACE_TEMPO}`); // Ganti dengan path yang Anda inginkan untuk file sementara
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Gunakan nama asli file
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Batas ukuran file 10MB
  fileFilter: (req, file, cb) => {
    console.log('Uploaded file:', file); // Log informasi file
    const filetypes = /jpeg|jpg|png|gif|txt|pdf|text\/plain/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error(`Error: File upload only supports the following filetypes - ${filetypes}`));
  }
});
