// Verificar si el usuario tiene rol de administrador
function esAdministrador(req, res, next) {
  if (req.usuario.rol !== 'Administrador') {
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }
  next();
}

module.exports = { esAdministrador };
