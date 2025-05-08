"use client";
import React, { useState } from "react";
import "../../styles/separadores.css";

export default function PoleasPage() {
  const [diametroInterior, setDiametroInterior] = useState("");
  const [diametroHueco, setDiametroHueco] = useState("");
  const [numCanales, setNumCanales] = useState("");
  const [tipoCanal, setTipoCanal] = useState("C");

  return (
    <div className="contenedor-principal">
      <h1 className="titulo">Poleas</h1>
      <div className="contenedor">
        <div className="formulario">
          <p className="subtitulo">Detalles del producto</p>

          <div>
            <label className="label">Diámetro interior (mm)</label>
            <input
              type="text"
              className="select"
              value={diametroInterior}
              onChange={e => setDiametroInterior(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Diámetro del hueco interior</label>
            <input
              type="text"
              className="select"
              value={diametroHueco}
              onChange={e => setDiametroHueco(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Número de canales</label>
            <input
              type="number"
              className="select"
              value={numCanales}
              onChange={e => setNumCanales(e.target.value)}
              min={0}
            />
          </div>

          <div>
            <label className="label">Tipo de canal</label>
            <div className="opciones-espesor">
              {["A", "B", "C"].map(tipo => (
                <button
                  key={tipo}
                  onClick={() => setTipoCanal(tipo)}
                  className={`espesor-btn ${tipoCanal === tipo ? "activo" : ""}`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="contenedor-visualizacion">
          <p className="subtitulo">Visualización 3D</p>
          <div className="visualizacion">
            <div className="contenedor-3d">
              <img
                src="https://i.ibb.co/Kxsn4rvB/image-23.png"
                alt="Vista 3D de la polea"
                className="imagen-3d"
              />
            </div>
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
