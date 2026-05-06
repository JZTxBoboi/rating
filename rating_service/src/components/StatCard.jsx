export default function StatCard({ label, value, helper, tone = 'default' }) {
  return (
    <section className={`stat-card stat-card--${tone}`}>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {helper ? <p className="stat-card__helper">{helper}</p> : null}
    </section>
  );
}
