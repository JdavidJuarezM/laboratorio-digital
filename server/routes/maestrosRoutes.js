// server/routes/maestrosRoutes.js
const express = require("express");
const router = express.Router();
// Importamos las dos funciones del controlador
const {
  registrarMaestro,
  iniciarSesion,
} = require("../controllers/maestrosController");

// Ruta para el registro
router.post("/registro", registrarMaestro);

// Ruta para el inicio de sesión
router.post("/login", iniciarSesion);

module.exports = router;
