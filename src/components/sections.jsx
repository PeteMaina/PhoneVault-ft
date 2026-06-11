import React from "react";
import { ChevronDown, CircleDollarSign, ClipboardCheck, ShieldCheck, Truck } from "lucide-react";
import { faqs } from "../data.js";
import { SectionHeader } from "./ui.jsx";

export function TrustSection() {
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

export function ProcessSection() {
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

export function FaqSection({ openFaq, setOpenFaq }) {
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

export function TrustCard({ icon, title, text }) {
  return (
    <article className="trust-card">
      {icon && <div className="trust-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function ProcessStep({ number, title, text }) {
  return (
    <article className="process-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function FaqList({ openFaq, setOpenFaq }) {
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
