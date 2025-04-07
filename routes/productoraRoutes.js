const { Router } = require('express');
const Productora = require('../models/Productora');
const { validationResult, check } = require('express-validator');
const mongoose = require('mongoose');

const router = Router();

// Crear una nueva productora
router.post('/', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])
], async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        let productora = new Productora();
        productora.nombre = req.body.nombre;
        productora.estado = req.body.estado;
        productora.slogan = req.body.slogan;
        productora.descripcion = req.body.descripcion;
        productora.createdAt = new Date();
        productora.updatedAt = new Date();

        productora = await productora.save();
        res.send(productora);
    } catch (error) {
        console.log(error);
        res.status(500).send('message error');
    }
});

// Obtener todas las productoras
router.get('/', async function(req, res) {
    try {
        const productoras = await Productora.find();
        res.send(productoras);
    } catch (error) {
        console.log(error);
        res.status(500).send('message error');
    }
});

// Actualizar una productora
router.put('/:id', async function(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const productora = await Productora.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!productora) {
            return res.status(404).json({ message: 'Productora no encontrada' });
        }

        res.send(productora);
    } catch (error) {
        console.log(error);
        res.status(500).send('message error');
    }
});

// Eliminar una productora
router.delete('/:id', async function(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const productora = await Productora.findByIdAndDelete(req.params.id);
        if (!productora) {
            return res.status(404).json({ message: 'Productora no encontrada' });
        }

        res.json({ message: 'Productora eliminada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send('message error');
    }
});

module.exports = router;
