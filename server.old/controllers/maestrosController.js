// server/controllers/maestrosController.js

const Maestro = require("../models/MaestroModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registrarMaestro = async (req, res) => {
  // ... (tu función de registro, está perfecta y no necesita cambios)
  const { nombre, email, password } = req.body;
  try {
    let maestro = await Maestro.findOne({ email });
    if (maestro) {
      return res
        .status(400)
        .json({ message: "Un usuario ya existe con ese email." });
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    maestro = new Maestro({ nombre, email, password_hash });
    await maestro.save();
    const payload = { id: maestro._id, nombre: maestro.nombre };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.status(201).json({ message: "Usuario registrado exitosamente", token });
  } catch (error) {
    console.error("Error al registrar maestro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const iniciarSesion = async (req, res) => {
  // ... (tu función de inicio de sesión, está perfecta y no necesita cambios)
  const { email, password } = req.body;
  try {
    const maestro = await Maestro.findOne({ email });
    if (!maestro) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const esPasswordCorrecto = await maestro.compararPassword(password);
    if (!esPasswordCorrecto) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const payload = { id: maestro._id, nombre: maestro.nombre };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.json({ message: "Inicio de sesión exitoso", token: token });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// --- 👇 NUEVA FUNCIÓN AÑADIDA 👇 ---
const getMaestroPerfil = async (req, res) => {
  try {
    // req.usuario es añadido por el middleware de autenticación. Contiene el payload del token.
    // Buscamos al usuario en la BD usando el ID del token.
    // Usamos .select('-password_hash') para excluir la contraseña hasheada de la respuesta. ¡Nunca envíes el hash!
    const maestro = await Maestro.findById(req.usuario.id).select(
      "-password_hash"
    );

    if (!maestro) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(maestro);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  registrarMaestro,
  iniciarSesion,
  getMaestroPerfil, // 👈 Exportamos la nueva función
};
