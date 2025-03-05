const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Media = require('../models/Media');

const router = Router();

// Crear una nueva media (película o serie)
router.post('/', [
    check('serial', 'El serial es obligatorio').not().isEmpty(),
    check('titulo', 'El título es obligatorio').not().isEmpty(),
    check('url', 'La URL es obligatoria').not().isEmpty(),
    check('genero', 'El género es obligatorio').not().isEmpty(),
    check('director', 'El director es obligatorio').not().isEmpty(),
    check('productora', 'La productora es obligatoria').not().isEmpty(),
    check('tipo', 'El tipo es obligatorio').not().isEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        let media = new Media({ ...req.body, createdAt: new Date(), updatedAt: new Date() });
        media = await media.save();
        res.json(media);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener todas las medias (películas y series)
router.get('/', async (req, res) => {
    try {
        const media = await Media.find()
            .populate('genero')
            .populate('director')
            .populate('productora')
            .populate('tipo');
        res.json(media);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener una media por ID
router.get('/:id', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id)
            .populate('genero')
            .populate('director')
            .populate('productora')
            .populate('tipo');
        if (!media) return res.status(404).json({ mensaje: 'Media no encontrada' });
        res.json(media);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Actualizar una media
router.put('/:id', async (req, res) => {
    try {
        const media = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(media);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Eliminar una media
router.delete('/:id', async (req, res) => {
    try {
        await Media.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Media eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
