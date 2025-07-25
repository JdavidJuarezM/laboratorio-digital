// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const protegerRuta = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "secreto_super_secreto");
      req.usuario = { id: decoded.id, nombre: decoded.nombre };
      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: "Token no válido, autorización denegada" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "No hay token, autorización denegada" });
  }
};

module.exports = { protegerRuta };
