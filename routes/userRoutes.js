const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/register', [
  body('nombre').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('rol').isIn(['administrador', 'docente'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si email ya existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Usuario ya existe' });

    // Encriptar password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    user = new User({ nombre, email, password: hashedPassword, rol });
    await user.save();

    res.status(201).json({ msg: 'Usuario creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
