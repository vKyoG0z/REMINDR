const express = require('express');
const { resolve } = require('path');
const handlebars = require('handlebars');

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


const app = express();
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});