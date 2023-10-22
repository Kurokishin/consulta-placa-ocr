const jwt = require('jsonwebtoken');

//Verificar se a requisição possui token válido, e portanto, o usuário está logado
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    console.log('O token é:' + token);

    if (!token) {
        return res.status(401).json({ logged: false, message: 'Token inválido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ logged: false, message: 'Falha na autenticação' });
        }

        next();
    });
};

module.exports = verifyToken;

