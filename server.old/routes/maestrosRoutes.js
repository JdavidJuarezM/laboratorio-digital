const express = require("express");
const router = express.Router();
const {
  registrarMaestro,
  iniciarSesion,
  getMaestroPerfil,
} = require("../controllers/maestrosController");
const { protegerRuta } = require("../middleware/authMiddleware");

// --- Rutas Públicas ---
router.post("/registro", registrarMaestro);
router.post("/login", iniciarSesion);

// --- Ruta Protegida ---
// El middleware 'protegerRuta' se ejecuta ANTES que el controlador 'getMaestroPerfil'.
router.get("/perfil", protegerRuta, getMaestroPerfil);

module.exports = router;
