"use client";
import React, { useState, useEffect } from "react";
import "../../styles/separadores.css";
import PulleyScene from "../UI/3d-views/Pulley";
import { calculatePulleyQuotation } from "@/app/services/pulleyQuotationService";
import { fetchMaterials } from "@/app/services/MaterialService";
import { Material } from "@/app/types/Materials";
import { PulleyQuotationResponse } from "@/app/types/Pulleys";

export default function PoleasPage() {
  const [diametroExterior, setDiametroExterior] = useState("");
  const [diametroHueco, setDiametroHueco] = useState("");
  const [numCanales, setNumCanales] = useState("");
  const [tipoCanal, setTipoCanal] = useState("C");
  const [material, setMaterial] = useState("");

  const [cotizacion, setCotizacion] = useState<PulleyQuotationResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [materiales, setMateriales] = useState<Material[]>([]);

  useEffect(() => {
    const loadMaterials = async () => {
      const data = await fetchMaterials();
      setMateriales(data);
    };
    loadMaterials();
  }, []);

  const handleCalculate = async () => {
    if (!diametroExterior || !diametroHueco || !numCanales || !tipoCanal || !material) {
      alert("Completa todos los campos");
      return;
    }

    setIsCalculating(true);
    const data = {
      outerDiameter: parseFloat(diametroExterior),
      innerBoreDiameter: parseFloat(diametroHueco),
      width: 3, // puedes permitir al usuario ingresar el espesor si lo necesitas
      grooveCount: parseInt(numCanales),
      grooveType: tipoCanal,
      material: material,
    };

    const result = await calculatePulleyQuotation(data);
    setCotizacion(result);
    setIsCalculating(false);
  };

  return (
    <div className="contenedor-principal">
      <h1 className="titulo">Poleas</h1>
      <div className="contenedor">
        <div className="formulario">
          <p className="subtitulo">Detalles del producto</p>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="label">Diámetro exterior (mm)</label>
            <input
              type="number"
              className="select"
              value={diametroExterior}
              onChange={(e) => setDiametroExterior(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="label">Diámetro del hueco interior</label>
            <input
              type="number"
              className="select"
              value={diametroHueco}
              onChange={(e) => setDiametroHueco(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="label">Número de canales</label>
            <input
              type="number"
              className="select"
              value={numCanales}
              onChange={(e) => setNumCanales(e.target.value)}
              min={1}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="label">Tipo de canal</label>
            <div className="opciones-espesor">
              {["A", "B", "C"].map((tipo) => (
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

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="label">Material</label>
            <select
              className="select"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option value="">Selecciona un material</option>
              {materiales.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {cotizacion && (
            <div
              className="precio-cotizado"
              style={{
                marginTop: "1.5rem",
                fontSize: "1.1rem",
                textAlign: "center",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              Precio estimado: BOB {cotizacion.price.toFixed(2)}
            </div>
          )}
        </div>

        <div className="contenedor-visualizacion">
          <p className="subtitulo">Visualización 3D</p>
          <div
            className="contenedor-visualizacion-gear"
            style={{ margin: 0, padding: 0, height: "50vh" }}
          >
            {cotizacion ? (
              <PulleyScene
                diametroExterior={cotizacion.outerDiameter}
                diametroHuecoInterior={cotizacion.innerBoreDiameter}
                numeroCanales={cotizacion.grooveCount}
                tipoDeCanal={cotizacion.grooveType}
              />
            ) : (
              <div style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>
                Ingresa los datos y presiona <strong>Diseño completado</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="botones">
        <button className="btn-outline">Cancelar</button>
        <button className="btn-rojo" disabled={isCalculating} onClick={handleCalculate}>
          {isCalculating ? "Calculando..." : "Diseño completado"}
        </button>
      </div>
    </div>
  );
}
