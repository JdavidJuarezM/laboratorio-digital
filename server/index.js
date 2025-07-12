// server/index.js
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const maestrosRoutes = require("./routes/maestrosRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- INICIO DE CÓDIGO AÑADIDO ---
// Ruta de prueba para verificar la conexión desde el frontend
app.get("/api", (req, res) => {
  res.json({
    message: "¡El backend del Laboratorio Digital está funcionando!",
  });
});
// --- FIN DE CÓDIGO AÑADIDO ---

app.use("/api/maestros", maestrosRoutes);

const startServer = async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Conexión a la base de datos MySQL exitosa.");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    process.exit(1);
  }
};

startServer();
