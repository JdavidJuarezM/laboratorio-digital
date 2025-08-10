// server/index.js

// --- 1. Importaciones ---
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conectarDB = require("./config/db");
const maestrosRoutes = require("./routes/maestrosRoutes");
const huertoRoutes = require("./routes/huertoRoutes");

// --- 2. Configuración Inicial ---
dotenv.config();
conectarDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 3. Configuración de CORS para Diagnóstico ---
// Usamos origin: "*" para permitir temporalmente peticiones desde CUALQUIER lugar.
// Esto nos ayudará a determinar si el problema es la variable de entorno FRONTEND_URL.
console.log(
  "ADVERTENCIA: El servidor está corriendo en modo de diagnóstico con CORS abierto (*)."
);

const corsOptions = {
  origin: "*", // Permitir CUALQUIER origen (solo para depurar)
  optionsSuccessStatus: 200,
};

// Manejo explícito de las peticiones "preflight" (OPTIONS)
app.options("*", cors(corsOptions));

// Manejo general de CORS para el resto de las peticiones (GET, POST, etc.)
app.use(cors(corsOptions));

// --- 4. Otros Middlewares ---
app.use(express.json());

// --- 5. Rutas de la API ---
app.use("/api/maestros", maestrosRoutes);
app.use("/api/huerto", huertoRoutes);

// --- 6. Lógica para correr el servidor (solo en desarrollo local) ---
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `✅ Servidor corriendo en modo de desarrollo en el puerto ${PORT}`
    );
  });
}

// --- 7. Exportación para Vercel ---
module.exports = app;
