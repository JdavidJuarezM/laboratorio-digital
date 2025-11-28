import React from "react";

const ProductCard = ({ product, isCollected, onClick }) => (
  <div
    className={`p-4 rounded-xl cursor-pointer text-center border-2 transition-all duration-200 bg-white
      ${isCollected 
        ? "opacity-40 border-gray-200 bg-gray-50 scale-95 grayscale" 
        : "border-blue-100 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1"
      }`}
    onClick={onClick}
  >
    <div className="text-5xl mb-2">{product.emoji}</div>
    <div className="font-bold text-slate-700 text-sm leading-tight h-10 flex items-center justify-center">
      {product.name}
    </div>
    <div className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md inline-block mt-2 text-sm">
      ${product.price.toFixed(2)}
    </div>
  </div>
);

const ProductGrid = ({ products, collectedIds, onProductClick }) => {
  // Agrupar productos por categoría
  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.categoria || "Varios";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  return (
    <div className="space-y-8 pb-8">
      {Object.entries(groupedProducts).map(([category, items]) => (
        <div key={category} className="bg-white/50 p-4 rounded-2xl border border-gray-100">
          <h3 className="text-xl font-bold text-slate-600 mb-4 px-2 border-l-4 border-blue-400">
            {category}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {items.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isCollected={collectedIds.includes(p.id)}
                onClick={() => onProductClick(p)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;