import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const RankingChart = ({ ranking }) => {
  if (!ranking || ranking.length === 0) return null;

  const totalImportance = ranking.reduce(
    (sum, item) => sum + Number(item.importance || 0),
    0
  );

  const formatPercent = (value) =>
    `${value.toFixed(1).toString().replace('.', ',')}%`;

  const top10 = [...ranking]
    .sort((a, b) => Number(b.importance) - Number(a.importance))
    .slice(0, 10)
    .map((item) => {
      const value = Number(item.importance || 0);
      const percent = totalImportance ? (value / totalImportance) * 100 : 0;
      return {
        name: item.feature,
        percent,
      };
    });

  return (
    <div className="machine-chart-card">
      <div className="machine-chart-header">
        <h3>Top 10 variáveis que mais impactam</h3>
        <span className="machine-count">
          {top10.length} variável
          {top10.length !== 1 && 'is'}
        </span>
      </div>

      <div className="machine-chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={top10}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 10, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={{ stroke: '#1f2937' }}
              tickFormatter={formatPercent}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={130}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={{ stroke: '#1f2937' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                border: '1px solid #1f2937',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [formatPercent(value), 'Importância']}
              labelFormatter={(label) => `Variável: ${label}`}
            />
            <Bar
              dataKey="percent"
              radius={[4, 4, 4, 4]}
              fill="#22c55e"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RankingChart;
