const request = require("supertest");
const express = require("express");
const app = express();
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const consultaPlacaRoute = require("../routes/consultaPlacaRoute");
const placaSchema = require("../models/placaSchema");

// Divide o JSON da request e coloca no req.body
app.use(express.json());

// Configure o app para tratar os middlewares necessários
app.use("/consulta", consultaPlacaRoute);

describe("Rota de consulta de placas", () => {
  // Restaurar todos os stubs antes de cada teste
    beforeEach(() => {
    sinon.restore();
  });

  it("Deve retornar que a placa existe no banco de dados", async () => {
    const placa = "DOK2A20";

    // Simule a existência da placa no banco de dados
    const findOneStub = sinon.stub(placaSchema, "findOne");
    findOneStub.withArgs({ numeroPlaca: placa }).resolves({ numeroPlaca: placa });

    // Simule um token JWT falso
    const fakeToken = jwt.sign({ userId: "15487" }, "8878787");

    const response = await request(app)
      .get(`/consulta/${placa}`)
      .set("Authorization", `Bearer ${fakeToken}`) // Usa o token falso
      .expect(200);

    expect(response.body.mensagem).toBe("A placa existe no banco de dados");
    expect(response.body.existe).toBe(true);
  });
});