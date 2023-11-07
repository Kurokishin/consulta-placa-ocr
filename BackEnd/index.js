require("dotenv").config();
const express = require("express");
const app = express();
const consultaPlacaRoute = require("./src/routes/consultaPlacaRoute");
const relatorioPlacaRoute = require("./src/routes/relatorioPlacaRoute");
const cadastroPlacaRoute = require("./src/routes/cadastroPlacaRoute");
const cadastroCredencialRoute = require("./src/routes/cadastroCredencialRoute");
const loginRoute = require("./src/routes/loginRoute");
const alertaRoute = require("./src/routes/alertaRoute");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

app.use(express.json());

// Configurando CORS manualmente
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://consulta-placa-ocr.vercel.app");
  // Outros cabeçalhos CORS
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "src/public")));

// Usar o placaRouter para rota '/'
app.use("/", cadastroPlacaRoute);
app.use("/", relatorioPlacaRoute);
app.use("/", consultaPlacaRoute);
app.use("/", cadastroCredencialRoute);
app.use("/", loginRoute);
app.use("/", alertaRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erro!");
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
