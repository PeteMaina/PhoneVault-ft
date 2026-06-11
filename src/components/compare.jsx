import React from "react";
import { money } from "../utils/format.js";

export function CompareTable({ items }) {
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
