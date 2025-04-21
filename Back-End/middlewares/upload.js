const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create folders if not exist
const createFolder = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};

// Dynamic storage destination based on field name
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'assets/uploads/others/';
        if (file.fieldname === 'categoryImage') {
            folder = 'uploads/categoryImages/';
        } else if (file.fieldname === 'profileImage') {
            folder = 'uploads/profileImages/';
        } else if (file.fieldname === 'advertisementImage') {
            folder = 'uploads/advertisementImages/';
        }
        createFolder(folder);
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter: Only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
        allowedTypes.test(file.mimetype);
    cb(null, isValid ? true : false);
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
});

module.exports = upload;
