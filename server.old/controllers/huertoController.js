// server/controllers/huertoController.js

const Progreso = require("../models/ProgresoModel");

const getHuertoState = async (req, res) => {
  const maestroId = req.usuario.id;
  const moduloNombre = "HuertoVirtual";

  try {
    let progreso = await Progreso.findOne({
      maestro_id: maestroId,
      modulo_nombre: moduloNombre,
    });

    if (!progreso) {
      console.log("No se encontró progreso, creando uno nuevo para el huerto.");
      progreso = await Progreso.create({
        maestro_id: maestroId,
        modulo_nombre: moduloNombre,
        progreso_json: { etapa: 0, agua: 50, sol: 50, respuestasCorrectas: 0 },
      });
    }

    res.json(progreso.progreso_json);
  } catch (error) {
    console.error("Error al obtener estado del huerto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const updateHuertoState = async (req, res) => {
  const maestroId = req.usuario.id;
  const moduloNombre = "HuertoVirtual";
  const nuevoEstado = req.body;

  try {
    await Progreso.findOneAndUpdate(
      { maestro_id: maestroId, modulo_nombre: moduloNombre },
      { $set: { progreso_json: nuevoEstado } },
      { new: true, upsert: true }
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
