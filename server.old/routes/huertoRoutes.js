const express = require("express");
const router = express.Router();
console.log("✅ CONFIRMADO: El archivo huertoRoutes.js se ha cargado.");
const {
  getHuertoState,
  updateHuertoState,
} = require("../controllers/huertoController");
const { protegerRuta } = require("../middleware/authMiddleware");

// TODAS las rutas del huerto deben estar protegidas.
router.get("/", protegerRuta, getHuertoState);
router.post("/actualizar", protegerRuta, updateHuertoState);

module.exports = router;
