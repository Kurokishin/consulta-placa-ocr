const request = require("supertest");
const sinon = require("sinon");
const express = require("express");
const app = express();
const cadastroCredencialRoute = require("../routes/cadastroCredencialRoute");

// Módulo para criar o stub
// const checkExistingUser = require("../utils/checkExistingUser");
// const credencialSchema = require("../models/credencialSchema");

// Divide o JSON da request e coloca no req.body
app.use(express.json());

//Caminho padrão para a rota
app.use("/", cadastroCredencialRoute);

describe("Rota de cadastro de credenciais", () => {
    // beforeEach(() => {
    //   sinon.restore();
    // });
    // it("Deve criar um novo usuário com credenciais válidas", async () => {
    //   const userData = {
    //     email: "novousuario@example.com",
    //     password: "Senha@123",
    //   };

    //   // Simule um usuário que não existe no banco de dados
    //   sinon.stub(checkExistingUser, "checkExistingUser").resolves(null);

    //   // Crie um stub para a função bcrypt.genSaltSync() para evitar a criptografia real
    //   //sinon.stub(bcrypt, "genSaltSync").returns("salt");
    //   //sinon.stub(bcrypt, "hashSync").returns("hashedPassword");

    //   const response = await request(app)
    //     .post("/cadastro")
    //     .send(userData)
    //     .expect(201);

    //   expect(response.body.message).toBe("Usuário cadastrado com sucesso");
    // });

    it("Deve retornar erro 400 para formato de email inválido", async () => {
      const userData = {
        email: "emailinvalido",
        password: "Senha@123",
      };

      const response = await request(app)
        .post("/cadastro")
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe("Formato de email inválido");
    });

    it("Deve retornar erro 400 para senha inválida", async () => {
      const userData = {
        email: "novousuario@example.com",
        password: "senhafraca",
      };

      const response = await request(app)
        .post("/cadastro")
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe(
        "A senha precisa ter pelo menos: oito caracteres, uma letra maiúscula e minúscula, um caractere especial (ex: @, !, #), e um número"
      );
    });

    // it("Deve retornar erro 401 se o email já existir", async () => {
    //   const userData = {
    //     email: "usuariopreexistente@example.com",
    //     password: "Senha@123",
    //   };

    //   // Simule a existência do usuário no banco de dados
    //   createFindOneStub(userData.email, userData);

    //   const response = await request(app)
    //     .post("/cadastro")
    //     .send(userData)
    //     .expect(401);

    //   expect(response.body.message).toBe("Já existe um cadastro com esse email");
    // });
});
