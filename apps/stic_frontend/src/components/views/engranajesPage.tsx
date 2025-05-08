"use client";
import React, { useState } from "react";
import "../../styles/separadores.css";

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
                alt="Vista 3D del engranaje"
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
