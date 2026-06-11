import React from "react";
import { Sparkles } from "lucide-react";
import { products } from "../data.js";
import { CatalogSection } from "../components/catalog.jsx";
import { FaqSection, ProcessSection, TrustSection } from "../components/sections.jsx";
import { Metric } from "../components/ui.jsx";
import { money } from "../utils/format.js";

export function HomePage({
  query,
  category,
  filteredProducts,
  setQuery,
  setCategory,
  openFaq,
  setOpenFaq,
  onNavigate,
  productActions,
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={16} /> Premium phones with visible proof</span>
          <h1>Buy the phone you want with the clarity you wish every store had.</h1>
          <p>
            PhoneVault turns new, used, refurbished, and imported devices into a transparent shopping experience:
            inspection notes, warranty facts, battery health, sourcing context, and real savings shown before the sale.
          </p>
          <div className="hero-actions">
            <button className="btn primary" type="button" onClick={() => onNavigate("/shop")}>Shop phones</button>
            <button className="btn ghost" type="button" onClick={() => onNavigate("/support")}>See proof</button>
          </div>
          <div className="metrics" aria-label="Store metrics">
            <Metric value="98.5%" label="buyer satisfaction" />
            <Metric value="30 pt" label="inspection report" />
            <Metric value="KSh 18k" label="avg. saved per order" />
          </div>
        </div>
        <div className="hero-stage" aria-label="Featured phones">
          {products.slice(0, 3).map((product, index) => (
            <article className={`hero-phone hero-phone-${index + 1}`} key={product.id}>
              <img src={product.image} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <span>{money.format(product.price)} - {product.condition}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CatalogSection
        query={query}
        category={category}
        productsToShow={filteredProducts.slice(0, 6)}
        setQuery={setQuery}
        setCategory={setCategory}
        productActions={productActions}
      />

      <TrustSection />
      <ProcessSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
    </>
  );
}
