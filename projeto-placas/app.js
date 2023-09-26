const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const tesseract = require('tesseract.js');
const fs = require('fs');
const pdf = require('pdf-creator-node');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/meuBancoDeDados', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB'));
db.once('open', () => {
  console.log('Conectado ao MongoDB');
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const placaSchema = new mongoose.Schema({
  numeroPlaca: String,
  cidade: String,
  dataHora: {
    type: Date,
    default: Date.now,
  },
});

const Placa = mongoose.model('Placa', placaSchema);

app.use(express.json());

app.post('/cadastroPlaca', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== 'image/png') {
      return res.status(400).json({ message: 'A imagem deve estar no formato PNG' });
    }

    const { data: { text } } = await tesseract.recognize(req.file.buffer, 'eng');

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Não foi possível reconhecer a placa na imagem' });
    }

    const numeroPlaca = text.trim();

    const cidade = req.body.city;

    if (!cidade) {
      return res.status(400).json({ message: 'O nome da cidade é obrigatório' });
    }

    const novaPlaca = new Placa({
      numeroPlaca: numeroPlaca,
      cidade: cidade,
    });

    await novaPlaca.save();

    res.status(201).json({ message: 'Placa cadastrada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar a placa' });
  }
});

app.get('/relatorio/cidade/:cidade', async (req, res) => {
  try {
    const cidade = req.params.cidade;

    const placas = await Placa.find({ cidade: cidade });

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
      header: {
        height: '10mm',
      },
      footer: {
        height: '10mm',
      },
    };

    const htmlTemplate = `
      <html>
        <head>
          <title>Relatório de Placas</title>
        </head>
        <body>
          <h1>Relatório de Placas - Cidade: ${cidade}</h1>
          <table>
            <thead>
              <tr>
                <th>Número da Placa</th>
                <th>Data e Hora</th>
              </tr>
            </thead>
            <tbody>
              {{#each placas}}
              <tr>
                <td>{{this.numeroPlaca}}</td>
                <td>{{this.dataHora}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const data = {
      placas: placas,
    };

    const document = {
      html: htmlTemplate,
      data: data,
      path: './relatorio.pdf',
      type: '',
    };

    pdf
      .create(document, options)
      .then((result) => {
        console.log(result);

        res.download('./relatorio.pdf', 'relatorio.pdf', (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao enviar o relatório em PDF' });
          } else {
            fs.unlinkSync('./relatorio.pdf');
          }
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Erro ao gerar o relatório em PDF' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao gerar o relatório em PDF' });
  }
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
