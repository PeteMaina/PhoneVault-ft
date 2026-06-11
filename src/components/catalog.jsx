import React from "react";
import { BatteryCharging, Check, Cpu, GitCompare, Heart, Search, ShieldCheck, ShoppingCart } from "lucide-react";
import { categories } from "../data.js";
import { money } from "../utils/format.js";
import { SectionHeader } from "./ui.jsx";

export function CatalogSection({
  query,
  category,
  productsToShow,
  setQuery,
  setCategory,
  productActions,
  controls,
  emptyTitle = "No phones matched your filters.",
  emptyText = "Try widening your budget, changing the condition, or clearing one filter.",
  resultLabel,
  viewMode = "grid",
}) {
  return (
    <>
      <section className="search-band" aria-label="Product search">
        <div className="search-box">
          <Search size={22} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search iPhone, Samsung, storage, condition, processor..."
          />
        </div>
        <div className="quick-filters">
          {categories.map((item) => (
            <button className={category === item ? "chip active" : "chip"} key={item} onClick={() => setCategory(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="section" id="phones">
        <SectionHeader
          kicker="Live inventory"
          title="Every listing sells the phone and explains the deal."
          text="Fast filters, honest conditions, visible warranty, stock urgency, and inspection receipts make each product card work harder."
        />
        {controls}
        {resultLabel && <p className="result-label">{resultLabel}</p>}
        {productsToShow.length > 0 ? (
          <div className={viewMode === "list" ? "product-grid list-view" : "product-grid"}>
            {productsToShow.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                wished={productActions.wishlist.includes(product.id)}
                compared={productActions.compare.some((item) => item.id === product.id)}
                onAdd={() => productActions.addToCart(product)}
                onCompare={() => productActions.toggleCompare(product)}
                onWish={() => productActions.toggleWishlist(product.id)}
                onOpen={() => productActions.navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h3>{emptyTitle}</h3>
            <p>{emptyText}</p>
          </div>
        )}
      </section>
    </>
  );
}

export function ProductCard({ product, viewMode = "grid", wished, compared, onAdd, onCompare, onWish, onOpen }) {
  const urgency = product.stock <= 6 ? "low" : "ok";
  return (
    <article className={viewMode === "list" ? "product-card list-card" : "product-card"}>
      <button className="product-media product-link" type="button" onClick={onOpen}>
        <img src={product.image} alt={`${product.name} ${product.color}`} />
        <span className={`badge ${product.category.toLowerCase()}`}>{product.category}</span>
      </button>
      <div className="product-tools">
        <button className={wished ? "round active" : "round"} onClick={onWish} type="button" aria-label="Add to wishlist">
          <Heart size={18} />
        </button>
        <button className={compared ? "round active" : "round"} onClick={onCompare} type="button" aria-label="Compare phone">
          <GitCompare size={18} />
        </button>
      </div>
      <div className="product-body">
        <div className="product-title">
          <div>
            <button className="text-link" type="button" onClick={onOpen}>
              <h3>{product.name}</h3>
            </button>
            <p>{product.storage} - {product.color}</p>
          </div>
          <span className={`stock ${urgency}`}>{product.stock} left</span>
        </div>
        <div className="spec-row">
          <span><Cpu size={14} /> {product.processor}</span>
          <span><BatteryCharging size={14} /> {product.battery}</span>
          <span><ShieldCheck size={14} /> {product.warranty}</span>
        </div>
        <div className="proof">
          <strong>{product.condition}</strong>
          <span>{product.source}</span>
          <ul>
            {product.inspection.slice(0, 3).map((item) => (
              <li key={item}><Check size={14} /> {item}</li>
            ))}
          </ul>
        </div>
        <div className="price-row">
          <div>
            <strong>{money.format(product.price)}</strong>
            <span>{money.format(product.originalPrice)}</span>
          </div>
          <small>Save {money.format(product.originalPrice - product.price)}</small>
        </div>
        <button className="btn primary full" onClick={onAdd} type="button">
          <ShoppingCart size={18} /> Add to cart
        </button>
      </div>
    </article>
  );
}
