// multer-config.js  ← FINAL VERSION
const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  secure: true,
  ...(process.env.CLOUDINARY_URL
    ? { url: process.env.CLOUDINARY_URL }
    : {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      }),
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, file) =>
      file.fieldname === 'cardimage'
        ? 'clothing/cardimages'
        : 'clothing/productimages',
    format: async (req, file) => path.extname(file.originalname).slice(1),
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  },
});

module.exports = upload; // ← JUST MULTER, NO .fields()