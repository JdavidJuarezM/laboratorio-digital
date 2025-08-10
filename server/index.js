// server/index.js

// --- 1. Importaciones (usando el formato require) ---
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conectarDB = require("./config/db");
const maestrosRoutes = require("./routes/maestrosRoutes");
const huertoRoutes = require("./routes/huertoRoutes");

// --- 2. Configuración Inicial ---
dotenv.config(); // Carga las variables del archivo .env
conectarDB(); // Ejecuta la función para conectar a MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// --- 3. Configuración de CORS ---
// Leemos la URL de nuestro frontend desde una nueva variable de entorno
const frontendURL = process.env.FRONTEND_URL;

const corsOptions = {
  origin: frontendURL,
  optionsSuccessStatus: 200,
};

// Usamos las opciones de CORS en nuestro middleware
app.use(cors(corsOptions));

// --- 4. Otros Middlewares ---
app.use(express.json()); // Para que el servidor entienda peticiones con cuerpo JSON

// --- 5. Rutas de la API ---
app.use("/api/maestros", maestrosRoutes);
app.use("/api/huerto", huertoRoutes);

// --- 6. Lógica para correr el servidor (solo en desarrollo) ---
// Esta parte no se ejecutará en Vercel, lo cual es correcto.
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `✅ Servidor corriendo en modo de desarrollo en el puerto ${PORT}`
    );
  });
}

// --- 7. Exportación para Vercel ---
// Esta es la línea que permite a Vercel desplegar tu servidor.
module.exports = app;
