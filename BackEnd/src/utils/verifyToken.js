const jwt = require("jsonwebtoken");

require("dotenv").config();

// Verificar se a requisição possui token válido, e portanto, o usuário está logado
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ logged: false, message: "Token inválido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        logged: false,
        message: "Falha na autenticação, verifique seu token e tente novamente",
      });
    }

    next();
  });
};

module.exports = verifyToken;
