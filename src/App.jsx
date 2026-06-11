import React, { useMemo, useState } from "react";
import { products } from "./data.js";
import { CartDrawer } from "./components/cart.jsx";
import { useRoute } from "./hooks/useRoute.js";
import { Header } from "./layout/Header.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { ShopPage } from "./pages/ShopPage.jsx";
import {
  AccountPage,
  BlogPage,
  CartPage,
  CheckoutPage,
  ComparePage,
  LegalPage,
  NotFoundPage,
  SupportPage,
} from "./pages/staticPages.jsx";

function App() {
  const { route, navigate } = useRoute();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [compare, setCompare] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatches = category === "All" || product.category === category;
      const queryMatches =
        !needle ||
        [product.name, product.brand, product.storage, product.condition, product.processor]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return categoryMatches && queryMatches;
    });
  }, [category, query]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSavings = cart.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.qty, 0);

  function go(to) {
    setMobileNavOpen(false);
    navigate(to);
  }

  function addToCart(product) {
    setCart((items) => {
      const found = items.find((item) => item.id === product.id);
      if (found) {
        return items.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...items, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }

  function changeQty(id, delta) {
    setCart((items) =>
      items
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function toggleCompare(product) {
    setCompare((items) => {
      if (items.some((item) => item.id === product.id)) {
        return items.filter((item) => item.id !== product.id);
      }
      return [...items.slice(-2), product];
    });
  }

  function toggleWishlist(id) {
    setWishlist((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  }

  const productActions = {
    addToCart,
    toggleCompare,
    toggleWishlist,
    navigate,
    wishlist,
    compare,
  };

  return (
    <>
      <Header
        cartCount={cartCount}
        mobileNavOpen={mobileNavOpen}
        onCart={() => setCartOpen(true)}
        onMenu={() => setMobileNavOpen((open) => !open)}
        onNavigate={go}
        routeName={route.name}
      />

      <main id="top">
        {route.name === "home" && (
          <HomePage
            query={query}
            category={category}
            filteredProducts={filteredProducts}
            setQuery={setQuery}
            setCategory={setCategory}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            onNavigate={navigate}
            productActions={productActions}
          />
        )}
        {route.name === "shop" && (
          <ShopPage
            query={query}
            category={category}
            filteredProducts={filteredProducts}
            setQuery={setQuery}
            setCategory={setCategory}
            productActions={productActions}
          />
        )}
        {route.name === "product" && (
          <ProductPage product={products.find((item) => item.id === route.id)} productActions={productActions} />
        )}
        {route.name === "compare" && <ComparePage items={compare.length ? compare : products.slice(0, 3)} />}
        {route.name === "cart" && <CartPage items={cart} total={cartTotal} savings={cartSavings} onQty={changeQty} onNavigate={navigate} />}
        {route.name === "checkout" && <CheckoutPage items={cart} total={cartTotal} onNavigate={navigate} />}
        {route.name === "account" && <AccountPage />}
        {route.name === "support" && <SupportPage openFaq={openFaq} setOpenFaq={setOpenFaq} />}
        {route.name === "blog" && <BlogPage />}
        {route.name === "legal" && <LegalPage />}
        {route.name === "not-found" && <NotFoundPage onNavigate={navigate} />}
      </main>

      <CartDrawer
        open={cartOpen}
        items={cart}
        total={cartTotal}
        savings={cartSavings}
        onClose={() => setCartOpen(false)}
        onQty={changeQty}
        onNavigate={(to) => {
          setCartOpen(false);
          navigate(to);
        }}
      />
    </>
  );
}

export default App;
