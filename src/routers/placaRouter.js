require('dotenv').config();
const placaRouter = require('express').Router();
const db = require('mongoose');
const multer = require('multer');
const tesseract = require('tesseract.js');
const PDFDocument = require("pdfkit");
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

    // Conexão com banco de dados
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

    // const result = await tesseract.recognize(
    //   `src/uploads/${req.file.filename}`,
    //   'por', // idioma de reconhecimento (pode ser ajustado)
    //   { logger: m => console.log(m) }
    // ).then(({ data: { text } }) => {
    //   console.log(text);
    // })
    //console.log('resultado do ocr:', result.data.text)
    //console.log(result)
    const { data } = await tesseract.recognize(
      `src/uploads/${req.file.filename}`,
      'por', // idioma de reconhecimento
      { logger: m => console.log(m) }
    );
    
    if (data && data.text) {
      const text = data.text.trim();
      console.log('Resultado do OCR:', text);
  
      const numeroPlaca = text;

      // Armazenar a data e hora atual
      const dataHora = new Date();

      // Criar e salvar o documento no MongoDB
      await placaSchema.create({ numeroPlaca, cidade, dataHora });
  
      // Continuar com o processamento, armazenamento no banco de dados, etc.
    } else {
      console.error('Nenhum texto reconhecido pelo OCR.');
    }

    //const numeroPlaca = result.data.text.trim();

    res.json({mensagem: 'Cadastro realizado'});
  } catch (error) {
    console.error(error)
    res.json({error: true, mensagem: 'Erro durante o cadastro'});
  }
});

// Rota GET para gerar um PDF de relatório com base na cidade
placaRouter.get('/relatorio/cidade/:cidade', async (req, res) => {
  try {

    // Conexão com banco de dados
    await db.connect(process.env.DB_CONNECTION)
      .then(() => console.log('Connected!'));

    const cidade = req.params.cidade;

    // Consulta o MongoDB para obter registros com a cidade especificada
    const placas = await placaSchema.find({ cidade: cidade });

    // Cria um novo documento PDF
    const doc = new PDFDocument();

    // Define o tipo de conteúdo do cabeçalho da resposta HTTP
    res.setHeader('Content-Type', 'application/pdf');

    // Define o cabeçalho Content-Disposition para que o navegador solicite o download
    res.setHeader('Content-Disposition', `attachment; filename="relatorio_${cidade}.pdf"`);

    // Encaminha o PDF diretamente para a resposta HTTP
    doc.pipe(res);

    // Cabeçalho do PDF
    doc.fontSize(14).text("Relatório de Placas", { align: "center" });
    doc.fontSize(12).text(`Cidade: ${cidade}`, { align: "left" });
    doc.moveDown(0.5);

    // Corpo do arquivo
    placas.forEach((placa) => {
      doc.text(`Número da placa: ${placa.numeroPlaca}`);
      doc.text(`Data e hora: ${placa.dataHora.toLocaleString('pt-BR')}`);
      doc.moveDown(0.5);
    });

    // Finaliza o documento
    doc.end();
    //res.json({mensagem: 'PDF gerado com sucesso!'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao gerar o relatório em PDF' });
  }
});

module.exports = placaRouter;
