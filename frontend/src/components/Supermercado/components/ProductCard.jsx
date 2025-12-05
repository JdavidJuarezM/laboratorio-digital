import React from "react";

const ProductCard = ({product, isCollected, onClick}) => (
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

export default ProductCard;
