// client/src/App.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [mensajeBackend, setMensajeBackend] = useState("Cargando...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api")
      .then((response) => {
        setMensajeBackend(response.data.message);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los datos del backend", error);
        setMensajeBackend("Error al conectar con el backend");
      });
  }, []);

  return (
    <div className="App">
      <h1>Laboratorio Digital</h1>
      <h2>Mensaje desde el Backend:</h2>
      <p>{mensajeBackend}</p>
    </div>
  );
}

// Esta línea es la que resuelve el error.
// "Publica" el componente App para que main.jsx pueda importarlo.
export default App;
