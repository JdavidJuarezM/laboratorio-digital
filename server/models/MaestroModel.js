// server/models/MaestroModel.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const maestroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
  },
  { timestamps: true }
);

// Método para comparar la contraseña del formulario con la hasheada en la BD
maestroSchema.methods.compararPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password_hash);
};

const Maestro = mongoose.model("Maestro", maestroSchema);
module.exports = Maestro;
