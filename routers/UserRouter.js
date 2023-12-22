const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

//Route vers la page d'inscription
router.get('/inscription', (req, res) => {
  res.sendFile(resolve(__dirname, '/inscription.html'));
});

//Recupere les donnéesdu formulaire d'inscription et créer l'utilisateur
router.post('/inscription', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password,
      },
    });
    res.redirect(`/pages/login.html`);
   //res.status(200).json(newUser);

  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la création de lutilisateur');
  }
});

//Route vers la page de connexion
router.get('/connexion', (req, res) => {
  res.sendFile(resolve(__dirname, '/login.html'));
});

module.exports = router;
