const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const maestrosRoutes = require("./routes/maestrosRoutes");
const huertoRoutes = require("./routes/huertoRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/maestros", maestrosRoutes);
app.use("/api/huerto", huertoRoutes);

const startServer = async () => {
  try {
    await db.query("SELECT 1");
    console.log(" Conexión a la base de datos MySQL exitosa.");
    app.listen(PORT, () => {
      console.log(` Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error(" Error al conectar con la base de datos:", error);
    process.exit(1);
  }
};
startServer();
