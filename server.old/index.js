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

app.use(cors());
app.use(express.json());

app.use("/api/maestros", maestrosRoutes);
app.use("/api/huerto", huertoRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
