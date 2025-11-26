"use client";
import React, { useState, useEffect } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import "../../styles/admin.css";
import { fetchProducts } from "@/app/services/ProductService";
import { fetchMaterials } from "@/app/services/MaterialService";
import { Product } from "@/app/types/Products";
import { Material } from "@/app/types/Materials";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTachometerAlt,
  FaBoxes,
  FaCogs,
  FaFileInvoiceDollar,
  FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AdminForm() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [cotizaciones, setCotizaciones] = useState([]);

  // Estados para formularios
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Estado para nuevos productos/materiales
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({});
  const { user, userData, logout, isAdmin } = useFirebaseUser();

  const router = useRouter();

  const admin = isAdmin();

  useEffect(() => {
    if (user && !admin) {
      //router.push("/");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const productsData = await fetchProducts();
        const materialsData = await fetchMaterials();
        setProducts(productsData);
        setMaterials(materialsData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, admin]);
  const saveProductToAPI = async (product: Partial<Product>) => {
    const endpoint = product.id
      ? `/api/Product/${product.id}`
      : "/api/Product";
    const method = product.id ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        userId: user?.uid ?? "", // si tu backend requiere esto
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud al guardar producto");
    }

    return await response.json();
  };

  const saveMaterialToAPI = async (material: Partial<Material>) => {
    console.log('ID que estás enviando al backend:', material.id);
    const endpoint = material.id
      ? `http://localhost:5267/api/Material/${material.id}`
      : "http://localhost:5267/api/Material";
    const method = material.id ? "PUT" : "POST";

    const bodyToSend = {

      pricePerKg: material.pricePerKg ?? 0,
      name: material.name ?? "",
      density: material.density ?? 0,
      pricePerHourMachine: material.pricePerHourMachine ?? 0,
      pricePerHourOperator: material.pricePerHourOperator ?? 0,
    };

    console.log("Saving material:", bodyToSend);

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyToSend),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud al guardar material");
    }

    return await response.json();
  };



  const handleDeleteProduct = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        // Implementar llamada a API para eliminar
        // await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
        alert("Producto eliminado con éxito");
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleDeleteMaterial = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este material?")) {
      try {
        // Implementar llamada a API para eliminar
        // await deleteMaterial(id);
        setMaterials(materials.filter((m) => m.id !== id));
        alert("Material eliminado con éxito");
      } catch (error) {
        console.error("Error al eliminar material:", error);
        alert("Error al eliminar el material");
      }
    }
  };

  const handleSaveProduct = async (product: Partial<Product>) => {
    try {
      const saved = await saveProductToAPI(product);

      if (product.id) {
        setProducts(products.map((p) => (p.id === product.id ? saved : p)));
        setEditingProduct(null);
      } else {
        setProducts([...products, saved]);
        setNewProduct({});
      }

      alert("Producto guardado con éxito");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar el producto");
    }
  };

  const handleSaveMaterial = async (material: Partial<Material>) => {
    try {
      const saved = await saveMaterialToAPI(material);

      if (material.id) {
        setMaterials(materials.map((m) => (m.id === material.id ? saved : m)));
        setEditingMaterial(null);
      } else {
        setMaterials([...materials, saved]);
        setNewMaterial({});
      }

      alert("Material guardado con éxito");
    } catch (error) {
      console.error("Error al guardar material:", error);
      alert("Error al guardar el material");
    }
  };

  // Si no hay usuario o está cargando, mostrar indicador
  if (!user || loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>STIC Admin</h2>
          <p>{user?.email}</p>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === "dashboard" ? "active" : ""
              }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaTachometerAlt /> Dashboard
          </button>

          <button
            className={`admin-nav-item ${activeTab === "productos" ? "active" : ""
              }`}
            onClick={() => setActiveTab("productos")}
          >
            <FaBoxes /> Productos
          </button>

          <button
            className={`admin-nav-item ${activeTab === "materiales" ? "active" : ""
              }`}
            onClick={() => setActiveTab("materiales")}
          >
            <FaCogs /> Materiales
          </button>


        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={logout}>
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="admin-content">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="admin-dashboard">
            <h1>Dashboard</h1>

            <div className="admin-stats">
              <div className="admin-stat-card">
                <h3>Productos</h3>
                <p className="stat-number">{products.length}</p>
              </div>

              <div className="admin-stat-card">
                <h3>Materiales</h3>
                <p className="stat-number">{materials.length}</p>
              </div>


            </div>

            <h2>Actividad Reciente</h2>
            <div className="admin-recent-activity">
              <p>No hay actividades recientes para mostrar.</p>
            </div>
          </div>
        )}

        {/* Productos */}
        {activeTab === "productos" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h1>Gestión de Productos</h1>
              <button
                className="admin-add-btn"
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({});
                  setActiveTab("nuevo-producto");
                }}
              >
                <FaPlus /> Nuevo Producto
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="admin-table-image"
                          />
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.categoryId}</td>
                      <td>Bs. {product.price}</td>
                      <td>{product.stock}</td>
                      <td>
                        <button
                          className="admin-edit-btn"
                          onClick={() => {
                            setEditingProduct(product);
                            setActiveTab("editar-producto");
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDeleteProduct(product.id || 0)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Materiales */}
        {activeTab === "materiales" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h1>Gestión de Materiales</h1>
              <button
                className="admin-add-btn"
                onClick={() => {
                  setEditingMaterial(null);
                  setNewMaterial({});
                  setActiveTab("nuevo-material");
                }}
              >
                <FaPlus /> Nuevo Material
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Densidad</th>
                    <th>Precio por kg</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material) => (
                    <tr key={material.id}>
                      <td>{material.id}</td>
                      <td>{material.name}</td>
                      <td>{material.density}</td>
                      <td>Bs. {material.pricePerKg}</td>
                      <td>
                        <button
                          className="admin-edit-btn"
                          onClick={() => {
                            setEditingMaterial(material);
                            setActiveTab("editar-material");
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDeleteMaterial(material.id || 0)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cotizaciones */}
        {activeTab === "cotizaciones" && (
          <div className="admin-section">
            <h1>Gestión de Cotizaciones</h1>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizaciones.length === 0 ? (
                    <tr>
                      <td colSpan={7}>No hay cotizaciones disponibles</td>
                    </tr>
                  ) : (
                    cotizaciones.map((cotizacion: any) => (
                      <tr key={cotizacion.id}>
                        <td>{cotizacion.id}</td>
                        <td>{cotizacion.type}</td>
                        <td>{cotizacion.client}</td>
                        <td>{cotizacion.date}</td>
                        <td>Bs. {cotizacion.price}</td>
                        <td>{cotizacion.status}</td>
                        <td>
                          <button className="admin-edit-btn">
                            <FaEdit />
                          </button>
                          <button className="admin-delete-btn">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Formulario Editar Producto */}
        {activeTab === "editar-producto" && editingProduct && (
          <div className="admin-form-container">
            <h1>Editar Producto</h1>

            <form
              className="admin-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct(editingProduct);
              }}
            >
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={editingProduct.name || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Precio</label>
                  <input
                    id="price"
                    type="number"
                    value={editingProduct.price || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                    required
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    type="number"
                    value={editingProduct.stock || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Categoría</label>
                <select
                  id="category"
                  value={editingProduct.categoryId || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="1">Separadores</option>
                  <option value="2">Engranajes</option>
                  <option value="3">Poleas</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image">URL de Imagen</label>
                <input
                  id="image"
                  type="text"
                  value={editingProduct.image || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setActiveTab("productos")}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulario Nuevo Producto */}
        {activeTab === "nuevo-producto" && (
          <div className="admin-form-container">
            <h1>Nuevo Producto</h1>

            <form
              className="admin-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct(newProduct);
                setActiveTab("productos");
              }}
            >
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={newProduct.name || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  value={newProduct.description || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Precio</label>
                  <input
                    id="price"
                    type="number"
                    value={newProduct.price || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                    required
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    type="number"
                    value={newProduct.stock || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Categoría</label>
                <select
                  id="category"
                  value={newProduct.categoryId || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="1">Separadores</option>
                  <option value="2">Engranajes</option>
                  <option value="3">Poleas</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image">URL de Imagen</label>
                <input
                  id="image"
                  type="text"
                  value={newProduct.image || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setActiveTab("productos")}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulario Editar Material */}
        {activeTab === "editar-material" && editingMaterial && (
          <div className="admin-form-container">
            <h1>Editar Material</h1>

            <form
              className="admin-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveMaterial(editingMaterial);
                setActiveTab("materiales");
              }}
            >
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={editingMaterial.name || ""}
                  onChange={(e) =>
                    setEditingMaterial({
                      ...editingMaterial,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="density">Densidad</label>
                <input
                  id="density"
                  type="number"
                  value={editingMaterial.density || ""}
                  onChange={(e) =>
                    setEditingMaterial({
                      ...editingMaterial,
                      density: parseFloat(e.target.value),
                    })
                  }
                  required
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pricePerKg">Precio por Kg</label>
                <input
                  id="pricePerKg"
                  type="number"
                  value={editingMaterial.pricePerKg || ""}
                  onChange={(e) =>
                    setEditingMaterial({
                      ...editingMaterial,
                      pricePerKg: parseFloat(e.target.value),
                    })
                  }
                  required
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pricePerHourMachine">
                  Precio por hora de máquina
                </label>
                <input
                  id="pricePerHourMachine"
                  type="number"
                  value={editingMaterial.pricePerHourMachine || ""}
                  onChange={(e) =>
                    setEditingMaterial({
                      ...editingMaterial,
                      pricePerHourMachine: parseFloat(e.target.value),
                    })
                  }
                  required
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pricePerHourOperator">
                  Precio por hora de operador
                </label>
                <input
                  id="pricePerHourOperator"
                  type="number"
                  value={editingMaterial.pricePerHourOperator || ""}
                  onChange={(e) =>
                    setEditingMaterial({
                      ...editingMaterial,
                      pricePerHourOperator: parseFloat(e.target.value),
                    })
                  }
                  required
                  step="0.01"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setActiveTab("materiales")}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        )}


        {/* Formulario Nuevo Material */}
        {activeTab === "nuevo-material" && (
          <div className="admin-form-container">
            <h1>Nuevo Material</h1>

            <form
              className="admin-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveMaterial(newMaterial);
                setActiveTab("materiales");
              }}
            >
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={newMaterial.name || ""}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="density">Densidad</label>
                <input
                  id="density"
                  type="number"
                  value={newMaterial.density || ""}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      density: parseFloat(e.target.value),
                    })
                  }
                  required
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pricePerKg">Precio por Kg</label>
                <input
                  id="pricePerKg"
                  type="number"
                  value={newMaterial.pricePerKg || ""}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      pricePerKg: parseFloat(e.target.value),
                    })
                  }
                  required
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pricePerHourMachine">
                  Precio por hora de máquina
                </label>
                <input
                  id="pricePerHourMachine"
                  type="number"
                  value={newMaterial.pricePerHourMachine || ""}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      pricePerHourMachine: parseFloat(e.target.value),
                    })
                  }
                  required
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pricePerHourOperator">
                  Precio por hora de operador
                </label>
                <input
                  id="pricePerHourOperator"
                  type="number"
                  value={newMaterial.pricePerHourOperator || ""}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      pricePerHourOperator: parseFloat(e.target.value),
                    })
                  }
                  required
                  step="0.01"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setActiveTab("materiales")}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Crear Material
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}