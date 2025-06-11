"use client";
import React, { useState } from "react";
import "../../styles/separadores.css";
import GearScene from "../UI/3d-views/Gear";

export default function EngranajesPage() {
  const [diametroExterior, setDiametroExterior] = useState("");
  const [diametroHueco, setDiametroHueco] = useState("");
  const [alturaDiente, setAlturaDiente] = useState("");
  const [espesor, setEspesor] = useState("");
  const [numDientes, setNumDientes] = useState("");
  const [tipoCanal, setTipoCanal] = useState("C");

  return (
    <div className="contenedor-principal">
      <h1 className="titulo">Engranajes</h1>
      <div className="contenedor">
        <div className="formulario">
          <p className="subtitulo">Detalles del producto</p>

          <div>
            <label className="label">Diámetro exterior (mm)</label>
            <input
              type="text"
              className="select"
              value={diametroExterior}
              onChange={e => setDiametroExterior(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Diámetro del hueco interior (mm)</label>
            <input
              type="text"
              className="select"
              value={diametroHueco}
              onChange={e => setDiametroHueco(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Altura del diente (mm)</label>
            <input
              type="text"
              className="select"
              value={alturaDiente}
              onChange={e => setAlturaDiente(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Espesor del engranaje (mm)</label>
            <input
              type="text"
              className="select"
              value={espesor}
              onChange={e => setEspesor(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Número de dientes</label>
            <input
              type="text"
              className="select"
              value={numDientes}
              onChange={e => setNumDientes(e.target.value)}
              min={0}
            />
          </div>
        </div>

        <div className="contenedor-visualizacion">
          <p className="subtitulo">Visualización 3D</p>
          <div style={{ margin: 0, padding: 0, height: "50vh" }} className="contenedor-visualizacion-gear">
            <GearScene
              numTeeth={24}
              outerDiameter={10}
              innerDiameter={8}
              gearThickness={2}
              holeDiameter={2}
            />

          </div>
        </div>
      </div>

      <div className="botones">
        <button className="btn-outline">Cancelar</button>
        <button className="btn-rojo">Diseño completado</button>
      </div>
    </div>
  );
}
