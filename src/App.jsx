import React, { useEffect, useMemo, useState } from "react";
import {
  BatteryCharging,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Cpu,
  GitCompare,
  Heart,
  Menu,
  Minus,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { categories, faqs, products } from "./data.js";

const money = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function parseRoute(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/") return { name: "home" };
  if (clean === "/shop") return { name: "shop" };
  if (clean === "/compare") return { name: "compare" };
  if (clean === "/cart") return { name: "cart" };
  if (clean === "/checkout") return { name: "checkout" };
  if (clean === "/account") return { name: "account" };
  if (clean === "/support") return { name: "support" };
  if (clean === "/blog") return { name: "blog" };
  if (clean === "/legal") return { name: "legal" };
  if (clean.startsWith("/product/")) return { name: "product", id: clean.split("/").pop() };
  return { name: "not-found" };
}

function useRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(to) {
    if (window.location.pathname !== to) {
      window.history.pushState({}, "", to);
      setRoute(parseRoute(to));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return { route, navigate };
}

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

function Header({ cartCount, mobileNavOpen, onCart, onMenu, onNavigate, routeName }) {
  const links = [
    ["/shop", "Phones", "shop"],
    ["/compare", "Compare", "compare"],
    ["/support", "Trust", "support"],
    ["/blog", "Guides", "blog"],
    ["/account", "Account", "account"],
  ];

  return (
    <header className="nav">
      <button className="brand nav-brand-btn" type="button" onClick={() => onNavigate("/")} aria-label="PhoneVault home">
        <span className="brand-mark">
          <Smartphone size={24} />
        </span>
        <span>PhoneVault</span>
      </button>
      <nav className={mobileNavOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
        {links.map(([to, label, name]) => (
          <button className={routeName === name ? "active" : ""} key={to} type="button" onClick={() => onNavigate(to)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="nav-actions">
        <button className="icon-btn" type="button" onClick={onCart} aria-label="Open cart">
          <ShoppingCart size={21} />
          {cartCount > 0 && <span className="count">{cartCount}</span>}
        </button>
        <button className="icon-btn mobile-menu" type="button" onClick={onMenu} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}

function HomePage({
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
                <span>{money.format(product.price)} · {product.condition}</span>
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

function ShopPage({ query, category, filteredProducts, setQuery, setCategory, productActions }) {
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

function ProductPage({ product, productActions }) {
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
        <p>{product.storage} · {product.color} · {product.condition}</p>
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

function CatalogSection({ query, category, productsToShow, setQuery, setCategory, productActions }) {
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
        <div className="product-grid">
          {productsToShow.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wished={productActions.wishlist.includes(product.id)}
              compared={productActions.compare.some((item) => item.id === product.id)}
              onAdd={() => productActions.addToCart(product)}
              onCompare={() => productActions.toggleCompare(product)}
              onWish={() => productActions.toggleWishlist(product.id)}
              onOpen={() => productActions.navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function TrustSection() {
  return (
    <section className="section muted" id="trust">
      <SectionHeader
        kicker="Trust architecture"
        title="A store that removes the buyer's doubt before they ask."
        text="Transparency is a sales tactic when it is useful: buyers understand why the price is fair and what risk is covered."
      />
      <div className="trust-grid">
        <TrustCard icon={<ClipboardCheck />} title="Inspection receipt" text="Each unit lists the checks that mattered: battery, display, locks, carrier state, ports, accessories, and serial status." />
        <TrustCard icon={<CircleDollarSign />} title="Price breakdown" text="Original price, sale price, savings, warranty term, and import context stay visible instead of hiding inside checkout." />
        <TrustCard icon={<ShieldCheck />} title="Risk reversal" text="Warranty, return window, insured shipping, and support expectations are stated close to the buying decision." />
        <TrustCard icon={<Truck />} title="Clear fulfillment" text="Stock count and arrival promises are plain, so urgency feels factual instead of theatrical." />
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="section dark" id="process">
      <SectionHeader
        kicker="How it works"
        title="From marketplace sourcing to your pocket."
        text="The app should make the store feel premium, but the operations should feel accountable."
      />
      <div className="process-grid">
        <ProcessStep number="01" title="Source" text="Verified sellers, trade-ins, distributors, and import partners feed the inventory pipeline." />
        <ProcessStep number="02" title="Certify" text="Every phone receives functional, cosmetic, network, battery, and authenticity checks." />
        <ProcessStep number="03" title="Disclose" text="Condition, battery health, warranty, accessories, origin, and savings are displayed upfront." />
        <ProcessStep number="04" title="Support" text="Insured delivery, returns, warranty handling, trade-in credit, and live help complete the loop." />
      </div>
    </section>
  );
}

function FaqSection({ openFaq, setOpenFaq }) {
  return (
    <section className="section split">
      <div>
        <span className="eyebrow">Buyer guidance</span>
        <h2>Answer objections in the interface itself.</h2>
        <p>
          The best sales experience here is not just louder copy. It is a product page that quietly answers:
          Is it real? Why this price? What if it fails? When will it arrive? What do I lose by waiting?
        </p>
      </div>
      <FaqList openFaq={openFaq} setOpenFaq={setOpenFaq} />
    </section>
  );
}

function ComparePage({ items }) {
  return (
    <section className="section page-section">
      <SectionHeader
        kicker="Compare"
        title="Compare the shortlist without leaving the shelf."
        text="A dedicated route now holds the comparison surface. Next pass can add shareable compare URLs and recommendation scoring."
      />
      <CompareTable items={items} />
    </section>
  );
}

function CartPage({ items, total, savings, onQty, onNavigate }) {
  return (
    <section className="section page-section">
      <SectionHeader
        kicker="Cart"
        title="Your transparent quote."
        text="This full cart route mirrors the drawer and prepares the future checkout handoff."
      />
      <CartContents items={items} total={total} savings={savings} onQty={onQty} onNavigate={onNavigate} />
    </section>
  );
}

function CheckoutPage({ items, total, onNavigate }) {
  return (
    <section className="section page-section">
      <SectionHeader
        kicker="Checkout"
        title="Secure checkout flow."
        text="This route is ready for customer details, delivery choices, M-Pesa, card, deposit, and order review UI."
      />
      <div className="placeholder-grid">
        <PlaceholderCard title="Customer details" text="Name, phone, email, county, town, and delivery notes." />
        <PlaceholderCard title="Payment" text="M-Pesa, card, cash on delivery, bank transfer, or deposit options." />
        <PlaceholderCard title="Order review" text={`${items.length} item(s), total ${money.format(total)}.`} />
      </div>
      <button className="btn ghost" type="button" onClick={() => onNavigate("/shop")}>Continue shopping</button>
    </section>
  );
}

function AccountPage() {
  return (
    <PageShell
      kicker="Account"
      title="Buyer account routes are ready."
      text="Next pass: profile, addresses, orders, wishlist, support tickets, and notification settings."
    />
  );
}

function SupportPage({ openFaq, setOpenFaq }) {
  return (
    <>
      <PageHero
        kicker="Trust and support"
        title="Proof, warranty, delivery, and buying help in one place."
        text="This route will become the buyer confidence hub: warranty terms, inspection process, delivery promises, returns, and FAQs."
      />
      <TrustSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
    </>
  );
}

function BlogPage() {
  return (
    <section className="section page-section">
      <SectionHeader
        kicker="Guides"
        title="Buying guides and phone education."
        text="A routed blog hub for comparison articles, refurbished buying advice, condition grades, and trade-in tips."
      />
      <div className="placeholder-grid">
        <PlaceholderCard title="Best iPhones in Kenya" text="Budget, camera, battery, and warranty picks." />
        <PlaceholderCard title="Refurbished buying guide" text="What Grade A, battery health, and clean IMEI really mean." />
        <PlaceholderCard title="Imported phones explained" text="Bands, warranty, duty, accessories, and delivery expectations." />
      </div>
    </section>
  );
}

function LegalPage() {
  return (
    <PageShell
      kicker="Legal"
      title="Policies and buyer protection."
      text="Placeholder route for privacy, terms, cookie policy, warranty policy, return policy, and import disclosures."
    />
  );
}

function NotFoundPage({ onNavigate }) {
  return (
    <section className="section page-section">
      <SectionHeader
        kicker="404"
        title="That page is not in the vault yet."
        text="The route does not exist, but the app shell is working."
      />
      <button className="btn primary" type="button" onClick={() => onNavigate("/")}>Go home</button>
    </section>
  );
}

function PageHero({ kicker, title, text }) {
  return (
    <section className="page-hero">
      <span className="eyebrow">{kicker}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function PageShell({ kicker, title, text }) {
  return (
    <section className="section page-section">
      <SectionHeader kicker={kicker} title={title} text={text} />
    </section>
  );
}

function PlaceholderCard({ title, text }) {
  return (
    <article className="trust-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Metric({ value, label }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SectionHeader({ kicker, title, text }) {
  return (
    <div className="section-header">
      <span className="eyebrow">{kicker}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function ProductCard({ product, wished, compared, onAdd, onCompare, onWish, onOpen }) {
  const urgency = product.stock <= 6 ? "low" : "ok";
  return (
    <article className="product-card">
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
            <p>{product.storage} · {product.color}</p>
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

function TrustCard({ icon, title, text }) {
  return (
    <article className="trust-card">
      {icon && <div className="trust-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function CompareTable({ items }) {
  const rows = [
    ["Price", (item) => money.format(item.price)],
    ["Condition", (item) => item.condition],
    ["Battery", (item) => item.battery],
    ["Warranty", (item) => item.warranty],
    ["Source", (item) => item.source],
    ["Arrival", (item) => item.arrival],
  ];

  return (
    <div className="compare-table">
      <div className="compare-head" style={{ gridTemplateColumns: `180px repeat(${items.length}, minmax(180px, 1fr))` }}>
        <span>Feature</span>
        {items.map((item) => <strong key={item.id}>{item.name}</strong>)}
      </div>
      {rows.map(([label, getter]) => (
        <div className="compare-row" style={{ gridTemplateColumns: `180px repeat(${items.length}, minmax(180px, 1fr))` }} key={label}>
          <span>{label}</span>
          {items.map((item) => <p key={item.id}>{getter(item)}</p>)}
        </div>
      ))}
    </div>
  );
}

function ProcessStep({ number, title, text }) {
  return (
    <article className="process-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function FaqList({ openFaq, setOpenFaq }) {
  return (
    <div className="faq-list">
      {faqs.map(([question, answer], index) => (
        <div className="faq-item" key={question}>
          <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
            {question}
            <ChevronDown className={openFaq === index ? "rotate" : ""} size={20} />
          </button>
          {openFaq === index && <p>{answer}</p>}
        </div>
      ))}
    </div>
  );
}

function CartContents({ items, total, savings, onQty, onNavigate }) {
  if (items.length === 0) {
    return (
      <div className="empty-cart page-empty">
        <PackageCheck size={42} />
        <p>Your cart is empty. Add phones to build an instant transparent quote.</p>
        <button className="btn primary" type="button" onClick={() => onNavigate("/shop")}>Shop phones</button>
      </div>
    );
  }

  return (
    <div className="cart-route-grid">
      <div className="cart-items">
        {items.map((item) => (
          <CartItem item={item} key={item.id} onQty={onQty} />
        ))}
      </div>
      <div className="summary">
        <p><span>Verified savings</span><strong>{money.format(savings)}</strong></p>
        <p><span>Insured shipping</span><strong>Free</strong></p>
        <p className="total"><span>Total</span><strong>{money.format(total)}</strong></p>
        <button className="btn primary full" type="button" onClick={() => onNavigate("/checkout")}>Continue to checkout</button>
      </div>
    </div>
  );
}

function CartItem({ item, onQty }) {
  return (
    <article className="cart-item">
      <img src={item.image} alt={item.name} />
      <div>
        <strong>{item.name}</strong>
        <span>{item.condition} · {item.warranty}</span>
        <div className="qty">
          <button onClick={() => onQty(item.id, -1)} type="button"><Minus size={15} /></button>
          <span>{item.qty}</span>
          <button onClick={() => onQty(item.id, 1)} type="button"><Zap size={15} /></button>
        </div>
      </div>
      <b>{money.format(item.price * item.qty)}</b>
    </article>
  );
}

function CartDrawer({ open, items, total, savings, onClose, onQty, onNavigate }) {
  return (
    <aside className={open ? "cart-drawer open" : "cart-drawer"} aria-hidden={!open}>
      <div className="cart-panel">
        <div className="cart-header">
          <div>
            <span className="eyebrow">Your quote</span>
            <h2>Cart</h2>
          </div>
          <button className="icon-btn" onClick={onClose} type="button" aria-label="Close cart">
            <X size={22} />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="empty-cart">
            <PackageCheck size={42} />
            <p>Your cart is empty. Add phones to build an instant transparent quote.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <CartItem item={item} key={item.id} onQty={onQty} />
              ))}
            </div>
            <div className="summary">
              <p><span>Verified savings</span><strong>{money.format(savings)}</strong></p>
              <p><span>Insured shipping</span><strong>Free</strong></p>
              <p className="total"><span>Total</span><strong>{money.format(total)}</strong></p>
            </div>
            <button className="btn primary full" type="button" onClick={() => onNavigate("/cart")}>View cart</button>
          </>
        )}
      </div>
    </aside>
  );
}

export default App;
