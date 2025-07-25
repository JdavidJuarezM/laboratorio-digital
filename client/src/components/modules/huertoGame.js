// client/src/components/modules/huertoGame.js
import * as PIXI from "pixi.js";

// Esta función inicializará y dibujará nuestro juego
export function runHuertoGame(app) {
  // Limpiamos el escenario para evitar duplicados si se recarga
  app.stage.removeChildren();

  // --- Fondo ---
  // Usaremos un rectángulo de color como fondo del juego
  const background = new PIXI.Graphics();
  background.fill(0xcce7ff); // Color de cielo azul claro
  background.rect(0, 0, app.screen.width, app.screen.height);
  background.fill();
  app.stage.addChild(background);

  // --- Planta (Sprite) ---
  // Usamos el logo de vite que está en /public como un placeholder
  const plantaTexture = PIXI.Texture.from("/vite.svg");
  const planta = new PIXI.Sprite(plantaTexture);

  planta.anchor.set(0.5);
  planta.x = app.screen.width / 2;
  planta.y = app.screen.height - 100; // Posicionado en la parte inferior
  planta.scale.set(2, 2); // Hacemos la planta más grande
  app.stage.addChild(planta);

  // --- Herramientas (Sol, Agua, etc.) ---
  // Aquí añadiremos la lógica para las herramientas que se arrastran
}
