const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helper/jwt");

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Errores de validación",
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      const user = await Usuario.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }

      const token = generarJWT(user);

      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        estado: user.estado,
        rol: user.rol,
        access_token: token
      });

    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error del servidor" });
    }
  }
);

module.exports = router;
