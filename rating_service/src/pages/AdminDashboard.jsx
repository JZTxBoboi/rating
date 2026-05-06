import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { technicians } from '../data/technicians';
import { fetchRatings } from '../services/googleSheetService';
import StatCard from '../components/StatCard';
import {
  AverageRatingChart,
  DistributionChart,
  RatingCountChart,
} from '../components/AdminChart';
import { average, formatRating, roundToOne } from '../utils/ratingHelpers';

function normalizeRecord(record, index) {
  const ratingValue = Number(record.ratingValue || record['Rating Value'] || 0);
  return {
    id: `${record.timestamp || record.Timestamp || index}-${index}`,
    timestamp: record.timestamp || record.Timestamp || '',
    technicianId: record.technicianId || record['Technician ID'] || '',
    technicianName: record.technicianName || record['Technician Name'] || '',
    ratingValue,
    ratingLabel: record.ratingLabel || record['Rating Label'] || formatRating(ratingValue).label,
    emojiSelected: record.emojiSelected || record['Emoji Selected'] || formatRating(ratingValue).emoji,
    deviceType: record.deviceType || record['Device Type'] || 'unknown',
    userAgent: record.userAgent || record['User Agent'] || '',
  };
}

function isWithinDateRange(record, startDate, endDate) {
  if (!startDate && !endDate) return true;
  if (!record.timestamp) return false;

  const recordTime = new Date(record.timestamp).getTime();
  if (Number.isNaN(recordTime)) return false;

  if (startDate) {
    const start = new Date(`${startDate}T00:00:00`).getTime();
    if (recordTime < start) return false;
  }

  if (endDate) {
    const end = new Date(`${endDate}T23:59:59`).getTime();
    if (recordTime > end) return false;
  }

  return true;
}

function getTechnicianStats(records) {
  return technicians.map((technician) => {
    const technicianRecords = records.filter((record) => record.technicianId === technician.id);
    const averageRating = average(technicianRecords.map((record) => record.ratingValue));

    return {
      ...technician,
      count: technicianRecords.length,
      average: roundToOne(averageRating),
      distribution: [1, 2, 3, 4, 5].map((value) => ({
        value,
        count: technicianRecords.filter((record) => record.ratingValue === value).length,
      })),
    };
  });
}

function getBestAndLowest(stats) {
  const rated = stats.filter((item) => item.count > 0);
  if (!rated.length) return { best: null, lowest: null };

  const sorted = [...rated].sort((a, b) => {
    if (b.average !== a.average) return b.average - a.average;
    return b.count - a.count;
  });

  return {
    best: sorted[0],
    lowest: sorted[sorted.length - 1],
  };
}

function formatDate(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return new Intl.DateTimeFormat('en-MY', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function AdminDashboard({ onLogout }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [technicianFilter, setTechnicianFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  async function loadRecords() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchRatings();
      setRecords(data.map(normalizeRecord));
    } catch (dashboardError) {
      console.error(dashboardError);
      setError('Google Sheet data cannot be loaded. Check your Apps Script URL, deployment access, and sheet permissions.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const technicianMatches = technicianFilter === 'all' || record.technicianId === technicianFilter;
      return technicianMatches && isWithinDateRange(record, startDate, endDate);
    });
  }, [records, technicianFilter, startDate, endDate]);

  const technicianStats = useMemo(() => getTechnicianStats(filteredRecords), [filteredRecords]);
  const { best, lowest } = useMemo(() => getBestAndLowest(technicianStats), [technicianStats]);

  const totalRatings = filteredRecords.length;
  const overallAverage = roundToOne(average(filteredRecords.map((record) => record.ratingValue)));

  const distributionData = [1, 2, 3, 4, 5].map((value) => {
    const rating = formatRating(value);
    return {
      label: `${value} - ${rating.label}`,
      count: filteredRecords.filter((record) => record.ratingValue === value).length,
    };
  });

  const latestRecords = [...filteredRecords]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 12);

  function handleLogout() {
    sessionStorage.removeItem('adminAuthenticated');
    onLogout();
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Technician Rating Analytics</h1>
          <p>Monitor service quality, rating trends, and recent feedback records.</p>
        </div>
        <div className="admin-header__actions">
          <button type="button" className="secondary-button" onClick={loadRecords} disabled={loading}>
            <RefreshCw size={18} aria-hidden="true" />
            Refresh Data
          </button>
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="filter-panel" aria-label="Dashboard filters">
        <label>
          Technician
          <select value={technicianFilter} onChange={(event) => setTechnicianFilter(event.target.value)}>
            <option value="all">All technicians</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.id} - {technician.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Start date
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>

        <label>
          End date
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>
      </section>

      {loading ? (
        <section className="dashboard-state" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading rating data...
        </section>
      ) : null}

      {!loading && error ? (
        <section className="dashboard-state dashboard-state--error" role="alert">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <button type="button" className="primary-button" onClick={loadRecords}>
            Try Again
          </button>
        </section>
      ) : null}

      {!loading && !error && totalRatings === 0 ? (
        <section className="dashboard-state">
          <h2>No rating data yet</h2>
          <p>Once customers submit ratings, the analytics dashboard will appear here.</p>
        </section>
      ) : null}

      {!loading && !error && totalRatings > 0 ? (
        <>
          <section className="stats-grid">
            <StatCard label="Total Ratings" value={totalRatings} helper="Filtered records" />
            <StatCard label="Overall Average" value={`${overallAverage}/5`} helper="Across selected records" tone="good" />
            <StatCard
              label="Best Performing Technician"
              value={best ? best.name : '-'}
              helper={best ? `${best.id} · ${best.average}/5 from ${best.count} rating(s)` : 'No data'}
              tone="excellent"
            />
            <StatCard
              label="Lowest Performing Technician"
              value={lowest ? lowest.name : '-'}
              helper={lowest ? `${lowest.id} · ${lowest.average}/5 from ${lowest.count} rating(s)` : 'No data'}
              tone="weak"
            />
          </section>

          <section className="charts-grid">
            <AverageRatingChart data={technicianStats} />
            <RatingCountChart data={technicianStats} />
            <DistributionChart data={distributionData} />
          </section>

          <section className="table-card">
            <div className="table-card__header">
              <h2>Average Rating per Technician</h2>
              <p>Includes rating distribution for every technician.</p>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Technician</th>
                    <th>ID</th>
                    <th>Average</th>
                    <th>Ratings</th>
                    <th>1★</th>
                    <th>2★</th>
                    <th>3★</th>
                    <th>4★</th>
                    <th>5★</th>
                  </tr>
                </thead>
                <tbody>
                  {technicianStats.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.id}</td>
                      <td>{item.count ? `${item.average}/5` : '-'}</td>
                      <td>{item.count}</td>
                      {item.distribution.map((distribution) => (
                        <td key={distribution.value}>{distribution.count}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="table-card">
            <div className="table-card__header">
              <h2>Recent Rating Records</h2>
              <p>Latest 12 records based on the selected filters.</p>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Technician</th>
                    <th>Rating</th>
                    <th>Device</th>
                    <th>User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {latestRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{formatDate(record.timestamp)}</td>
                      <td>{record.technicianId} - {record.technicianName}</td>
                      <td>{record.emojiSelected} {record.ratingValue}/5 · {record.ratingLabel}</td>
                      <td>{record.deviceType}</td>
                      <td className="user-agent-cell" title={record.userAgent}>{record.userAgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
