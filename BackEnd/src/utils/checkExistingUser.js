const credencialSchema = require("../models/credencialSchema");

// Função para verificar se o email já está cadastrado
const checkExistingUser = async (email) => {
  const existingUser = await credencialSchema.findOne({ email });
  if (existingUser) {
    return true;
  } else {
    return false;  
  }
};

module.exports = checkExistingUser;