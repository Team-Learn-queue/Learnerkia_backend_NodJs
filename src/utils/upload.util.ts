import multer from 'multer';
import AWS from 'aws-sdk';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  }
})

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});