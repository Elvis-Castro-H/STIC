import '../../styles/productsList.css'
import { FiSearch, FiRefreshCw } from 'react-icons/fi'
import ProductCard from '../UI/ProductCard'
import { Product } from '@/app/types/Products';
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/app/services/ProductService';

  

export default function ProductsPage() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const result = await fetchProducts();
      setProducts(result);
    };
    loadProducts();
  }, []);

  const separadores = products.filter(p => p.categoryId === 1);
  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Productos</h1>
        <div className="filters-actions">
          <div className="filters">
            <select className="filter-select">
              <option>Selecciona el año</option>
            </select>
            <select className="filter-select">
              <option>Selecciona el modelo</option>
            </select>
            <select className="filter-select">
              <option>Selecciona la marca</option>
            </select>
          </div>

          <div className="icons">
            <button className="icon-button" title="Buscar">
              <FiSearch size={24} />
            </button>
            <button className="icon-button" title="Reiniciar filtros">
              <FiRefreshCw size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="products-grid">
        {separadores.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  )
}
