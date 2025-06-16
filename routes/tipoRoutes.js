const { Router } = require("express");
const { check, param, validationResult } = require("express-validator");
const Tipo = require("../models/Tipo");
const { validateJWT } = require("../middleware/validate-jwt");
const { esAdministrador } = require("../middleware/validate-role-admin");

const router = Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

// Crear un tipo (solo admin)
router.post(
  "/",
  validateJWT,
  esAdministrador,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("estado", "Estado inválido").isIn(["Activo", "Inactivo"]),
  ],
  validarErrores,
  async (req, res) => {
    try {
      const tipo = new Tipo({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion || "",
        estado: req.body.estado,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await tipo.save();
      res.status(201).json(tipo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el tipo" });
    }
  }
);

// Obtener todos los tipos (requiere token)
router.get("/", validateJWT, async (req, res) => {
  try {
    const tipos = await Tipo.find();
    res.json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener tipos" });
  }
});

// Actualizar un tipo por ID (solo admin)
router.put(
  "/:id",
  validateJWT,
  esAdministrador,
  [
    param("id").isMongoId().withMessage("ID inválido"),
    check("estado").optional().isIn(["Activo", "Inactivo"]),
    check("nombre")
      .optional()
      .notEmpty()
      .withMessage("Nombre no puede estar vacío"),
  ],
  validarErrores,
  async (req, res) => {
    try {
      req.body.updatedAt = new Date();
      const tipo = await Tipo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!tipo) {
        return res.status(404).json({ message: "Tipo no encontrado" });
      }

      res.json(tipo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el tipo" });
    }
  }
);

// Eliminar un tipo (solo admin)
router.delete(
  "/:id",
  validateJWT,
  esAdministrador,
  [param("id").isMongoId().withMessage("ID inválido")],
  validarErrores,
  async (req, res) => {
    try {
      const tipo = await Tipo.findByIdAndDelete(req.params.id);
      if (!tipo) {
        return res.status(404).json({ message: "Tipo no encontrado" });
      }

      res.json({ message: "Tipo eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el tipo" });
    }
  }
);

module.exports = router;
