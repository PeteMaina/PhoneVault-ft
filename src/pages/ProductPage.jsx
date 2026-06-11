import React from "react";
import { Check, GitCompare, Heart, ShoppingCart } from "lucide-react";
import { DetailItem } from "../components/ui.jsx";
import { money } from "../utils/format.js";
import { NotFoundPage } from "./staticPages.jsx";

export function ProductPage({ product, productActions }) {
  if (!product) {
    return <NotFoundPage onNavigate={productActions.navigate} />;
  }

  const compared = productActions.compare.some((item) => item.id === product.id);
  const wished = productActions.wishlist.includes(product.id);

  return (
    <section className="section product-detail">
      <div className="product-detail-media">
        <img src={product.image} alt={`${product.name} ${product.color}`} />
      </div>
      <div className="product-detail-copy">
        <span className={`badge inline ${product.category.toLowerCase()}`}>{product.category}</span>
        <h1>{product.name}</h1>
        <p>{product.storage} - {product.color} - {product.condition}</p>
        <div className="detail-price">
          <strong>{money.format(product.price)}</strong>
          <span>{money.format(product.originalPrice)}</span>
          <small>Save {money.format(product.originalPrice - product.price)}</small>
        </div>
        <div className="detail-grid">
          <DetailItem label="Battery" value={product.battery} />
          <DetailItem label="Warranty" value={product.warranty} />
          <DetailItem label="Processor" value={product.processor} />
          <DetailItem label="RAM" value={product.ram} />
          <DetailItem label="Camera" value={product.camera} />
          <DetailItem label="Arrival" value={product.arrival} />
        </div>
        <div className="proof detail-proof">
          <strong>Inspection proof</strong>
          <span>{product.source}</span>
          <ul>
            {product.inspection.map((item) => (
              <li key={item}><Check size={14} /> {item}</li>
            ))}
          </ul>
        </div>
        <div className="hero-actions">
          <button className="btn primary" type="button" onClick={() => productActions.addToCart(product)}>
            <ShoppingCart size={18} /> Add to cart
          </button>
          <button className={compared ? "btn ghost active" : "btn ghost"} type="button" onClick={() => productActions.toggleCompare(product)}>
            <GitCompare size={18} /> Compare
          </button>
          <button className={wished ? "btn ghost active" : "btn ghost"} type="button" onClick={() => productActions.toggleWishlist(product.id)}>
            <Heart size={18} /> Wishlist
          </button>
        </div>
      </div>
    </section>
  );
}
