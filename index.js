require('dotenv').config();
const express = require('express');
const app = express();
const homepageRoute = require('./src/routes/homepageRoute');
const consultaPlacaRoute = require('./src/routes/consultaPlacaRoute');
const relatorioPlacaRouter = require('./src/routes/relatorioPlacaRoute');
const cadastroPlacaRouter = require('./src/routes/cadastroPlacaRoute');
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.json());

// // Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'src/public')));

// Usar o placaRouter para rota '/'
app.use('/', homepageRoute);
app.use('/', cadastroPlacaRouter);
//app.use('/', relatorioPlacaRouter);
//app.use('/', consultaPlacaRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro!');
});

app.listen(PORT, () => {
  console.log('Servidor está rodando');
});

