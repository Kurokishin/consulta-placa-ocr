const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mongoose.connect('mongodb://localhost:27017/local', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB'));
// db.once('open', () => {
//   console.log('Conectado ao MongoDB');
// });

// Defina a estrutura do modelo de placa
const placaSchema = new Schema({
  numeroPlaca: String,
  cidade: String,
  dataHora: {
    type: Date,
    default: Date.now
  }
});

// Crie o modelo 'Placa' com base no esquema
//const Placa = mongoose.model('Placa', placaSchema);

// Exporte o modelo para uso em outras partes do seu aplicativo
module.exports = mongoose.model('Placa', placaSchema);
