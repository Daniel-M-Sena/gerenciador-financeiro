import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useMemo } from 'react';
import { Calendar, Filter } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface FinancialChartProps {
  transactions: Transaction[];
}

export function FinancialChart({ transactions }: FinancialChartProps) {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Obtém anos disponíveis
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    transactions.forEach(transaction => {
      const year = new Date(transaction.date).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  // Agrupa transações por mês
  const getChartData = () => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};

    // Filtra transações
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      const year = date.getFullYear().toString();
      const month = String(date.getMonth() + 1).padStart(2, '0');

      if (selectedYear !== 'all' && year !== selectedYear) return false;
      if (selectedMonth !== 'all' && month !== selectedMonth) return false;

      return true;
    });

    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    });

    // Converte para array e ordena por data
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => {
        const [year, monthNum] = month.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return {
          month: `${monthNames[parseInt(monthNum) - 1]}/${year.slice(-2)}`,
          Entradas: data.income,
          Saídas: data.expense
        };
      })
      .slice(-12); // Últimos 12 meses
  };

  const chartData = getChartData();

  // Calcula o valor máximo para definir o domínio do eixo Y
  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 5000;
    
    const max = Math.max(
      ...chartData.map(d => Math.max(d.Entradas, d.Saídas))
    );
    
    // Arredonda para cima para um valor "bonito"
    if (max <= 500) return 500;
    if (max <= 1000) return 1000;
    if (max <= 2000) return 2000;
    if (max <= 5000) return 5000;
    if (max <= 10000) return 10000;
    if (max <= 20000) return 20000;
    
    return Math.ceil(max / 10000) * 10000;
  }, [chartData]);

  // Define os ticks do eixo Y
  const yAxisTicks = useMemo(() => {
    if (maxValue <= 500) return [0, 100, 200, 300, 400, 500];
    if (maxValue <= 1000) return [0, 200, 400, 600, 800, 1000];
    if (maxValue <= 2000) return [0, 500, 1000, 1500, 2000];
    if (maxValue <= 5000) return [0, 1000, 2000, 3000, 4000, 5000];
    if (maxValue <= 10000) return [0, 2000, 4000, 6000, 8000, 10000];
    if (maxValue <= 20000) return [0, 5000, 10000, 15000, 20000];
    
    return [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue];
  }, [maxValue]);

  // Formata valores do eixo Y
  const formatYAxis = (value: number) => {
    if (value === 0) return 'R$ 0,00';
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}.${String(value % 1000).padStart(3, '0').slice(0, 3)}`;
    }
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white mb-2">{payload[0].payload.month}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const monthNames = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-500" />
          <h2 className="text-white">Análise Financeira</h2>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          {/* Filtro de Ano */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">Todos os anos</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* Filtro de Mês */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">Todos os meses</option>
            {monthNames.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>

          {/* Botão de limpar filtros */}
          {(selectedYear !== 'all' || selectedMonth !== 'all') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedYear('all');
                setSelectedMonth('all');
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Limpar filtros
            </motion.button>
          )}
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={formatYAxis}
              ticks={yAxisTicks}
              domain={[0, maxValue]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF' }}
              iconType="circle"
            />
            <Bar 
              dataKey="Entradas" 
              fill="#3B82F6" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="Saídas" 
              fill="#EF4444" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[350px] text-gray-500">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum dado disponível para os filtros selecionados</p>
            <p className="text-sm mt-2">Adicione transações ou ajuste os filtros</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}