require('dotenv').config();
const placaRouter = require('express').Router();
const db = require('mongoose');
const multer = require('multer');
//const upload = multer({dest: 'uploads/'});
const tesseract = require('tesseract.js');
const pdf = require('pdf-creator-node');
const fs = require('fs');
const placaSchema = require('../models/placaSchema');

// Configurar o multer para lidar com uploads de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Rota POST para cadastrar placas
placaRouter.post('/cadastroPlaca', upload.single('file'), async (req, res) => {
  try {
    await db.connect(process.env.DB_CONNECTION)
      .then(() => console.log('Connected!'));
    //await placaSchema.create({numeroPlaca: numeroPlaca, cidade: cidade});

    if (!req.file || req.file.mimetype !== 'image/png') {
      return res.json({error: true, mensagem: 'A imagem deve estar no formato PNG'});
    }

    //await placaSchema.save();
    //console.log(req.file, req.body);

    const cidade = req.body.cidade;
    //console.log(cidade)

    const result = await tesseract.recognize(
      `src/uploads/${req.file.filename}`,
      'eng', // idioma de reconhecimento (pode ser ajustado)
      { logger: m => console.log(m) }
    );
    console.log(result)

    const numeroPlaca = result.data.text.trim();

    // Armazenar a data e hora atual
    const dataHora = new Date();

    // Criar e salvar o documento no MongoDB
    await placaSchema.create({ numeroPlaca, cidade, dataHora });

    res.json({mensagem: 'Cadastro realizado'});
  } catch (error) {
    console.error(error)
    res.json({error: true, mensagem: 'Erro durante o cadastro'});
  }
});

// Rota GET para gerar um PDF de relatório com base na cidade
placaRouter.get('/relatorio/cidade/:cidade', async (req, res) => {
  try {
    const cidade = req.params.cidade;

    // Consulte o MongoDB para obter registros com a cidade especificada
    const placas = await placaSchema.find({ cidade: cidade });

    // Crie um objeto de opções para o PDF
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

    // Defina o caminho do modelo HTML para o relatório
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
                <td>{{this.createdAt}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Defina os dados a serem passados para o modelo HTML
    const data = {
      placas: placas,
    };

    // Crie o PDF usando pdf-creator-node
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
        res.sendFile('relatorio.pdf', { root: '.' });
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

module.exports = placaRouter;
