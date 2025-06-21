const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helper/jwt");

const router = express.Router();

// ==============================
// LOGIN
// ==============================
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

      const isMatch = await bcrypt.compare(password, user.password);
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

// ==============================
// RESTABLECER CONTRASEÑA DIRECTAMENTE (SIN CORREO)
// ==============================
router.post(
  "/recuperar",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La nueva contraseña es obligatoria").isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const { email, password } = req.body;

      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      usuario.password = hashedPassword;
      usuario.updatedAt = new Date();
      await usuario.save();

      res.json({ message: "Contraseña actualizada correctamente." });

    } catch (error) {
      console.error("❌ Error al actualizar contraseña:", error);
      res.status(500).json({ message: "Error interno al actualizar contraseña." });
    }
  }
);

module.exports = router;
