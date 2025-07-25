// server/routes/huertoRoutes.js
const express = require("express");
const router = express.Router();
const {
  getHuertoState,
  updateHuertoState,
} = require("../controllers/huertoController");
const { protegerRuta } = require("../middleware/authMiddleware");

// Definimos las rutas y las protegemos con el middleware
// La función 'protegerRuta' se ejecutará antes que las funciones del controlador.

// Ruta para obtener el estado del huerto del usuario logueado
router.get("/", protegerRuta, getHuertoState);

// Ruta para guardar el estado del huerto
router.post("/actualizar", protegerRuta, updateHuertoState);

module.exports = router;
