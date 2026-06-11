import React, { useMemo, useState } from "react";
import {
  BadgeCheck,
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
  Star,
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

function App() {
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

  return (
    <>
      <header className="nav">
        <a className="brand" href="#top" aria-label="PhoneVault home">
          <span className="brand-mark">
            <Smartphone size={24} />
          </span>
          <span>PhoneVault</span>
        </a>
        <nav className={mobileNavOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
          <a href="#phones" onClick={() => setMobileNavOpen(false)}>Phones</a>
          <a href="#compare" onClick={() => setMobileNavOpen(false)}>Compare</a>
          <a href="#trust" onClick={() => setMobileNavOpen(false)}>Trust</a>
          <a href="#process" onClick={() => setMobileNavOpen(false)}>Process</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" type="button" onClick={() => setCartOpen(true)} aria-label="Open cart">
            <ShoppingCart size={21} />
            {cartCount > 0 && <span className="count">{cartCount}</span>}
          </button>
          <button className="icon-btn mobile-menu" type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={16} /> Premium phones with visible proof</span>
            <h1>Buy the phone you want with the clarity you wish every store had.</h1>
            <p>
              PhoneVault turns new, used, refurbished, and imported devices into a transparent shopping experience:
              inspection notes, warranty facts, battery health, sourcing context, and real savings shown before the sale.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href="#phones">Shop phones</a>
              <a className="btn ghost" href="#trust">See proof</a>
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
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished={wishlist.includes(product.id)}
                compared={compare.some((item) => item.id === product.id)}
                onAdd={() => addToCart(product)}
                onCompare={() => toggleCompare(product)}
                onWish={() => toggleWishlist(product.id)}
              />
            ))}
          </div>
        </section>

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

        <section className="section" id="compare">
          <SectionHeader
            kicker="Decision engine"
            title="Compare the shortlist without leaving the shelf."
            text="Add up to three phones from the cards above. This becomes a full comparison and recommendation module in production."
          />
          <CompareTable items={compare.length ? compare : products.slice(0, 3)} />
        </section>

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

        <section className="section split">
          <div>
            <span className="eyebrow">Buyer guidance</span>
            <h2>Answer objections in the interface itself.</h2>
            <p>
              The best sales experience here is not just louder copy. It is a product page that quietly answers:
              Is it real? Why this price? What if it fails? When will it arrive? What do I lose by waiting?
            </p>
          </div>
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
        </section>
      </main>

      <CartDrawer
        open={cartOpen}
        items={cart}
        total={cartTotal}
        savings={cartSavings}
        onClose={() => setCartOpen(false)}
        onQty={changeQty}
      />
    </>
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

function ProductCard({ product, wished, compared, onAdd, onCompare, onWish }) {
  const urgency = product.stock <= 6 ? "low" : "ok";
  return (
    <article className="product-card">
      <div className="product-media">
        <img src={product.image} alt={`${product.name} ${product.color}`} />
        <span className={`badge ${product.category.toLowerCase()}`}>{product.category}</span>
        <div className="product-tools">
          <button className={wished ? "round active" : "round"} onClick={onWish} type="button" aria-label="Add to wishlist">
            <Heart size={18} />
          </button>
          <button className={compared ? "round active" : "round"} onClick={onCompare} type="button" aria-label="Compare phone">
            <GitCompare size={18} />
          </button>
        </div>
      </div>
      <div className="product-body">
        <div className="product-title">
          <div>
            <h3>{product.name}</h3>
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
      <div className="trust-icon">{icon}</div>
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

function CartDrawer({ open, items, total, savings, onClose, onQty }) {
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
                <article className="cart-item" key={item.id}>
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
              ))}
            </div>
            <div className="summary">
              <p><span>Verified savings</span><strong>{money.format(savings)}</strong></p>
              <p><span>Insured shipping</span><strong>Free</strong></p>
              <p className="total"><span>Total</span><strong>{money.format(total)}</strong></p>
            </div>
            <button className="btn primary full" type="button">Request secure checkout</button>
          </>
        )}
      </div>
    </aside>
  );
}

export default App;
