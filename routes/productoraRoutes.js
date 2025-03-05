const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Productora = require('../models/Productora');

const router = Router();

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('estado', 'Estado inválido').isIn(['Activo', 'Inactivo'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        let productora = new Productora({ ...req.body, createdAt: new Date(), updatedAt: new Date() });
        productora = await productora.save();
        res.json(productora);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

router.get('/', async (req, res) => {
    try {
        const productoras = await Productora.find();
        res.json(productoras);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productora = await Productora.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(productora);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Productora.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Productora eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
