const cadastroCredencialRouter = require("express").Router();
const bcrypt = require('bcrypt');
const credencialSchema = require("../models/credencialSchema");
const connectDatabase = require("../utils/connectDatabase");
const checkExistingUser = require("../utils/checkExistingUser");

// Rota POST para cadastrar as credenciais
cadastroCredencialRouter.post('/cadastro', async (req, res) => {
    try {

        // Conexão com banco de dados
        connectDatabase();

        const { email, password } = req.body;

        // Verifica se o email já existe no banco de dados
        const existingUser = await checkExistingUser(email, res);
        if (existingUser) {
          return;
        }

        // Configura e criptografa a senha do usuário
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