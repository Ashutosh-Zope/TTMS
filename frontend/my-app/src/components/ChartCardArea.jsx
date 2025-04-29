import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartCardArea({ title, data }) {
  return (
    <div className="card chart-card" style={{ height: "360px", padding: "10px 15px" }}>
      <h3 className="card-title" style={{ marginBottom: "10px" }}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 25, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="openGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="closedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Area
            type="monotone"
            dataKey="Open"
            stackId="1"
            stroke="#38bdf8"
            fill="url(#openGradient)"
          />
          <Area
            type="monotone"
            dataKey="Closed"
            stackId="1"
            stroke="#34d399"
            fill="url(#closedGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
