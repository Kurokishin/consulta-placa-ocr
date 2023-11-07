const request = require("supertest");
const express = require("express");
const app = express();
const sinon = require("sinon");
const loginRouter = require("../routes/loginRoute");
const credencialSchema = require("../models/credencialSchema");

// Divide o JSON da request e coloca no req.body
app.use(express.json());

//Caminho padrão para a rota
app.use("/", loginRouter);

// Função para criar um stub para credencialSchema.findOne()
function createFindOneStub(email, user) {
    const findOneStub = sinon.stub(credencialSchema, "findOne");
    findOneStub.withArgs({ email }).resolves(user);
    return findOneStub;
}

describe("Rota de login", () => {
    // Restaura a sandbox para cada teste para evitar vazamento de memória
    beforeEach(() => {
        sinon.restore();
    });

    it("Deve fazer login com sucesso", async () => {

        // Dados inseridos pelo usuário
        const userData = {
        email: "flux.9@email.com",
        password: "Su@1senha",
        };

        // Simule um usuário retornado do banco de dados
        const user = {
        _id: "usuario_id",
        email: userData.email,
        // senha criptografada para comparação
        password: "$2b$10$TXML86pIxCbL2xS9hI0GXOO/UARNpXUsteh7OO21qTaabEfBEGhHa",
        };

        // Crie um stub usando a função createFindOneStub
        createFindOneStub(userData.email, user);

        const response = await request(app)
        .post("/login")
        .send(userData)
        .expect(200);

        expect(response.body.logged).toBe(true);
        expect(response.body.token).toBeTruthy();
    });

    it("Deve retornar erro 401 para email inexistente", async () => {

        // Dados inseridos pelo usuário
        const userData = {
        email: "email-inexistente@example.com",
        password: "senha-incorreta",
        };

        // Crie um stub usando a função createFindOneStub
        createFindOneStub(userData.email, null);

        const response = await request(app)
        .post("/login")
        .send(userData)
        .expect(401);

        expect(response.body.message).toBe("Email não existe ou está incorreto!");
    });

    it("Deve retornar erro 401 para senha incorreta", async () => {

        // Dados inseridos pelo usuário
        const userData = {
          email: "test@example.com",
          password: "senha-incorreta",
        };
    
        // Simule um usuário retornado do banco de dados
        const user = {
          _id: "usuario_id",
          email: userData.email,
          password: "senha-criptografada",
        };
    
        // Crie um stub usando a função createFindOneStub
        createFindOneStub(userData.email, user);
    
        const response = await request(app)
          .post("/login")
          .send(userData)
          .expect(401);
    
        expect(response.body.message).toBe("Senha incorreta!");
    });
});
