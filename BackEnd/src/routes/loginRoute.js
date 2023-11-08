require("dotenv").config();
const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const credencialSchema = require("../models/credencialSchema");

// Verifica se o email e senha são os mesmos do banco de dados e retorna um token para o usuário
loginRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o email existe no banco de dados
    const user = await credencialSchema.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email não existe ou está incorreto!" });
    }

    // Verifica se a senha está correta
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    // Se o email e a senha estiverem corretos, gera um token JWT

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    // ,
    //   {
    //     expiresIn: "300000", // O token expirará após 1 minuto
    //   }

    res.status(200).json({ logged: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ logged: false, message: "Erro no servidor" });
  }
});

module.exports = loginRouter;
