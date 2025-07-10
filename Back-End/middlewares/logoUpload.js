// Back-End/middlewares/logoUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create folders if they don't exist
const createFolder = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};

// Storage configuration for logos and favicons
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/logos/';

        if (file.fieldname === 'favicon') {
            folder = 'uploads/favicons/';
        }

        createFolder(folder);
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = file.fieldname === 'favicon' ?
            `favicon-${Date.now()}${ext}` :
            `logo-${Date.now()}${ext}`;
        cb(null, fileName);
    }
});

// File filter for logos and favicons
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.svg', '.ico'];
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/svg+xml',
        'image/x-icon',
        'image/vnd.microsoft.icon'
    ];

    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(mime)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, SVG, ICO) are allowed for logos and favicons!'), false);
    }
};

// Size limits: 5MB for logos, 1MB for favicons
const upload = multer({
    storage,
    limits: {
        fileSize: (req, file, cb) => {
            if (file.fieldname === 'favicon') {
                return 1 * 1024 * 1024; // 1MB for favicon
            }
            return 5 * 1024 * 1024; // 5MB for logo
        }
    },
    fileFilter
});

module.exports = upload;