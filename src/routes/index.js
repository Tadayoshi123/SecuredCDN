const express = require('express');
const { verifyToken, generateToken } = require('../middlewares/verifyToken');
const imageRoutes = require('./image.router');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Secured CDN API');
});

// Route protégée
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'This is a protected route',
        user: req.user
    });
});

// Route pour générer un token
router.get('/generate-token', (req, res) => {
    const token = generateToken({ username: 'john_doe' });
    res.status(200).json({ token });
});

// Routes pour les images
router.use('/images', imageRoutes);

module.exports = router;