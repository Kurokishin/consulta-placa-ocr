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

      //await placaSchema.save();
      //console.log(req.file, req.body);

      const cidade = req.body.cidade;
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);

      const { data } = await tesseract.recognize(
        `src/uploads/${req.file.filename}`,
        "por" // idioma de reconhecimento do OCR
        //{ logger: m => console.log(m) }
      );

      if (data && data.text) {
        const text = data.text.trim();
        console.log("Resultado do OCR:", text);

        const numeroPlaca = text;

        // Armazenar a data e hora atual
        const dataHora = new Date();

        // Criar e salvar o documento no MongoDB
        await placaSchema.create({ numeroPlaca, cidade, dataHora });

        res.json({ mensagem: "Cadastro realizado" });
        // Continuar com o processamento, armazenamento no banco de dados, etc.
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
      res.json({ error: true, mensagem: "Erro durante o cadastro" });
    }
  }
);

module.exports = cadastroPlacaRouter;
