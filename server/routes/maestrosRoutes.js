// server/routes/maestrosRoutes.js
const express = require("express");
const router = express.Router();
const { registrarMaestro } = require("../controllers/maestrosController");

router.post("/registro", registrarMaestro);

module.exports = router;
