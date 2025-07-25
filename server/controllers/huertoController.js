// server/controllers/huertoController.js
const db = require("../config/db");

const getHuertoState = async (req, res) => {
  const maestroId = req.usuario.id; // <-- Usamos un nombre de variable más claro
  const moduloNombre = "HuertoVirtual";

  try {
    const [rows] = await db.query(
      "SELECT progreso_json FROM ProgresoModulos WHERE maestro_id = ? AND modulo_nombre = ?", // <-- CORRECCIÓN
      [maestroId, moduloNombre]
    );

    if (rows.length === 0) {
      const estadoInicial = { etapa: 0, agua: 50, sol: 50 };
      await db.query(
        "INSERT INTO ProgresoModulos (maestro_id, modulo_nombre, progreso_json) VALUES (?, ?, ?)", // <-- CORRECCIÓN
        [maestroId, moduloNombre, JSON.stringify(estadoInicial)]
      );
      return res.json(estadoInicial);
    }

    res.json(JSON.parse(rows[0].progreso_json));
  } catch (error) {
    console.error("Error al obtener estado del huerto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const updateHuertoState = async (req, res) => {
  const maestroId = req.usuario.id; // <-- Usamos un nombre de variable más claro
  const moduloNombre = "HuertoVirtual";
  const nuevoEstado = req.body;

  try {
    await db.query(
      "UPDATE ProgresoModulos SET progreso_json = ? WHERE maestro_id = ? AND modulo_nombre = ?", // <-- CORRECCIÓN
      [JSON.stringify(nuevoEstado), maestroId, moduloNombre]
    );
    res.json({ message: "Progreso guardado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar estado del huerto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  getHuertoState,
  updateHuertoState,
};
