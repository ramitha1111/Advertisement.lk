const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create folders if they don't exist
const createFolder = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};

// Dynamic storage destination based on field name
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/others/'; // default folder
        if (file.fieldname === 'categoryImage') {
            folder = 'uploads/categoryImages/';
        } else if (file.fieldname === 'profileImage') {
            folder = 'uploads/profileImages/';
        } else if (file.fieldname === 'featuredImage' || file.fieldname === 'images') {
            folder = 'uploads/advertisementImages/';
        }
        createFolder(folder);
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// File filter: Allow only image types
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.webp'];
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(mime)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
});

module.exports = upload;
