const cadastroPlacaRouter = require("express").Router();
const multer = require("multer");
const tesseract = require("tesseract.js");
const placaSchema = require("../models/placaSchema");
const connectDatabase = require("../utils/connectDatabase");
const verifyToken = require("../utils/verifyToken");

// Configurar o multer para lidar com uploads de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Conexão com banco de dados
connectDatabase();

// Rota POST para cadastrar placas
cadastroPlacaRouter.post("/cadastroPlaca", upload.single("file"), verifyToken, async (req, res) => {
    try {
      if (!req.file || req.file.mimetype !== "image/png") {
        return res.json({
          error: true,
          mensagem: "A imagem deve estar no formato PNG",
        });
      }

      const cidade = req.body.cidade;

      const { data } = await tesseract.recognize(
        `src/uploads/${req.file.filename}`,
        "por" // idioma de reconhecimento do OCR
        //{ logger: m => console.log(m) }
      );

      if (data && data.text) {
        // Remove caracteres especiais e qualquer caractere de espaço
        const numeroPlaca = data.text.replace(/[\s-"“.._]/g, '');
        console.log("\nResultado do OCR:", numeroPlaca);

        // Armazena a data e hora atual
        const dataHora = new Date();

        // Cria e salva o documento no MongoDB
        await placaSchema.create({ numeroPlaca, cidade, dataHora });

        res.json({ mensagem: "Cadastro de placa realizado" });
      } else {
        console.error("Nenhum texto reconhecido pelo OCR.");
        res.json({
          error: true,
          mensagem:
            "Nenhum texto reconhecido pelo OCR, por favor tente usar outra imagem",
        });
      }
    } catch (error) {
      console.error(error);
      res.json({ error: true, mensagem: "Erro durante o cadastro da placa" });
    }
  }
);

module.exports = cadastroPlacaRouter;
