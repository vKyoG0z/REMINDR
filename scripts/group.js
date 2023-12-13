const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require('express');
const { resolve } = require('path');
const router = express.Router();

// Middleware pour toutes les routes du routeur
router.use((req, res, next) => {
  // Vous pouvez effectuer des opérations ici avant que la logique de la route soit atteinte
  console.log('Middleware global');
  next(); // N'oubliez pas d'appeler next() pour passer à la prochaine fonction dans la chaîne
});

router.get('/group', (req, res) => {
  res.sendFile(resolve(__dirname, '../pages/group.html'));
});

router.post('/group', async (req, res) => {
  const { group_name } = req.body;

  try {
    const newGroup = await prisma.group.create({
      data: {
        name: group_name,
      },
    });

    res.status(200).json(newGroup);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la création du groupe');
  }
});

// À noter que vous avez une autre route GET pour /group qui renvoie la page login.html
// Cela pourrait être une erreur, assurez-vous que cela correspond à vos besoins
router.get('/group', (req, res) => {
  res.sendFile(resolve(__dirname, '../pages/login.html'));
});

module.exports = router;
