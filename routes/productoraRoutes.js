const { Router } = require('express');
const { check, param, validationResult } = require('express-validator');
const Productora = require('../models/Productora');
const { validateJWT } = require('../middleware/validate-jwt');
const { esAdministrador } = require('../middleware/validate-role-admin');

const router = Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

// Crear una nueva productora (solo admin)
router.post(
  '/',
  validateJWT,
  esAdministrador,
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('estado', 'Estado inválido').isIn(['Activo', 'Inactivo'])
  ],
  validarErrores,
  async (req, res) => {
    try {
      let productora = new Productora({
        nombre: req.body.nombre,
        estado: req.body.estado,
        slogan: req.body.slogan,
        descripcion: req.body.descripcion,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await productora.save();
      res.status(201).json(productora);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la productora' });
    }
  }
);

// Obtener todas las productoras (requiere token)
router.get('/', validateJWT, async (req, res) => {
  try {
    const productoras = await Productora.find();
    res.json(productoras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productoras' });
  }
});

// Actualizar una productora (solo admin)
router.put(
  '/:id',
  validateJWT,
  esAdministrador,
  [
    param('id').isMongoId().withMessage('ID inválido'),
    check('nombre').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
    check('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('Estado inválido')
  ],
  validarErrores,
  async (req, res) => {
    try {
      req.body.updatedAt = new Date();

      const productora = await Productora.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!productora) {
        return res.status(404).json({ message: 'Productora no encontrada' });
      }

      res.json(productora);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar la productora' });
    }
  }
);

// Eliminar una productora (solo admin)
router.delete(
  '/:id',
  validateJWT,
  esAdministrador,
  [param('id').isMongoId().withMessage('ID inválido')],
  validarErrores,
  async (req, res) => {
    try {
      const productora = await Productora.findByIdAndDelete(req.params.id);
      if (!productora) {
        return res.status(404).json({ message: 'Productora no encontrada' });
      }

      res.json({ message: 'Productora eliminada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la productora' });
    }
  }
);

module.exports = router;
