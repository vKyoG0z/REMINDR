const express = require('express');
const { resolve } = require('path');
const handlebars = require('handlebars');
const bodyParser = require('body-parser'); // Importez body-parser
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const port = 3010;


app.use(express.static('static'));
app.use(express.static('pages'));
app.use(bodyParser.urlencoded({ extended: true })); // Utilisez body-parser pour les données de formulaire
app.use(bodyParser.json()); 


const groupRouter = require('./routers/groupRouter'); 
app.use('/group', groupRouter); // Utilise '/group' au lieu de '/pages/group'



// Utilisez le routeur pour les routes liées aux utilisateurs
const userRouter = require('./routers/UserRouter');
app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.use(session({
  secret: 'mySecretKey', // Clé secrète pour signer la session, à remplacer par votre propre clé
  resave: false,
  saveUninitialized: true
}));

// Endpoint pour afficher le formulaire de connexion
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/pages/dashboard.html');
});

// Endpoint pour gérer la soumission du formulaire de connexion
app.post('/login',async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username // Utiliser le champ correspondant à votre modèle Prisma
    }
  });

  if (user && user.password === password) {
    req.session.authenticated = true; // Marquer l'utilisateur comme authentifié
    //res.send('Login successful!');
    res.redirect('/dashboard');
  } else {
    res.send('identifiant ou mot de passe incorrect');
  }
});

// Endpoint pour vérifier l'état de l'authentification
app.get('/status', (req, res) => {
  if (req.session.authenticated) {
    res.send('Utilisateur connecté!');
  } else {
    res.send('Utilisateur nest pas connecté.');
  }
});



app.use('/pages', express.static(__dirname + '/pages'));


//Gestion de la déconnexion
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send('Erreur lors de la déconnexion');
    } else {
      res.redirect('/pages/login.html'); // Redirige vers la route de connexion
    }
  });
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
