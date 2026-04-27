import { useState, useEffect } from 'react';
import API from '../api';
import SummaryCards from '../components/SummaryCards';
import PieChartCard from '../components/PieChart';
import BarChartCard from '../components/BarChart';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await API.get('/expense/summary');
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="page-loading">
        <p>Failed to load data. Is the backend running?</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Your monthly spending overview</p>
      </div>

      <SummaryCards summary={summary} />

      <div className="charts-grid">
        <PieChartCard data={summary.categoryBreakdown} />
        <BarChartCard data={summary.dailyExpenses} />
      </div>
    </div>
  );
}
