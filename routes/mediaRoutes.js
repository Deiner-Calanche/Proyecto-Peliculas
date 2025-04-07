const { Router } = require('express');
const mongoose = require('mongoose');
const Media = require('../models/Media');
const { validationResult, check } = require('express-validator');

const router = Router();

// Crear un medio
router.post('/', [
    check('serial', 'El serial es requerido').not().isEmpty(),
    check('titulo', 'El título es requerido').not().isEmpty(),
    check('sinopsis', 'La sinopsis es requerida').not().isEmpty(),
    check('url', 'La URL es requerida').not().isEmpty(),
    check('imagen', 'La imagen es requerida').not().isEmpty(),
    check('anioEstreno', 'Año de estreno inválido').isInt(),
    check('genero', 'El género es requerido').not().isEmpty(),
    check('director', 'El director es requerido').not().isEmpty(),
    check('productora', 'La productora es requerida').not().isEmpty(),
    check('tipo', 'El tipo es requerido').not().isEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        let media = new Media({ ...req.body, createdAt: new Date(), updatedAt: new Date() });
        media = await media.save();
        res.status(201).json(media);
    } catch (error) {
        console.error('Error en POST /media:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener todos los medios
router.get('/', async (req, res) => {
    try {
        const medios = await Media.find().populate(['genero', 'director', 'productora', 'tipo']);
        res.json(medios);
    } catch (error) {
        console.error('Error en GET /media:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener un medio por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const media = await Media.findById(id).populate(['genero', 'director', 'productora', 'tipo']);
        if (!media) {
            return res.status(404).json({ message: 'Medio no encontrado' });
        }

        res.json(media);
    } catch (error) {
        console.error('Error en GET /media/:id:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Actualizar un medio por ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const media = await Media.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, { new: true });
        if (!media) {
            return res.status(404).json({ message: 'Medio no encontrado' });
        }

        res.json({ message: 'Medio actualizado con éxito', media });
    } catch (error) {
        console.error('Error en PUT /media/:id:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
