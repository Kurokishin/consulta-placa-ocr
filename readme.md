# PROJETO DE WEB 2

Este é o README para o projeto que envolve a criação de um sistema de reconhecimento de placas de veículos com o uso de Node.js, Express, MongoDB, e ReactJS. O projeto está dividido em duas partes: Backend e Frontend.

## Alunos

- Francisco Luan
- Rafael Pereira
- Luan Claiver
- Luis Pedro

## Checklist

- **[x]** Backend:
   - **[x]** Rota de cadastro de placas;
   - **[x]** Rota para baixar o relatório das placas cadastradas por cidade;
   - **[x]** Rota de consulta da presença de uma placa no banco de dados.
- **[x]** Frontend:
   - **[x]** Telas para cada uma das rotas do backend.
- **[ ]** Vercel:
   - **[x]** Adição da homepage
   - **[ ]** (ERRO CORS) Realizar requisição para cadastrar uma placa


## Tecnologias Utilizadas

### Backend
- **Node.js:** Uma plataforma de desenvolvimento de aplicativos server-side baseada no motor JavaScript V8 do Google.
- **Express.js:** Um framework web para Node.js que facilita a criação de aplicativos web robustos.
- **MongoDB:** Um banco de dados NoSQL que armazena dados em formato JSON-like.
- **Tesseract OCR:** Uma biblioteca de reconhecimento de caracteres ópticos (OCR) para identificar placas em imagens.
- **Mongoose:** Uma biblioteca Node.js para modelar objetos MongoDB de forma mais simples e intuitiva.
- **GitHub:** Plataforma de controle de versão de código.
- Vercel: Plataforma de hospedagem para aplicativos web.

### Frontend
- **ReactJS:** Uma biblioteca JavaScript para criar interfaces de usuário reutilizáveis e componentizadas.
- **Axios:** Uma biblioteca para fazer requisições HTTP.
- **Vercel:** Plataforma de hospedagem para aplicativos web.

## Divisão do Projeto

O projeto foi dividido em duas partes: Backend e Frontend, cada uma com suas responsabilidades e funcionalidades.

### Backend
O backend é responsável por gerenciar as rotas e a lógica de negócios do sistema. Ele oferece as seguintes funcionalidades:

A. **Cadastro de Placa**: 
   - Rota POST para '/cadastroPlaca'.
   - Recebe uma foto no formato PNG e o nome de uma cidade.
   - Utiliza uma API de OCR para reconhecer a placa na foto.
   - Armazena o número da placa, cidade, data e hora (gerado automaticamente) em um banco de dados MongoDB.

B. **Geração de Relatório**:
   - Rota GET para ‘/relatorio/cidade/:cidade’.
   - Gera um PDF para download com as informações de número da placa, cidade, data e hora dos registros com a cidade passada como parâmetro.

C. **Consulta de Placa**:
   - Rota GET para ‘/consulta/:placa’.
   - Retorna se uma placa está no banco de dados ou não.

O código do backend está versionado no GitHub e o servidor está executando no Vercel.

### Frontend
O frontend é a interface de usuário que interage com o backend. Ele oferece as seguintes funcionalidades:

- **Cadastro de Placa**: Uma tela para cadastrar placas de veículos, onde o usuário pode enviar uma foto e o nome da cidade.

- **Geração de Relatório**: Uma tela para gerar relatórios com base na cidade escolhida.

- **Consulta de Placa**: Uma tela para verificar se uma placa está registrada no sistema.

## Imagens da interface

<p align="center">
  <img src="https://github.com/Kurokishin/consulta-placa-ocr/assets/80788425/d5f81cbb-af13-4ecf-a86c-b74c9dd4666a" />
</p>

<p align="center">
  <img src="https://github.com/Kurokishin/consulta-placa-ocr/assets/80788425/9149d818-50e7-4432-9c4e-ed55efb46ea3" />
</p>


## Instruções para rodar o projeto localmente

### Requisições pelo frontend

1. Abrir dois terminais (um com acesso a pasta FrontEnd e outro a pasta BackEnd) e instalar as dependências de ambos com o comando:

```js
npm install
```

2. Então, para executar o projeto basta utilizar o comando *(tanto no front quanto no back)*:

```js
npm run dev
```

3. No terminal em que a parte do FrontEnd foi executada estará a porta onde o html está disponível para acesso.
![terminal executando o projeto](https://github.com/Kurokishin/consulta-placa-ocr/assets/80788425/df5c78cc-8c4b-4f90-b43b-9439d9251002)

### Requisições pelo backend

* Cadastrar um novo usuário utilizando credenciais (email e senha)
   ```sh
  curl -X POST -H "Content-Type: application/json" -d '{
  "email": "seu_email@email.com",
  "password": "sua_senha"
  }' http://localhost:3001/cadastro
   ```

* Realizar o login (email e senha) para geração do token
   ```sh
   curl -X POST -H "Content-Type: application/json" -d '{
  "email": "seu_email@email.com",
  "password": "sua_senha"
   }' http://localhost:3001/login
   ```

* Para a requisição POST de cadastrar a placa (somente imagens em PNG)
   ```sh
   curl -H "Authorization: <seu_token>" -X POST -F "file=@/caminho/para/imagem.png" -F "cidade=<nome_cidade>" localhost:3001/cadastroPlaca
   ```

* Documento com as placas cadastradas de uma determinada cidade (será feito o download do PDF)
   ```sh
   curl -H "Authorization: <seu_token>" -o <nome_do_arquivo>.pdf localhost:3001/relatorio/cidade/:cidade
   ```

* Para verificar se uma placa está presente no banco de dados
   ```sh
   curl -H "Authorization: <seu_token>" localhost:3001/consulta/:placa
   ```

* Caso deseje enviar um alerta para os usuários logados no sistema
   ```sh
   curl -H "Authorization: <seu_token>" -X POST localhost:3001/alerta
   ```
