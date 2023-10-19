require("dotenv").config();
const cadastroCredencialRouter = require("express").Router();
const db = require("mongoose");
const bcrypt = require('bcrypt');
const credencialSchema = require("../models/credencialSchema");

// Conexão com banco de dados
db.connect(process.env.DB_CONNECTION)
  .then(() => console.log("Connected to the database!"))
  .catch((error) => console.error("Failed to connect to the database:", error));

  // Rota POST para cadastrar placas
cadastroCredencialRouter.post('/cadastro', async (req, res) => {
    try {
        const { email, password } = req.body;

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Cria um novo usuário
        const newUser = new credencialSchema({
            email,
            password: hashedPassword
        });

        // Salva o novo usuário no banco de dados
        await newUser.save();

        res.status(201).json({ message: 'Usuário cadastrado com sucesso'});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

module.exports = cadastroCredencialRouter;