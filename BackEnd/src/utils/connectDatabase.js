require("dotenv").config();
const db = require('mongoose');

// Faz a conexão com o banco de dados
const connectDatabase = async () => {
  try {
    await db.connect(process.env.DB_CONNECTION);
    console.log("Connected to the database!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

module.exports = connectDatabase;