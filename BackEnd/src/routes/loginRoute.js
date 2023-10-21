const loginRouter = require("express").Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const credencialSchema = require('../models/credencialSchema');


loginRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o email existe no banco de dados
    const user = await credencialSchema.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Dados incorretos' });
    }

    // Verifica se a senha está correta
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Dados incorretos' });
    }

    // Se o email e a senha estiverem corretos, gera um token JWT
    const token = jwt.sign({ email: user.email, password: user.password }, process.env.JWT_SECRET, {
      expiresIn: 30000 // O token expirará após 30 segundos
    });

    res.status(200).json({ logged: true, token: token });
  } catch (error) {
    console.error(error);
    res.json({ logged: false, message: 'Erro durante o login' });
  }
});

module.exports = loginRouter;
