const express = require('express');
const router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/create-group', async (req, res) => {
  const { groupName } = req.body;
  const userId = req.session.userId; // Obtient l'ID de l'utilisateur connecté depuis la session

  try {
    // Vérifie si le nom du groupe est déjà utilisé
    const existingGroup = await prisma.group.findFirst({
      where: {
        name: groupName,
      },
    });

    if (existingGroup) {
      return res.status(400).send('Un groupe avec ce nom existe déjà.');
    }

    const newGroup = await prisma.group.create({
      data: {
        name: groupName,
        members: { connect: { id: userId } } // Associe l'utilisateur au groupe
      },
    });

    res.redirect('/dashboard'); // Redirige vers le tableau de bord après la création du groupe
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la création du groupe');
  }
});

module.exports = router;


module.exports = router;
