const relatorioPlacaRouter = require("express").Router();
const PDFDocument = require("pdfkit");
const placaSchema = require("../models/placaSchema");
const connectDatabase = require("../utils/connectDatabase");
const verifyToken = require("../utils/verifyToken");
const capitalizeFirstLetter = require("../utils/capitalizeFirstLetter");

// Rota para verificar placas cadastradas de uma determinada cidade
relatorioPlacaRouter.get("/relatorio/cidade/:cidade", verifyToken, async (req, res) => {
  try {
    
    // Conexão com banco de dados
    connectDatabase();

    // Fazendo a pesquisa com as iniciais em maiúsculo
    const cidade = capitalizeFirstLetter(req.params.cidade);

    // Consulta o MongoDB para obter registros com a cidade especificada
    const placas = await placaSchema.find({ cidade: cidade });

    // Cria um novo documento PDF
    const doc = new PDFDocument();

    // Define o tipo de conteúdo do cabeçalho da resposta HTTP
    res.setHeader("Content-Type", "application/pdf");

    // Define o cabeçalho Content-Disposition para que o navegador solicite o download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio_${cidade}.pdf"`
    );

    // Encaminha o PDF diretamente para a resposta HTTP
    doc.pipe(res);

    // Cabeçalho do PDF
    doc.fontSize(14).text("Relatório de Placas", { align: "center" });
    doc.fontSize(12).text(`Cidade: ${cidade}`, { align: "left" });
    doc.moveDown(0.5);

    // Corpo do arquivo
    placas.forEach((placa) => {
      doc.text(`Número da placa: ${placa.numeroPlaca}`);
      doc.text(`Data e hora: ${placa.dataHora.toLocaleString("pt-BR")}`);
      doc.moveDown(0.5);
    });

    // Finaliza o documento
    doc.end();
    //res.json({mensagem: 'PDF gerado com sucesso!'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao gerar o relatório em PDF" });
  }
});

module.exports = relatorioPlacaRouter;
