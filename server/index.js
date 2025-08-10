// server/index.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv"); // Para manejar variables de entorno locales

// --- 1. Importamos la nueva conexión a MongoDB ---
const conectarDB = require("./config/db");

// --- 2. Importamos las mismas rutas ---
const maestrosRoutes = require("./routes/maestrosRoutes");
const huertoRoutes = require("./routes/huertoRoutes");

// --- 3. Configuración inicial ---
dotenv.config(); // Carga las variables del archivo .env
conectarDB(); // Ejecutamos la función para conectar a MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// --- 4. Middlewares (igual que antes) ---
app.use(cors());
app.use(express.json());

// --- 5. Rutas (igual que antes) ---
app.use("/api/maestros", maestrosRoutes);
app.use("/api/huerto", huertoRoutes);

// --- 6. Lógica para correr el servidor ---

// Esta parte solo se ejecuta cuando estás en tu computadora (desarrollo local)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `✅ Servidor corriendo en modo de desarrollo en el puerto ${PORT}`
    );
  });
}

// --- 7. ¡La exportación para Vercel! ---
// Esta es la línea que Vercel usará para tomar tu app y desplegarla.
module.exports = app;
