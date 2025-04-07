const { Router } = require('express');
const Director = require('../models/Director');
const { validationResult, check } = require('express-validator');

const router = Router();

// Crear un director
router.post('/', [
    check('nombres', 'invalid.nombres').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        let director = new Director(req.body);
        director.createdAt = new Date();
        director.updatedAt = new Date();

        director = await director.save();
        res.send(director);
    } catch (error) {
        console.log(error);
        res.status(500).send('message error');
    }
});

// Obtener todos los directores

router.get('/', async(req, res) => {
    try {
        const directores = await Director.find();
        res.send(directores);
    } catch (error) {
        console.log(error);
        res.status(500).send('message error');
    }
});

// Obtener un director por ID (Corrección)
router.get('/:id', async function(req, res) {
    try {
        const { id } = req.params;
        const director = await Director.findById(id);
        if (!director) {
            return res.status(404).json({ message: 'Director no encontrado' });
        }
        res.send(director);
    } catch (error) {
        console.log(error);
        res.status(500).send('message error');
    }
});

// Actualizar un director por ID (Corrección)
router.put('/:id', async function(req, res) {
    try {
        const { id } = req.params;
        const director = await Director.findByIdAndUpdate(id, req.body, { new: true });
        if (!director) {
            return res.status(404).json({ message: 'Director no encontrado' });
        }
        res.send(director);
    } catch (error) {
        console.log(error);
        res.status(500).send('message error');
    }
});

// Eliminar un director por ID
router.delete('/:id', async function(req, res) {
    try {
        const { id } = req.params;
        const director = await Director.findByIdAndDelete(id);
        if (!director) {
            return res.status(404).json({ message: 'Director no encontrado' });
        }
        res.send({ message: 'Director eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).send('message error');
    }
});

module.exports = router;
