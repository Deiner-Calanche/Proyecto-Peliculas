const jwt = require("jsonwebtoken");

const JWT_SECRET = "123456";

const generarJWT = (usuario) => {
  return jwt.sign(
    {
      id: usuario._id,nombre: usuario.nombre, rol: usuario.rol,estado: usuario.estado,},
      JWT_SECRET,
    { expiresIn: "2h" }
  );
};

module.exports = { generarJWT };
