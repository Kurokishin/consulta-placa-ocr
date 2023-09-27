const express = require('express');
const app = express();
const placaRouter = require('./src/routers/placaRouter');
const path = require('path');

const port = 3000;

app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'src/public')));

// Usar o placaRouter para rota '/'
app.use('/', placaRouter);

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
