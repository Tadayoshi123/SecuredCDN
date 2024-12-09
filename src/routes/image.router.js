const express = require('express');
const { verifyToken } = require('../middlewares/verifyToken');
const { uploadImage, optimizeImage, getAllImages } = require('../controllers/image.controller');
const router = express.Router();

router.post('/upload', verifyToken, uploadImage, optimizeImage, (req, res) => {
    res.send({
        message: 'Image uploaded and optimized successfully',
        file: req.file,
    });
});

router.get('/all', verifyToken, getAllImages);

module.exports = router;