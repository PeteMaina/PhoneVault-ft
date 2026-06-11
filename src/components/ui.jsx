import React from "react";

export function Metric({ value, label }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export function SectionHeader({ kicker, title, text }) {
  return (
    <div className="section-header">
      <span className="eyebrow">{kicker}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export function PageHero({ kicker, title, text }) {
  return (
    <section className="page-hero">
      <span className="eyebrow">{kicker}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

export function PageShell({ kicker, title, text }) {
  return (
    <section className="section page-section">
      <SectionHeader kicker={kicker} title={title} text={text} />
    </section>
  );
}

export function PlaceholderCard({ title, text }) {
  return (
    <article className="trust-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
