const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Tipo = require('../models/Tipo');

const router = Router();

// Crear un tipo con validación de estado
router.post('/', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])  // validación estado
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        let tipo = new Tipo();
        tipo.nombre = req.body.nombre;
        tipo.descripcion = req.body.descripcion || '';
        tipo.estado = req.body.estado;  // asignar estado desde el body
        tipo.createdAt = new Date();
        tipo.updatedAt = new Date();

        tipo = await tipo.save();
        res.send(tipo);
    } catch (error) {
        console.error(error);
        res.status(500).send('message error');
    }
});

// Obtener todos los tipos
router.get('/', async function(req, res) {
    try {
        const tipos = await Tipo.find();
        res.send(tipos);
    } catch (error) {
        console.error(error);
        res.status(500).send('message error');
    }
});

// Actualizar un tipo por ID (con validación del estado opcional)
router.put('/:id', [
    check('estado').optional().isIn(['Activo', 'Inactivo'])
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const tipo = await Tipo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tipo) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }
        res.send(tipo);
    } catch (error) {
        console.error(error);
        res.status(500).send('message error');
    }
});

// Eliminar un tipo por ID
router.delete('/:id', async function(req, res) {
    try {
        const tipo = await Tipo.findByIdAndDelete(req.params.id);
        if (!tipo) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }
        res.json({ message: 'Tipo eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('message error');
    }
});

module.exports = router;
