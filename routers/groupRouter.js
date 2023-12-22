const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
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

    
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la création du groupe');
  }
});

router.get('/user-groups', async (req, res) => {
  const userId = req.session.userId; // Obtient l'ID de l'utilisateur connecté depuis la session

  try {
    const userGroups = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        groups: true,
      },
    });

    res.status(200).json(userGroups.groups);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des groupes de l\'utilisateur');
  }
});

module.exports = router;
