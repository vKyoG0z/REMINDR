const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/create-group', async (req, res) => {
  const { groupName } = req.body;
  const userId = req.session.userId; // Obtient l'ID de l'utilisateur connecté depuis la session

  try {
    const newGroup = await prisma.group.create({
      data: {
        name: groupName,
        // Autres détails du groupe à enregistrer
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
