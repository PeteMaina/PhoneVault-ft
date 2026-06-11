import React from "react";
import { CartContents } from "../components/cart.jsx";
import { CompareTable } from "../components/compare.jsx";
import { FaqSection, TrustSection } from "../components/sections.jsx";
import { PageHero, PageShell, PlaceholderCard, SectionHeader } from "../components/ui.jsx";
import { money } from "../utils/format.js";

export function ComparePage({ items }) {
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

export function CartPage({ items, total, savings, onQty, onNavigate }) {
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

export function CheckoutPage({ items, total, onNavigate }) {
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

export function AccountPage() {
  return (
    <PageShell
      kicker="Account"
      title="Buyer account routes are ready."
      text="Next pass: profile, addresses, orders, wishlist, support tickets, and notification settings."
    />
  );
}

export function SupportPage({ openFaq, setOpenFaq }) {
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

export function BlogPage() {
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

export function LegalPage() {
  return (
    <PageShell
      kicker="Legal"
      title="Policies and buyer protection."
      text="Placeholder route for privacy, terms, cookie policy, warranty policy, return policy, and import disclosures."
    />
  );
}

export function NotFoundPage({ onNavigate }) {
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
