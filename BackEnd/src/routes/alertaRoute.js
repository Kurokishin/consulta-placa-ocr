const app = require('express')();
const alertaRoute = require("express").Router();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const verifyToken = require("../utils/verifyToken");
const port = process.env.PORT || 5870;

app.get('/alerta', (req, res) => {
    res.sendFile(__dirname + '/teste.html');
});

// Configura o servidor
io.on('connection', (socket) => {
  console.log('Um usuário se conectou.');

  // Lida com a saída de um usuário
  socket.on('disconnect', () => {
    console.log('Um usuário se desconectou.');
  });
});

const bodyParser = require('body-parser');

// Configura o middleware body-parser
app.use(bodyParser.json());

// Rota POST para enviar alertas
alertaRoute.post('/alerta', verifyToken, (req, res) => {
  const mensagem = 'Inconsistência de dados ou equipamentos foram detectados no sistema';

  // Emitir a notificação para todos os usuários conectados
  io.emit('alerta', mensagem);

  res.status(200).json({ message: 'Alerta enviado com sucesso' });
});

server.listen(port, () => {
    console.log(`O cliente está rodando na porta ${port}`);
});

module.exports = alertaRoute;