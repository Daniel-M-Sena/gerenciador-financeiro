import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function SummaryCards({ totalIncome, totalExpense, balance }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const cards = [
    {
      title: 'Total de Entradas',
      value: totalIncome,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Total de Saídas',
      value: totalExpense,
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    {
      title: 'Saldo Atual',
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? 'text-green-500' : 'text-red-500',
      bgColor: balance >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
      borderColor: balance >= 0 ? 'border-green-500/20' : 'border-red-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className={`${card.bgColor} ${card.borderColor} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-${card.color}/20`}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400">{card.title}</p>
            <div className={`${card.color} ${card.bgColor} p-3 rounded-lg`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
          <p className={`${card.color}`}>{formatCurrency(card.value)}</p>
        </motion.div>
      ))}
    </div>
  );
}
