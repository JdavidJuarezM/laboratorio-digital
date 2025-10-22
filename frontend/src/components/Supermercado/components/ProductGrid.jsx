// client/src/components/Supermercado/components/ProductGrid.jsx
import React from "react";

// Este es un sub-componente que solo se usará dentro de ProductGrid.
const ProductCard = ({ product, isCollected, onClick }) => (
  <div
    className={`product-card p-4 rounded-2xl cursor-pointer text-center ${
      isCollected ? "collected" : ""
    }`}
    onClick={onClick}
  >
    <div className="text-5xl md:text-6xl">{product.emoji}</div>
    <div className="mt-2 font-bold text-md md:text-lg text-slate-700">
      {product.name}
    </div>
    <div className="text-slate-500 font-semibold bg-gray-100 px-2 py-1 rounded-md inline-block mt-1 text-sm">
      ${product.price.toFixed(2)}
    </div>
  </div>
);

const ProductGrid = ({ products, collectedIds, onProductClick }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
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
