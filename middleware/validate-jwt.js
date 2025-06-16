const jwt = require('jsonwebtoken');

const JWT_SECRET = '123456';

const validateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Error: Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET); // elimina "Bearer "
    req.usuario = payload; // se guarda el payload decodificado en req.usuario
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({ message: 'Error: Token inválido' });
  }
};

module.exports = {
  validateJWT
};
