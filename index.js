require('dotenv').config();
const express = require('express');
const app = express();
const placaRouter = require('./src/routes/placaRouter');
const path = require('path');

app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'src/public')));

// Usar o placaRouter para rota '/'
app.use('/', placaRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor está rodando');
});
