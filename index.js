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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor está rodando');
});
