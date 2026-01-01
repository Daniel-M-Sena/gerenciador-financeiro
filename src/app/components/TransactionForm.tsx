import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
  }) => void;
}

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'income' | 'expense'>('income');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      return;
    }

    onAddTransaction({
      description,
      amount: parseFloat(amount),
      date,
      type
    });

    // Limpa o formulário
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8"
    >
      <h2 className="text-white mb-6">Adicionar Transação</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de transação */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${
              type === 'income'
                ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Entrada</span>
          </button>
          
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${
              type === 'expense'
                ? 'bg-red-500/20 border-red-500 text-red-500'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            <TrendingDown className="w-5 h-5" />
            <span>Saída</span>
          </button>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-gray-400 mb-2">Descrição</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Salário, Aluguel, Compras..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
        </div>

        {/* Valor e Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        {/* Botão de adicionar */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Adicionar Transação</span>
        </motion.button>
      </form>
    </motion.div>
  );
}
