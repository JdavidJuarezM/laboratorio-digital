const mongoose = require("mongoose");

const huertoSchema = new mongoose.Schema(
  {
    // Referencia al usuario al que pertenece este huerto
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", // Asumiendo que tienes un modelo de Usuario
      required: true,
      unique: true, // Cada usuario solo tiene un huerto
    },
    etapa: {
      type: Number,
      default: 0,
    },
    agua: {
      type: Number,
      default: 50,
    },
    sol: {
      type: Number,
      default: 50,
    },
    respuestasCorrectas: {
      type: Number,
      default: 0,
    },
    // Mongoose añade automáticamente timestamps (createdAt, updatedAt) si lo quieres
  },
  { timestamps: true }
);

// Creamos y exportamos el modelo
const Huerto = mongoose.model("Huerto", huertoSchema);
module.exports = Huerto;
