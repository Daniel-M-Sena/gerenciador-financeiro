import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wallet } from 'lucide-react';
import { SummaryCards } from './components/SummaryCards';
import { FinancialChart } from './components/FinancialChart';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { BillsToPay } from './components/BillsToPay';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  // Carrega dados do localStorage ao montar o componente
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedBills = localStorage.getItem('bills');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    if (savedBills) {
      setBills(JSON.parse(savedBills));
    }
  }, []);

  // Salva transações no localStorage quando há mudanças
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Salva contas no localStorage quando há mudanças
  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  // Adiciona nova transação
  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    
    setTransactions([...transactions, newTransaction]);
  };

  // Remove transação
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Adiciona nova conta
  const handleAddBill = (bill: Omit<Bill, 'id' | 'status'>) => {
    const newBill: Bill = {
      ...bill,
      id: Date.now().toString(),
      status: 'pending'
    };
    
    setBills([...bills, newBill]);
  };

  // Alterna status da conta (pendente/pago)
  const handleToggleBillStatus = (id: string) => {
    setBills(bills.map(bill => 
      bill.id === id 
        ? { ...bill, status: bill.status === 'pending' ? 'paid' : 'pending' }
        : bill
    ));
  };

  // Remove conta
  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(b => b.id !== id));
  };

  // Calcula totais
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-white">Gerenciador Financeiro</h1>
              <p className="text-gray-400">Controle suas finanças pessoais</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Resumo */}
        <SummaryCards 
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
        />

        {/* Gráfico Financeiro */}
        <FinancialChart transactions={transactions} />

        {/* Grid de duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Formulário e Histórico */}
          <div>
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <TransactionList 
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>

          {/* Coluna Direita - Contas a Pagar */}
          <div>
            <BillsToPay 
              bills={bills}
              onAddBill={handleAddBill}
              onToggleBillStatus={handleToggleBillStatus}
              onDeleteBill={handleDeleteBill}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="border-t border-gray-800 bg-gray-900/50 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500">
            Gerenciador Financeiro Pessoal - Mantenha suas finanças organizadas
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
