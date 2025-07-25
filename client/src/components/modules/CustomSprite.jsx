// client/src/components/CustomSprite.jsx
import { PixiComponent } from "@pixi/react";
import * as PIXI from "pixi.js";

const CustomSprite = PixiComponent("CustomSprite", {
  create: (props) => {
    // Esta función crea la instancia del Sprite de Pixi
    return PIXI.Sprite.from(props.image);
  },
  applyProps: (instance, oldProps, newProps) => {
    // Esta función actualiza las propiedades del sprite (posición, tamaño, etc.)
    const { image, ...newP } = newProps;
    Object.assign(instance, newP);
  },
});

export default CustomSprite;
