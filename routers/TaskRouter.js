const express = require('express');
const router = express.Router();

// Importez vos routes spécifiques
const authRoutes = require('./auth');

// Utilisez les routes
router.use('/auth', authRoutes);

// Exportez le routeur
module.exports = router;
