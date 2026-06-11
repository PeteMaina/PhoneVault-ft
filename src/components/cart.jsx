import React from "react";
import { Minus, PackageCheck, X, Zap } from "lucide-react";
import { money } from "../utils/format.js";

export function CartContents({ items, total, savings, onQty, onNavigate }) {
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

export function CartItem({ item, onQty }) {
  return (
    <article className="cart-item">
      <img src={item.image} alt={item.name} />
      <div>
        <strong>{item.name}</strong>
        <span>{item.condition} - {item.warranty}</span>
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

export function CartDrawer({ open, items, total, savings, onClose, onQty, onNavigate }) {
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
