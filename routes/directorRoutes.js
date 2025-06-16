const { Router } = require('express');
const Director = require('../models/Director');
const { validationResult, check } = require('express-validator');
const {validateJWT} = require('../middleware/validate-jwt');
const {esAdministrador} = require('../middleware/validate-role-admin');
const router = Router();

// Crear un director (solo admin)
router.post('/', validateJWT, esAdministrador, [
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
        res.status(500).json({ message: 'Error al crear director', error });
    }
});

// Obtener todos los directores (token requerido)
router.get('/', validateJWT, async (req, res) => {
    try {
        const directores = await Director.find();
        res.send(directores);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar directores', error });
    }
});

// Obtener un director por ID (token requerido)
router.get('/:id', validateJWT, async function(req, res) {
    try {
        const { id } = req.params;
        const director = await Director.findById(id);
        if (!director) {
            return res.status(404).json({ message: 'Director no encontrado' });
        }
        res.send(director);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener director', error });
    }
});

// Actualizar un director por ID (solo admin)
router.put('/:id', validateJWT, esAdministrador, async function(req, res) {
    try {
        const { id } = req.params;
        const director = await Director.findByIdAndUpdate(id, req.body, { new: true });
        if (!director) {
            return res.status(404).json({ message: 'Director no encontrado' });
        }
        res.send(director);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar director', error });
    }
});

// Eliminar un director por ID (solo admin)
router.delete('/:id', validateJWT, esAdministrador, async function(req, res) {
    try {
        const { id } = req.params;
        const director = await Director.findByIdAndDelete(id);
        if (!director) {
            return res.status(404).json({ message: 'Director no encontrado' });
        }
        res.send({ message: 'Director eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar director', error });
    }
});

module.exports = router;
