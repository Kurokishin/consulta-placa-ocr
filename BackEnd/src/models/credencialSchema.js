const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a estrutura do modelo de armazenamento das credenciais
const credencialSchema = new Schema({
  email: String,
  password: String,
});

// Exporta o modelo para uso em outras partes do seu aplicativo
module.exports = mongoose.model('Credenciais', credencialSchema);
