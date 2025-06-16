const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Media = require('../models/Media');


const {validateJWT} = require('../middleware/validate-jwt');
const {esAdministrador} = require('../middleware/validate-role-admin');

// Middleware de validación de errores
const validarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

// Crear media
router.post(
  '/',
  [
    validateJWT,
    esAdministrador,
    body('serial').notEmpty().withMessage('El serial es obligatorio'),
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('sinopsis').notEmpty().withMessage('La sinopsis es obligatoria'),
    body('url').isURL().withMessage('URL inválida'),
    body('imagen').notEmpty().withMessage('La imagen es obligatoria'),
    body('anio_estreno').isInt({ min: 1800 }).withMessage('Año inválido'),
    body('genero').isMongoId().withMessage('ID de género inválido'),
    body('tipo').isMongoId().withMessage('ID de tipo inválido'),
    body('director').isMongoId().withMessage('ID de director inválido'),
    body('productora').isMongoId().withMessage('ID de productora inválido')
  ],
  validarErrores,
  async (req, res) => {
    try {
      const nuevaMedia = new Media(req.body);
      await nuevaMedia.save();
      res.status(201).json(nuevaMedia);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la media', detalle: error.message });
    }
  }
);

// Obtener todas las medias
router.get('/', async (req, res) => {
  try {
    const medias = await Media.find()
      .populate('genero', 'nombre estado')
      .populate('tipo', 'nombre estado')
      .populate('director', 'nombre estado')
      .populate('productora', 'nombre estado');
    res.json(medias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener medias', detalle: error.message });
  }
});

// Obtener media por ID
router.get('/:id', 
  [param('id').isMongoId().withMessage('ID inválido')],
  validarErrores,
  async (req, res) => {
    try {
      const media = await Media.findById(req.params.id)
        .populate('genero', 'nombre estado')
        .populate('tipo', 'nombre estado')
        .populate('director', 'nombre estado')
        .populate('productora', 'nombre estado');
      if (!media) return res.status(404).json({ error: 'Media no encontrada' });
      res.json(media);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la media', detalle: error.message });
    }
  }
);

// Actualizar media
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID inválido'),
    body('titulo').optional().notEmpty(),
    body('sinopsis').optional().notEmpty(),
    body('url').optional().isURL(),
    body('imagen').optional().notEmpty(),
    body('anio_estreno').optional().isInt({ min: 1800 }),
    body('genero').optional().isMongoId(),
    body('tipo').optional().isMongoId(),
    body('director').optional().isMongoId(),
    body('productora').optional().isMongoId()
  ],
  validarErrores,
  async (req, res) => {
    try {
      req.body.fecha_actualizacion = new Date();
      const mediaActualizada = await Media.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      if (!mediaActualizada) return res.status(404).json({ error: 'Media no encontrada' });
      res.json(mediaActualizada);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la media', detalle: error.message });
    }
  }
);

// Eliminar media (soft delete)
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('ID inválido')],
  validarErrores,
  async (req, res) => {
    try {
      const mediaEliminada = await Media.findByIdAndUpdate(
        req.params.id,
        { estado: false, fecha_actualizacion: new Date() },
        { new: true }
      );
      if (!mediaEliminada) return res.status(404).json({ error: 'Media no encontrada' });
      res.json({ mensaje: 'Media eliminada correctamente', media: mediaEliminada });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la media', detalle: error.message });
    }
  }
);



// DELETE /medias  --> borrar todos los registros
router.delete('/', async (req, res) => {
  try {
    await Media.deleteMany({});
    res.status(200).json({ message: 'Todos los medios fueron borrados correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al borrar medios', error });
  }
});

module.exports = router;
