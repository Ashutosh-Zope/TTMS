import React from "react";

export default function StatCard({ title, value, onClick }) {
  return (
    <div className="card stat-card" onClick={onClick}>
      <h3 className="card-title" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {title}
      </h3>
      <p className="card-value">{value}</p>
    </div>
  );
}
