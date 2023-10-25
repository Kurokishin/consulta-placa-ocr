// Função para verificar se o email é válido
const isEmailValid = (email) => {
    // Expressão regular para validar o formato de email
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]{2,4})*$/
    return emailRegex.test(email);
};

module.exports = isEmailValid;