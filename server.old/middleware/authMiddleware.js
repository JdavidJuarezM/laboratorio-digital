// server/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const Maestro = require("../models/MaestroModel"); // Opcional pero recomendado para verificar que el usuario aún existe

const protegerRuta = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 1. Obtener el token de la cabecera
      token = req.headers.authorization.split(" ")[1];

      // 2. Verificar el token usando el secreto de las variables de entorno
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Obtener el usuario desde la BD y adjuntarlo al request (sin el password)
      // Esta es una verificación extra para asegurar que el usuario del token aún existe en la BD
      req.usuario = await Maestro.findById(decoded.id).select("-password_hash");

      if (!req.usuario) {
        return res
          .status(401)
          .json({ message: "Usuario no encontrado, autorización denegada" });
      }

      next(); // Si todo está bien, pasa al siguiente paso (el controlador)
    } catch (error) {
      console.error("Error de autenticación:", error.name);
      return res
        .status(401)
        .json({ message: "Token no válido, autorización denegada" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "No hay token, autorización denegada" });
  }
};

module.exports = { protegerRuta };
