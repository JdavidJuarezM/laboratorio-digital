// api/index.js

// Importamos nuestra aplicación de Express desde su ubicación original en la carpeta 'server'
const app = require("../server/index.js");

// Exportamos la app para que Vercel la pueda usar.
module.exports = app;
