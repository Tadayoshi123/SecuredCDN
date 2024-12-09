const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const logger = require('../middlewares/logger');

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
}).single('image');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Upload image
const uploadImage = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            logger.error(`Upload error: ${err.message}`);
            return res.status(400).send({ message: err });
        }
        next();
    });
};

// Optimize image
const optimizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const filePath = path.join(__dirname, '../../uploads', req.file.filename);
    const optimizedPath = path.join(__dirname, '../../uploads', `optimized-${req.file.filename}`);

    try {
        const format = path.extname(req.file.originalname).toLowerCase().substring(1); // Obtenir le format du fichier original
        await sharp(filePath)
            .resize({ width: 800 }) // Redimensionner l'image à une largeur de 800 pixels
            .toFormat(format) // Convertir l'image au format original
            .toFile(optimizedPath);

        fs.unlinkSync(filePath); // Supprimer le fichier original
        req.file.path = optimizedPath;
        req.file.filename = `optimized-${req.file.filename}`;
        next();
    } catch (error) {
        logger.error(`Optimize error: ${error.message}`);
        res.status(400).send({ message: 'Error optimizing image' });
    }
};

const getAllImages = (req, res) => {
    const files = fs.readdirSync(path.join(__dirname, '../../uploads'));
    const images = files.filter((file) => {
        return /\.(jpe?g|png|gif|webp|avif)$/.test(file);
    });
    res.send(images);
};

module.exports = { uploadImage, optimizeImage, getAllImages };