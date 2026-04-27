import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function BarChartCard({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-card__title">Daily Expenses</h3>
        <div className="chart-card__empty">No data this month</div>
      </div>
    );
  }

  // Format dates to show just DD
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).getDate().toString().padStart(2, '0'),
  }));

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Daily Expenses</h3>
      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height={280}>
          <RechartsBar data={formatted} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              contentStyle={{
                background: '#272727',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#f1f1f1',
              }}
              formatter={(value) => [`₹${parseFloat(value).toFixed(2)}`, 'Spent']}
              labelFormatter={(label) => `Day ${label}`}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff0000" />
                <stop offset="100%" stopColor="#cc0000" />
              </linearGradient>
            </defs>
            <Bar
              dataKey="total"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
            />
          </RechartsBar>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
