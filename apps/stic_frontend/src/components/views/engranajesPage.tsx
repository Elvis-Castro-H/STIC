"use client";
import React, { useState, useEffect } from "react";
import "../../styles/separadores.css";
import GearScene from "../UI/3d-views/Gear";

import { calculateGearQuotation } from "@/app/services/GearQuotationService";
import { fetchMaterials } from "@/app/services/MaterialService";
import { GearQuotationResponse } from "@/app/types/Gears";
import { Material } from "@/app/types/Materials";

export default function EngranajesPage() {
  const [diametroExterior, setDiametroExterior] = useState("");
  const [diametroHueco, setDiametroHueco] = useState("");
  const [alturaDiente, setAlturaDiente] = useState("");
  const [espesor, setEspesor] = useState("");
  const [numDientes, setNumDientes] = useState("");
  const [tipoEngranaje, setTipoEngranaje] = useState("Spur");
  const [material, setMaterial] = useState("");

  const [cotizacion, setCotizacion] = useState<GearQuotationResponse | null>(null);
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
    if (!diametroExterior || !diametroHueco || !alturaDiente || !espesor || !numDientes || !material) {
      alert("Completa todos los campos");
      return;
    }

    setIsCalculating(true);

    const result = await calculateGearQuotation({
      toothCount: parseInt(numDientes),
      module: 2.5,
      pitchDiameter: parseFloat(diametroHueco),
      outerDiameter: parseFloat(diametroExterior),
      width: parseFloat(espesor),
      toothHeight: parseFloat(alturaDiente),
      gearType: tipoEngranaje,
      material: material,
    });

    setCotizacion(result);
    setIsCalculating(false);
  };

  return (
    <div className="contenedor-principal">
      <h1 className="titulo">Engranajes</h1>
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
            <label className="label">Diámetro del hueco interior (pitch) (mm)</label>
            <input
              type="number"
              className="select"
              value={diametroHueco}
              onChange={(e) => setDiametroHueco(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="label">Altura del diente (mm)</label>
            <input
              type="number"
              className="select"
              value={alturaDiente}
              onChange={(e) => setAlturaDiente(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="label">Espesor del engranaje (mm)</label>
            <input
              type="number"
              className="select"
              value={espesor}
              onChange={(e) => setEspesor(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="label">Número de dientes</label>
            <input
              type="number"
              className="select"
              value={numDientes}
              onChange={(e) => setNumDientes(e.target.value)}
            />
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
            {true ? (
              <GearScene
                numTeeth={numDientes ? parseInt(numDientes) : 0}
                outerDiameter={diametroExterior ? parseFloat(diametroExterior) : 0}
                innerDiameter={(diametroExterior ? parseFloat(diametroExterior) : 0) - (alturaDiente ? parseFloat(alturaDiente) : 0)}
                gearThickness={espesor ? parseFloat(espesor) : 0}
                holeDiameter={diametroHueco ? parseFloat(diametroHueco) : 0}
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
