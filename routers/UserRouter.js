const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.get('/inscription', (req, res) => {
  res.sendFile(resolve(__dirname, '../pages/inscription.html'));
});

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

    res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la création de l\'utilisateur');
  }
});

router.get('/connexion', (req, res) => {
  res.sendFile(resolve(__dirname, '../pages/login.html'));
});

module.exports = router;
