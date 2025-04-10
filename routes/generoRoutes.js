const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Genero = require('../models/Genero');

const router = Router();

router.post(
    '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('estado', 'Estado inválido, debe ser "Activo" o "Inactivo"').isIn(['Activo', 'Inactivo']),
        check('descripcion', 'La descripción es obligatoria').not().isEmpty()
    ],
    async function (req, res) {
        try {
            console.log('Datos recibidos en el servidor:', req.body);

            // Validar errores antes de procesar la solicitud
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }

            // Verificar si el género ya existe
            const generoExistente = await Genero.findOne({ nombre: req.body.nombre });
            if (generoExistente) {
                return res.status(400).json({ message: 'El género ya existe' });
            }

            // Crear el nuevo género
            let genero = new Genero({
                nombre: req.body.nombre,
                estado: req.body.estado,
                descripcion: req.body.descripcion,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Guardar en la base de datos
            genero = await genero.save();

            // Responder con el objeto guardado
            return res.status(201).json({ message: 'Género creado con éxito', data: genero });
        } catch (error) {
            console.error('Error en el servidor:', error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    }
);

// Obtener todos los géneros
router.get('/', async (req, res) => {
    try {
        const generos = await Genero.find();
        res.json(generos);
    } catch (error) {
        console.error('Error al obtener los géneros:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Actualizar un género
router.put('/:id', async (req, res) => {
    try {
        const genero = await Genero.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!genero) {
            return res.status(404).json({ message: 'Género no encontrado' });
        }
        res.json({ message: 'Género actualizado con éxito', data: genero });
    } catch (error) {
        console.error('Error al actualizar el género:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Eliminar un género
router.delete('/:id', async (req, res) => {
    try {
        const genero = await Genero.findByIdAndDelete(req.params.id);
        if (!genero) {
            return res.status(404).json({ message: 'Género no encontrado' });
        }
        res.json({ message: 'Género eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el género:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
