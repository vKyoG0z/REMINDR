const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLoginPage = (req, res) => {
  res.sendFile(__dirname + '/../pages/login.html');
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  });

  if (user && user.password === password) {
    req.session.authenticated = true;
    res.redirect('/dashboard');
  } else {
    res.send('identifiant ou mot de passe incorrect');
  }
};

const checkStatus = (req, res) => {
  if (req.session.authenticated) {
    res.send('Utilisateur connecté!');
  } else {
    res.send('Utilisateur nest pas connecté.');
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send('Erreur lors de la déconnexion');
    } else {
      res.redirect('/pages/login.html');
    }
  });
};

module.exports = { getLoginPage, loginUser, checkStatus, logoutUser };
