import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const chartColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#0f172a'];

export function ChartCard({ title, subtitle, children }) {
  return (
    <section className="chart-card">
      <div className="chart-card__header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="chart-card__body">{children}</div>
    </section>
  );
}

export function AverageRatingChart({ data }) {
  return (
    <ChartCard title="Average Rating by Technician" subtitle="Higher score means stronger service quality.">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={70} />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Bar dataKey="average" name="Average Rating" radius={[10, 10, 0, 0]} fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RatingCountChart({ data }) {
  return (
    <ChartCard title="Number of Ratings by Technician" subtitle="Shows sample size for each technician.">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={70} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" name="Ratings" radius={[10, 10, 0, 0]} fill="#14b8a6" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DistributionChart({ data }) {
  return (
    <ChartCard title="Rating Distribution" subtitle="Distribution of scores from 1 to 5.">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={56}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
