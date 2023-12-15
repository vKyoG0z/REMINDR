const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/group', async (req, res) => {
  const { groupName } = req.body;

  try {
    const newGroup = await prisma.group.create({
      data: {
        name: groupName,
        // Autres détails du groupe à enregistrer
      },
    });

    res.redirect(`/group.html?groupName=${encodeURIComponent(newGroup.name)}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la création du groupe');
  }
});

module.exports = router;
