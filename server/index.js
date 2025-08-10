// server/index.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conectarDB = require("./config/db");
const maestrosRoutes = require("./routes/maestrosRoutes");
const huertoRoutes = require("./routes/huertoRoutes");

dotenv.config();
conectarDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- INICIO DE LA CORRECCIÓN DE CORS ---

// Leemos la URL de nuestro frontend desde la variable de entorno
const frontendURL = process.env.FRONTEND_URL;

const corsOptions = {
  origin: frontendURL,
  optionsSuccessStatus: 200,
};

// 1. MANEJO EXPLÍCITO DE PREFLIGHT REQUESTS
// Esto intercepta todas las peticiones OPTIONS y responde inmediatamente
// con los headers de CORS correctos, antes de que lleguen a nuestras rutas.
app.options("*", cors(corsOptions));

// 2. MANEJO GENERAL DE CORS
// Esto se aplica al resto de las peticiones (GET, POST, etc.)
app.use(cors(corsOptions));

// --- FIN DE LA CORRECCIÓN DE CORS ---

app.use(express.json());

// Rutas de la API
app.use("/api/maestros", maestrosRoutes);
app.use("/api/huerto", huertoRoutes);

// Lógica para correr el servidor (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `✅ Servidor corriendo en modo de desarrollo en el puerto ${PORT}`
    );
  });
}

// Exportación para Vercel
module.exports = app;
