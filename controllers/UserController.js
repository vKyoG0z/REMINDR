const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Gére la connexion en verifant le mot de passe et le nom d'utilisateur
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  });

  if (user && user.password === password) {
    req.session.authenticated = true;
    res.redirect('/dashboard'); //Redirige vers son dashboard
  } else {
    res.send('identifiant ou mot de passe incorrect');
  }
};

//Permet de verifier le status de l'utilisaateur (connecter ou pas)
const checkStatus = (req, res) => {
  if (req.session.authenticated) {
    res.send('Utilisateur connecté!');
  } else {
    res.send('Utilisateur nest pas connecté.');
  }
};

//Deconnexion de l'utilisateur
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send('Erreur lors de la déconnexion');
    } else {
      res.redirect('/pages/login.html');
    }
  });
};

module.exports = { loginUser, checkStatus, logoutUser };
