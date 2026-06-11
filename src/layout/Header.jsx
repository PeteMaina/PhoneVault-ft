import React from "react";
import { Menu, ShoppingCart, Smartphone } from "lucide-react";

const links = [
  ["/shop", "Phones", "shop"],
  ["/compare", "Compare", "compare"],
  ["/support", "Trust", "support"],
  ["/blog", "Guides", "blog"],
  ["/account", "Account", "account"],
];

export function Header({ cartCount, mobileNavOpen, onCart, onMenu, onNavigate, routeName }) {
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
