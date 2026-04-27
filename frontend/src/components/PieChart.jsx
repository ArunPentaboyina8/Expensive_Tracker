import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#ff0000', '#3ea6ff', '#2ba640', '#f59e0b', '#ff4e45', '#909090', '#aaaaaa', '#065fd4'];

export default function PieChartCard({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-card__title">Category Breakdown</h3>
        <div className="chart-card__empty">No data this month</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Category Breakdown</h3>
      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height={280}>
          <RechartsPie>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={55}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#272727',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#f1f1f1',
              }}
              formatter={(value) => [`₹${parseFloat(value).toFixed(2)}`, 'Amount']}
            />
            <Legend
              wrapperStyle={{ color: '#94a3b8', fontSize: '13px' }}
            />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
