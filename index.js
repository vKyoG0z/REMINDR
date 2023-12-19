const express = require('express');
const { resolve } = require('path');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.static('pages'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true
}));

const groupRouter = require('./routers/groupRouter');
app.use('/group', groupRouter);

const userRouter = require('./routers/UserRouter');
app.use('/users', userRouter); // Utilisation du routeur des utilisateurs

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/pages/dashboard.html');
});

app.post('/login', async (req, res) => {
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
});

app.get('/status', (req, res) => {
  if (req.session.authenticated) {
    res.send('Utilisateur connecté!');
  } else {
    res.send('Utilisateur nest pas connecté.');
  }
});

app.use('/pages', express.static(__dirname + '/pages'));

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send('Erreur lors de la déconnexion');
    } else {
      res.redirect('/pages/login.html');
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
