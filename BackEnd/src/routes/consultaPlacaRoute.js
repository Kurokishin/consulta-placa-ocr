const consultaPlacaRoute = require('express').Router();
const placaSchema = require('../models/placaSchema');
const connectDatabase = require("../utils/connectDatabase");

consultaPlacaRoute.get('/consulta/:placa', async (req, res) => {
    try {

        // Conexão com banco de dados
        connectDatabase();

        const numeroPlaca = req.params.placa;

        // Consulte o MongoDB para verificar se a placa existe
        const placa = await placaSchema.findOne({ numeroPlaca });

        if (placa) {
            // Se a placa existir no banco de dados, retorne uma resposta com sucesso
            res.json({ mensagem: 'A placa existe no banco de dados', existe: true });
        } else {
            // Se a placa não existir no banco de dados, retorne uma resposta indicando que não existe
            res.json({ mensagem: 'A placa não existe no banco de dados', existe: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao consultar a placa' });
    }
});

module.exports = consultaPlacaRoute;