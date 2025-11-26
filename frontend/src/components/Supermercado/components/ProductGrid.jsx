// client/src/components/Supermercado/components/ProductGrid.jsx
import React from "react";

// Sub-componente interno
const ProductCard = ({ product, isCollected, onClick }) => (
  <div
    className={`product-card p-4 rounded-2xl cursor-pointer text-center flex flex-col items-center justify-center h-full ${
      isCollected ? "collected" : ""
    }`}
    onClick={onClick}
  >
    <div className="text-5xl md:text-6xl lg:text-7xl mb-2">{product.emoji}</div>
    <div className="mt-auto font-bold text-md md:text-lg text-slate-700 leading-tight">
      {product.name}
    </div>
    <div className="text-slate-500 font-semibold bg-gray-100 px-3 py-1 rounded-full mt-2 text-sm shadow-sm">
      ${product.price.toFixed(2)}
    </div>
  </div>
);

const ProductGrid = ({ products, collectedIds, onProductClick }) => (
  // CAMBIO AQUÍ: Agregamos lg:grid-cols-5 y xl:grid-cols-6 para pantallas anchas
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 overflow-y-auto p-2">
    {products.map((p) => (
      <ProductCard
        key={p.id}
        product={p}
        isCollected={collectedIds.includes(p.id)}
        onClick={() => onProductClick(p)}
      />
    ))}
  </div>
);

export default ProductGrid;