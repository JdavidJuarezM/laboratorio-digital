// server/controllers/maestrosController.js
const db = require("../config/db");
const bcrypt = require("bcrypt");

const registrarMaestro = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const sql =
      "INSERT INTO Maestros (nombre, email, password_hash) VALUES (?, ?, ?)";
    const [result] = await db.query(sql, [nombre, email, password_hash]);

    res.status(201).json({
      message: "Maestro registrado exitosamente",
      maestroId: result.insertId,
    });
  } catch (error) {
    console.error("Error al registrar al maestro:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor al registrar al maestro" });
  }
};

// Esta línea es crucial. Expone la función para que otros archivos puedan importarla.
module.exports = {
  registrarMaestro,
};
