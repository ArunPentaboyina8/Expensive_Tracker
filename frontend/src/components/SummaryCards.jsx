import { IndianRupee, TrendingUp, ArrowUpDown } from 'lucide-react';

export default function SummaryCards({ summary }) {
  const cards = [
    {
      title: 'Total Spent',
      value: `₹${summary.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: IndianRupee,
      gradient: 'card-gradient--purple',
    },
    {
      title: 'Top Category',
      value: summary.highestCategory,
      subtitle: `₹${summary.highestCategoryAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      gradient: 'card-gradient--cyan',
    },
    {
      title: 'Transactions',
      value: summary.transactionCount,
      subtitle: 'this month',
      icon: ArrowUpDown,
      gradient: 'card-gradient--pink',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div key={card.title} className={`summary-card ${card.gradient}`}>
          <div className="summary-card__header">
            <span className="summary-card__title">{card.title}</span>
            <div className="summary-card__icon">
              <card.icon size={20} />
            </div>
          </div>
          <div className="summary-card__value">{card.value}</div>
          {card.subtitle && (
            <div className="summary-card__subtitle">{card.subtitle}</div>
          )}
        </div>
      ))}
    </div>
  );
}
