// server/config/db.js

const mongoose = require("mongoose");

const conectarDB = async () => {
  try {
    // Leemos la cadena de conexión desde las variables de entorno.
    // Es importante que la variable MONGO_URI esté definida en tu archivo .env local
    // y en los ajustes de "Environment Variables" de Vercel.
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("La variable de entorno MONGO_URI no está definida.");
    }

    // En las versiones recientes de Mongoose, ya no es necesario pasar el objeto de opciones.
    await mongoose.connect(mongoURI);

    console.log("✅ Conexión a MongoDB exitosa.");
  } catch (error) {
    console.error(`❌ Error al conectar con MongoDB: ${error.message}`);
    // Detiene la ejecución de la app si no se puede conectar a la DB
    process.exit(1);
  }
};

module.exports = conectarDB;
