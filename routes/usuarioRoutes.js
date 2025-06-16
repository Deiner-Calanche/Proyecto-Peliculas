const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const {validateJWT} = require('../middleware/validate-jwt');
const {esAdministrador} = require('../middleware/validate-role-admin');

const router = express.Router();

// Crear un usuario (solo administrador)
router.post(
  '/',
  [
    validateJWT,
    esAdministrador,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'Email inválido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('rol', 'Rol inválido').isIn(['Administrador', 'Docente']),
    check('estado', 'Estado inválido').optional().isIn(['Activo', 'Inactivo']),
  ],
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const { nombre, email, password, rol, estado } = req.body;

      const existente = await Usuario.findOne({ email });
      if (existente) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const nuevoUsuario = new Usuario({
        nombre,
        email,
        password: hashedPassword,
        rol,
        estado: estado || 'Activo',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await nuevoUsuario.save();
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear usuario', error });
    }
  }
);

// Obtener un usuario por ID (requiere token, y genera nuevo token)
router.get('/:id', validateJWT, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const nuevoToken = generarJWT(usuario);

    res.json({ usuario, token: nuevoToken });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
});


// Obtener un usuario por ID
// Obtener todos los usuarios (solo admin)
router.get('/', validateJWT, esAdministrador, async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
});


// Actualizar un usuario (solo admin)
router.put(
  '/:id',
  [
    validateJWT,
    esAdministrador,
    check('rol').optional().isIn(['Administrador', 'Docente']),
    check('estado').optional().isIn(['Activo', 'Inactivo']),
    check('email').optional().isEmail(),
  ],
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const { password, ...resto } = req.body;
      if (password) {
        resto.password = await bcrypt.hash(password, 10);
      }
      resto.updatedAt = new Date();

      const usuario = await Usuario.findByIdAndUpdate(req.params.id, resto, { new: true });
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar usuario', error });
    }
  }
);

// Eliminar un usuario (solo admin)
router.delete('/:id', validateJWT, esAdministrador, async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
});

module.exports = router;
