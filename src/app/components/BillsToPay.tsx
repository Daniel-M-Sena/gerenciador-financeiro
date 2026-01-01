import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Clock, Check, CreditCard, Trash2, Calendar } from 'lucide-react';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
}

interface BillsToPayProps {
  bills: Bill[];
  onAddBill: (bill: Omit<Bill, 'id' | 'status'>) => void;
  onToggleBillStatus: (id: string) => void;
  onDeleteBill: (id: string) => void;
}

export function BillsToPay({ bills, onAddBill, onToggleBillStatus, onDeleteBill }: BillsToPayProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || !dueDate) {
      return;
    }

    onAddBill({
      name,
      amount: parseFloat(amount),
      dueDate
    });

    // Limpa o formulário
    setName('');
    setAmount('');
    setDueDate('');
    setShowForm(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'paid') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + 'T00:00:00');
    return due < today;
  };

  // Ordena contas por data de vencimento
  const sortedBills = [...bills].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const pendingBills = sortedBills.filter(bill => bill.status === 'pending');
  const paidBills = sortedBills.filter(bill => bill.status === 'paid');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white">Contas a Pagar</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Conta</span>
        </motion.button>
      </div>

      {/* Formulário para adicionar conta */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6 space-y-4"
        >
          <div>
            <label className="block text-gray-400 mb-2">Nome da Conta</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Luz, Água, Internet..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Vencimento</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </motion.form>
      )}

      {/* Lista de contas pendentes */}
      {pendingBills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-gray-400 mb-3">Pendentes</h3>
          <div className="space-y-3">
            {pendingBills.map((bill, index) => (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gray-800/50 border rounded-lg p-4 hover:border-gray-600 transition-all group ${
                  isOverdue(bill.dueDate, bill.status) 
                    ? 'border-red-500/50' 
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${
                      isOverdue(bill.dueDate, bill.status)
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white">{bill.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <p className={`${
                          isOverdue(bill.dueDate, bill.status) 
                            ? 'text-red-500' 
                            : 'text-gray-500'
                        }`}>
                          {formatDate(bill.dueDate)}
                          {isOverdue(bill.dueDate, bill.status) && ' (Vencida)'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <p className="text-white">{formatCurrency(bill.amount)}</p>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onToggleBillStatus(bill.id)}
                        className="text-green-500 hover:text-green-400"
                        title="Marcar como pago"
                      >
                        <Check className="w-5 h-5" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDeleteBill(bill.id)}
                        className="text-gray-500 hover:text-red-500"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de contas pagas */}
      {paidBills.length > 0 && (
        <div>
          <h3 className="text-gray-400 mb-3">Pagas</h3>
          <div className="space-y-3">
            {paidBills.map((bill, index) => (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 opacity-60 hover:opacity-100 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-green-500/20 text-green-500 p-2 rounded-lg">
                      <Check className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white line-through">{bill.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <p className="text-gray-500">{formatDate(bill.dueDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <p className="text-gray-400 line-through">{formatCurrency(bill.amount)}</p>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDeleteBill(bill.id)}
                      className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {bills.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma conta registrada ainda</p>
        </div>
      )}
    </motion.div>
  );
}
