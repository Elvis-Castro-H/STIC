"use client";
import React, { useState } from "react";
import "../../styles/separadores.css";

export default function SeparadoresPage() {
  const [marca, setMarca] = useState("");
  const [anio, setAnio] = useState("");
  const [modelo, setModelo] = useState("");
  const [espesor, setEspesor] = useState("2");

  return (
    <div className="contenedor-principal">
      <h1 className="titulo">Separadores</h1>
      <div className="contenedor">
        <div className="formulario">
          <p className="subtitulo">Detalles del producto</p>

          <div className="fila-selectores">
            <div>
              <label className="label">Seleccione la marca</label>
              <select
                className="select"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              >
                <option value="">Selecciona la marca</option>
                <option value="Marca1">Marca 1</option>
                <option value="Marca2">Marca 2</option>
              </select>
            </div>

            <div>
              <label className="label">Seleccione el año</label>
              <select
                className="select"
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
              >
                <option value="">Selecciona el año</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            <div>
              <label className="label">Seleccione el modelo</label>
              <select
                className="select"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              >
                <option value="">Selecciona el modelo</option>
                <option value="Modelo1">Modelo 1</option>
                <option value="Modelo2">Modelo 2</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Espesor</label>
            <div className="opciones-espesor">
              {["1", "1.5", "2"].map((val) => (
                <button
                  key={val}
                  onClick={() => setEspesor(val)}
                  className={`espesor-btn ${espesor === val ? "activo" : ""}`}
                >
                  {val}"
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
                alt="Vista 3D del separador"
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
