const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Tipo = require('../models/Tipo');

const router = Router();

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        let tipo = new Tipo({ ...req.body, createdAt: new Date(), updatedAt: new Date() });
        tipo = await tipo.save();
        res.json(tipo);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

router.get('/', async (req, res) => {
    try {
        const tipos = await Tipo.find();
        res.json(tipos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const tipo = await Tipo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(tipo);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Tipo.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Tipo eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
