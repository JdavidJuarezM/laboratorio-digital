// archivo: server/models/ProgresoModel.js

const mongoose = require("mongoose");

// Este es el Schema para el sub-documento que contiene el estado del huerto
const ProgresoHuertoSchema = new mongoose.Schema(
  {
    etapa: { type: Number, default: 0 },
    agua: { type: Number, default: 50 },
    sol: { type: Number, default: 50 },
    respuestasCorrectas: { type: Number, default: 0 },
  },
  { _id: false }
); // _id: false para que no cree un ID para este sub-objeto

const ProgresoModuloSchema = new mongoose.Schema(
  {
    maestro_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Maestro", // Asumiendo que tienes un modelo 'Maestro' o 'Usuario'
      required: true,
    },
    modulo_nombre: {
      type: String,
      required: true,
    },
    // Aquí guardamos el estado del huerto como un objeto anidado, no como texto
    progreso_json: ProgresoHuertoSchema,
  },
  {
    timestamps: true, // Para saber cuándo se creó o actualizó
    // Creamos un índice para que la búsqueda por maestro y módulo sea súper rápida
    indexes: [{ fields: { maestro_id: 1, modulo_nombre: 1 }, unique: true }],
  }
);

// Creamos y exportamos el modelo
const Progreso = mongoose.model("ProgresoModulo", ProgresoModuloSchema);
module.exports = Progreso;
