// server/controllers/maestrosController.js
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // 👈 Importamos jwt

const registrarMaestro = async (req, res) => {
  // ... (esta función se queda como está)
};

// 👇 --- INICIO DE NUEVA FUNCIÓN --- 👇
const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al maestro por su email
    const [rows] = await db.query("SELECT * FROM Maestros WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" }); // No decir si es el email o la pass por seguridad
    }

    const maestro = rows[0];

    // 2. Comparar la contraseña enviada con la hasheada en la BD
    const esPasswordCorrecto = await bcrypt.compare(
      password,
      maestro.password_hash
    );
    if (!esPasswordCorrecto) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 3. Si todo es correcto, crear un token
    const payload = { id: maestro.id, nombre: maestro.nombre };
    // Deberías guardar tu 'secreto' en un archivo .env, pero por ahora lo ponemos aquí
    const token = jwt.sign(payload, "secreto_super_secreto", {
      expiresIn: "1h",
    });

    // 4. Enviar el token al cliente
    res.json({ message: "Inicio de sesión exitoso", token: token });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
// 👆 --- FIN DE NUEVA FUNCIÓN --- 👆

module.exports = {
  registrarMaestro,
  iniciarSesion, // 👈 Exportamos la nueva función
};
