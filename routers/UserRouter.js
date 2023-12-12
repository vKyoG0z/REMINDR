const express = require('express');
const { resolve } = require('path');
const router = express.Router();

//Route vers le formulaire d'inscription.
router.get('/inscription', (req, res) => {
  res.sendFile(resolve(__dirname, '../pages/inscription.html'));
});

//Récupere les informations du formulaire d'inscription
router.post('/inscription', async (req, res) => {
  const { email, username, password } = req.body;
  // Logique pour gérer l'inscription avec Prisma
});

//Router vers le formulaire de connexion
router.get('/connexion', (req, res) => {
  res.sendFile(resolve(__dirname, '../pages/login.html'));
});

//Export du router.
module.exports = router;
