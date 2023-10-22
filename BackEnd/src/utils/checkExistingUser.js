const credencialSchema = require("../models/credencialSchema");

const checkExistingUser = async (email, res) => {
    const existingUser = await credencialSchema.findOne({ email });
    if (existingUser) {
      res.status(401).json({ message: 'Já existe um cadastro com esse email, por favor se cadastre utilizando outro' });
      return true;
    }
    return false;
}

module.exports = checkExistingUser;