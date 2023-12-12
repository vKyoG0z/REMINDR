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
app.use(bodyParser.urlencoded({ extended: true })); // Utilisez body-parser pour les données de formulaire
app.use(bodyParser.json()); 

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
    res.send('Login successful!');
  } else {
    res.send('Invalid credentials.');
  }
});

// Endpoint pour vérifier l'état de l'authentification
app.get('/status', (req, res) => {
  if (req.session.authenticated) {
    res.send('User is authenticated!');
  } else {
    res.send('User is not authenticated.');
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
