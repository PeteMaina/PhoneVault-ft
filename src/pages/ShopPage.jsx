import { CatalogSection } from "../components/catalog.jsx";
import { PageHero } from "../components/ui.jsx";

export function ShopPage({ query, category, filteredProducts, setQuery, setCategory, productActions }) {
  return (
    <>
      <PageHero
        kicker="Shop"
        title="Browse transparent phone deals built for Kenyan buyers."
        text="Search, filter, compare, and open product pages with pricing, condition, battery, source, warranty, and delivery context."
      />
      <CatalogSection
        query={query}
        category={category}
        productsToShow={filteredProducts}
        setQuery={setQuery}
        setCategory={setCategory}
        productActions={productActions}
      />
    </>
  );
}
