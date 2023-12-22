//Module utilisé
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

//Récuperation des Routers
const groupRouter = require('./routers/groupRouter'); //Import de groupRouter
app.use('/group', groupRouter);

const userRouter = require('./routers/UserRouter'); //Import de UserRouter
app.use('/users', userRouter); // Utilisation du routeur des utilisateurs

const userController = require('./controllers/UserController'); //Import de userControlle


//Page de base à la racine du projet
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

//Connexion
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

//Dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/pages/dashboard.html');
});

app.post('/login', async (req, res) => {
  await userController.loginUser(req, res);
});



app.get('/status', (req, res) => {
  userController.checkStatus(req, res);
});

app.use('/pages', express.static(__dirname + '/pages'));

app.get('/logout', (req, res) => {
  userController.logoutUser(req, res);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

