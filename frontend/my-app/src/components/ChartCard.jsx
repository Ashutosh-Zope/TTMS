import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartCard({ title, data, colors }) {
  return (
    <div className="card chart-card">
      <h3 className="card-title">{title}</h3>
      <ResponsiveContainer width={300} height={250}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={50}
      outerRadius={80}   
      fill="#8884d8"
      paddingAngle={5}
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend verticalAlign="bottom" height={36}/>
  </PieChart>
</ResponsiveContainer>

    </div>
  );
}
