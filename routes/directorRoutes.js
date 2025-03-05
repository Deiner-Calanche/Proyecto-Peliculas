const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Director = require('../models/Director');

const router = Router();

// Crear un director
router.post('/', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('estado', 'Estado inválido, debe ser "Activo" o "Inactivo"').isIn(['Activo', 'Inactivo'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: "Error en los datos ingresados", errores: errors.array() });
        }

        let director = new Director({ ...req.body, createdAt: new Date(), updatedAt: new Date() });
        director = await director.save();
        res.json({ mensaje: "Director creado exitosamente", data: director });

    } catch (error) {
        console.error("Error al crear el director:", error);
        res.status(500).json({ mensaje: "Error interno del servidor. Verifica los datos e inténtalo de nuevo." });
    }
});

// Obtener todos los directores
router.get('/', async (req, res) => {
    try {
        const directores = await Director.find();
        res.json(directores);
    } catch (error) {
        console.error("Error al obtener directores:", error);
        res.status(500).json({ mensaje: "No se pudo obtener la lista de directores." });
    }
});

// Actualizar un director
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: "ID inválido. Por favor, proporciona un ID correcto." });
        }

        const director = await Director.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!director) {
            return res.status(404).json({ mensaje: "Director no encontrado." });
        }

        res.json({ mensaje: "Director actualizado con éxito", data: director });
    } catch (error) {
        console.error("Error al actualizar el director:", error);
        res.status(500).json({ mensaje: "No se pudo actualizar el director." });
    }
});

// Eliminar un director
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: "ID inválido. No se puede eliminar el director." });
        }

        const director = await Director.findByIdAndDelete(req.params.id);
        if (!director) {
            return res.status(404).json({ mensaje: "Director no encontrado." });
        }

        res.json({ mensaje: "Director eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el director:", error);
        res.status(500).json({ mensaje: "No se pudo eliminar el director." });
    }
});

module.exports = router;
