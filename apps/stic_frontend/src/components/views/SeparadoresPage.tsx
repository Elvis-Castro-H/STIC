"use client";
import React, { useState, useEffect } from "react";
import "../../styles/separadores.css";
import SpacerScene from "../UI/3d-views/Spacer";

import {
  fetchMakes,
  fetchModelsByMake,
  fetchYearsByMakeAndModel,
} from "@/app/services/VehicleService";

import { fetchMaterials } from "@/app/services/MaterialService";
import { calculateSpacerQuotation } from "@/app/services/spacerQuotationService";
import { QuotationResponse } from "@/app/types/Spacers";
import { Material } from "@/app/types/Materials";

export default function SeparadoresPage() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [espesor, setEspesor] = useState("1");
  const [materialSeleccionado, setMaterialSeleccionado] = useState("");

  const [makeOptions, setMakeOptions] = useState<string[]>([]);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);

  const [isLoadingMakes, setIsLoadingMakes] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingYears, setIsLoadingYears] = useState(false);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const [cotizacion, setCotizacion] = useState<QuotationResponse | null>(null);

  // Cargar marcas
  useEffect(() => {
    const loadMakes = async () => {
      setIsLoadingMakes(true);
      const makes = await fetchMakes();
      setMakeOptions(makes);
      setIsLoadingMakes(false);
    };
    loadMakes();
  }, []);

  // Cargar modelos cuando cambia marca
  useEffect(() => {
    const loadModels = async () => {
      setModelo("");
      setAnio("");
      setYearOptions([]);
      setModelOptions([]);
      setCotizacion(null);

      if (marca) {
        setIsLoadingModels(true);
        const models = await fetchModelsByMake(marca);
        setModelOptions(models);
        setIsLoadingModels(false);
      }
    };
    loadModels();
  }, [marca]);

  // Cargar años cuando cambia modelo
  useEffect(() => {
    const loadYears = async () => {
      setAnio("");
      setYearOptions([]);
      setCotizacion(null);

      if (marca && modelo) {
        setIsLoadingYears(true);
        const years = await fetchYearsByMakeAndModel(marca, modelo);
        setYearOptions(years);
        setIsLoadingYears(false);
      }
    };
    loadYears();
  }, [modelo]);

  // Cargar materiales
  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoadingMaterials(true);
      const data = await fetchMaterials();
      setMateriales(data);
      setIsLoadingMaterials(false);
    };
    loadMaterials();
  }, []);

  const handleCalculateDesign = async () => {
    if (!marca || !modelo || !anio || !espesor || !materialSeleccionado) {
      alert("Completa todos los campos antes de generar la cotización.");
      return;
    }

    setIsCalculating(true);
    const data = {
      make: marca,
      model: modelo,
      year: parseInt(anio),
      inches: parseFloat(espesor),
      material: materialSeleccionado,
    };

    const result = await calculateSpacerQuotation(data);
    setCotizacion(result);
    setIsCalculating(false);
  };

  return (
    <div className="contenedor-principal">
      <h1 className="titulo">Separadores</h1>
      <div className="contenedor">
        <div className="formulario">
          <p className="subtitulo">Detalles del producto</p>

          <div className="fila-selectores" style={{ gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label className="label">Marca</label>
              <select
                className="select"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                disabled={isLoadingMakes}
              >
                <option value="">
                  {isLoadingMakes ? "Cargando..." : "Selecciona la marca"}
                </option>
                {makeOptions.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Modelo</label>
              <select
                className="select"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                disabled={!marca || isLoadingModels}
              >
                <option value="">
                  {isLoadingModels ? "Cargando..." : "Selecciona el modelo"}
                </option>
                {modelOptions.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Año</label>
              <select
                className="select"
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
                disabled={!modelo || isLoadingYears}
              >
                <option value="">
                  {isLoadingYears ? "Cargando..." : "Selecciona el año"}
                </option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
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

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="label">Material</label>
            <select
              className="select"
              value={materialSeleccionado}
              onChange={(e) => setMaterialSeleccionado(e.target.value)}
              disabled={isLoadingMaterials}
            >
              <option value="">
                {isLoadingMaterials ? "Cargando..." : "Selecciona el material"}
              </option>
              {materiales.map((mat) => (
                <option key={mat.id} value={mat.name}>
                  {mat.name}
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
            style={{ margin: 0, padding: 0, height: "50vh" }}
            className="contenedor-visualizacion-gear"
          >
            {cotizacion ? (
              <SpacerScene
                studCount={cotizacion.boltCount}
                //hasCenterLip={cotizacion.isHubCentric}
                hasCenterLip={true}
                thickness={cotizacion.thicknessMm * 25}
                boltPattern={cotizacion.boltPattern}
                boltDiameter={12}
                lipHeight={8}
                lipDiameter={cotizacion.centerBore}
              />
            ) : (
              <div style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>
                Completa los campos y haz clic en <strong>Diseño completado</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="botones">
        <button className="btn-outline">Cancelar</button>
        <button
          className="btn-rojo"
          disabled={isCalculating}
          onClick={handleCalculateDesign}
        >
          {isCalculating ? "Calculando..." : "Diseño completado"}
        </button>
      </div>
    </div>
  );
}
