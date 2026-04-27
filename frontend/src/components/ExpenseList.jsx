import { Trash2 } from 'lucide-react';
import API from '../api';

export default function ExpenseList({ expenses, onDeleted }) {
  const handleDelete = async (id) => {
    try {
      await API.delete(`/expense/${id}`);
      onDeleted?.();
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="expense-list__empty">
        <p>No expenses recorded yet. Start tracking your spending!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <div className="expense-list__header">
        <span>Date</span>
        <span>Category</span>
        <span>Description</span>
        <span>Amount</span>
        <span></span>
      </div>
      {expenses.map((expense) => (
        <div key={expense.id} className="expense-list__row">
          <span className="expense-list__date">{expense.date}</span>
          <span className="expense-list__category">
            <span className="category-badge">{expense.category}</span>
          </span>
          <span className="expense-list__desc">
            {expense.description || '—'}
          </span>
          <span className="expense-list__amount">
            ₹{parseFloat(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <button
            className="btn btn--danger btn--sm"
            onClick={() => handleDelete(expense.id)}
            title="Delete expense"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
