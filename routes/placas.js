const express = require('express');
const router = express.Router();
const multer = require('multer');
const tesseract = require('tesseract.js');
const Placa = require('../models/placa');
const pdf = require('pdf-creator-node');
const fs = require('fs');

// Configurar o multer para lidar com uploads de imagens
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota POST para cadastrar placas
router.post('/cadastroPlaca', upload.single('image'), async (req, res) => {
  try {
    // Verifique se a extensão do arquivo é PNG
    if (!req.file || req.file.mimetype !== 'image/png') {
      return res.status(400).json({ message: 'A imagem deve estar no formato PNG' });
    }

    // Realize o reconhecimento de caracteres (OCR) na imagem
    const { data: { text } } = await tesseract.recognize(req.file.buffer, 'eng');
    const numeroPlaca = text.trim();
    const cidade = req.body.city;

    // Crie uma nova instância de Placa e salve-a no MongoDB
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

// Rota GET para gerar um PDF de relatório com base na cidade
router.get('/relatorio/cidade/:cidade', async (req, res) => {
  try {
    const cidade = req.params.cidade;

    // Consulte o MongoDB para obter registros com a cidade especificada
    const placas = await Placa.find({ cidade: cidade });

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

module.exports = router;
