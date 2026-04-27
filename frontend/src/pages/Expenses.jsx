import { useState, useEffect } from 'react';
import API from '../api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await API.get('/expense/all');
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Expenses</h1>
        <p className="page-subtitle">Manage your transactions</p>
      </div>

      <ExpenseForm onAdded={fetchExpenses} />

      <div className="glass-card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem', color: 'var(--text-primary)' }}>
          Transaction History
        </h3>
        {loading ? (
          <div className="page-loading">
            <div className="spinner" />
          </div>
        ) : (
          <ExpenseList expenses={expenses} onDeleted={fetchExpenses} />
        )}
      </div>
    </div>
  );
}
