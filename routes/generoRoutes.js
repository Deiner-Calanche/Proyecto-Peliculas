const express = require('express');
const router = express.Router();
const Genero = require('../models/Genero');

const {validateJWT} = require('../middleware/validate-jwt');
const {esAdministrador} = require('../middleware/validate-role-admin');

// Crear género (solo admin)
router.post('/', validateJWT, esAdministrador, async (req, res) => {
  try {
    const genero = new Genero(req.body);
    await genero.save();
    res.status(201).json(genero);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear género', error });
  }
});

// Listar géneros (admin y docente)
router.get('/', validateJWT, async (req, res) => {
  try {
    const generos = await Genero.find();
    res.json(generos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener géneros', error });
  }
});

// Actualizar género (solo admin)
router.put('/:id', validateJWT, esAdministrador, async (req, res) => {
  try {
    const genero = await Genero.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!genero) return res.status(404).json({ message: 'Género no encontrado' });
    res.json(genero);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar género', error });
  }
});

// Eliminar género (solo admin)
router.delete('/:id', validateJWT, esAdministrador, async (req, res) => {
  try {
    const genero = await Genero.findByIdAndDelete(req.params.id);
    if (!genero) return res.status(404).json({ message: 'Género no encontrado' });
    res.json({ message: 'Género eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar género', error });
  }
});

module.exports = router;
