// Verifica formato da senha inserida
const isPasswordValid = (password) => {
    // Pelo menos 8 caracteres
    if (password.length < 8) {
      return false;
    }
    // Pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    // Pelo menos uma letra minúscula
    if (!/[a-z]/.test(password)) {
      return false;
    }
    // Pelo menos um caractere especial
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
      return false;
    }
    // Pelo menos um número
    if (!/[0-9]/.test(password)) {
      return false;
    }
    // A senha atende a todos os critérios
    return true;
}

module.exports = isPasswordValid;