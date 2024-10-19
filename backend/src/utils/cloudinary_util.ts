import cloudinary, { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

// fungsi untuk upload untuk semua jenis tipe file
export async function uploads(
  filePath: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  return new Promise((resolve, reject) => {
    try {
      // Upload file ke Cloudinary
      cloudinary.v2.uploader.upload(
        filePath,
        {
          public_id,
          overwrite, // Menentukan apakah file dengan public_id yang sama akan ditimpa jika sudah ada.
          invalidate, // Cloudinary akan menghapus cache gambar di CDN setelah file diunggah atau diubah.
          resource_type: 'auto',
          max_file_size: 1000000, // Maksimum 1mb
          // Cloudinary akan menambahkan sufiks unik ke file yang diunggah untuk menghindari konflik nama file
          unique_filename: true
        },
        (
          error: UploadApiErrorResponse | undefined, // Jika error
          result: UploadApiResponse | undefined // jika tidak error
        ) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else {
            console.log('Upload successful:', result);
            resolve(result);
          }
        }
      );
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      // Menolak Promise dengan pesan error
      reject(error);
    }
  });
}

// fungsi untuk upload untuk video
export async function videoUpload(
  filePath: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  return new Promise((resolve, reject) => {
    try {
      // Upload file ke Cloudinary
      cloudinary.v2.uploader.upload(
        filePath,
        {
          public_id,
          overwrite, // Menentukan apakah file dengan public_id yang sama akan ditimpa jika sudah ada.
          invalidate, // Cloudinary akan menghapus cache gambar di CDN setelah file diunggah atau diubah.
          resource_type: 'video',
          // Cloudinary akan menambahkan sufiks unik ke file yang diunggah untuk menghindari konflik nama file
          unique_filename: true,
          chunk_size: 5000000
        },
        (
          error: UploadApiErrorResponse | undefined, // Jika error
          result: UploadApiResponse | undefined // jika tidak error
        ) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else {
            console.log('Upload successful:', result);
            resolve(result);
          }
        }
      );
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      // Menolak Promise dengan pesan error
      reject(error);
    }
  });
}
