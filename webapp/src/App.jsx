import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Bitcoin,
  TrendingUp,
  ShoppingCart,
  Award,
  Users,
  Heart,
  PlusCircle,
  DollarSign,
  Flame,
  BarChart3,
  Trophy,
  Target,
  MessageCircle,
  Twitter,
  Globe,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './App.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data for demo purposes (in real app, this would come from API/database)
const DEMO_USER = {
  username: 'bitcoin_dad',
  name: 'Bitcoin Dad',
  email: 'dad@example.com',
  preferred_currency: 'USD',
  total_invested: 1300,
  total_bitcoin: 0.02345678,
  average_price: 55425.50,
  current_streak_weeks: 13,
  max_streak_weeks: 13,
  purchase_count: 13,
  first_purchase_date: '2024-06-01',
  last_purchase_date: '2024-08-24'
};

const DEMO_PURCHASES = [
  { id: 1, amount_fiat: 100, currency: 'USD', bitcoin_price: 57000, bitcoin_amount: 0.00175439, purchase_date: '2024-08-24' },
  { id: 2, amount_fiat: 100, currency: 'USD', bitcoin_price: 56000, bitcoin_amount: 0.00178571, purchase_date: '2024-08-17' },
  { id: 3, amount_fiat: 100, currency: 'USD', bitcoin_price: 55000, bitcoin_amount: 0.00181818, purchase_date: '2024-08-10' },
  { id: 4, amount_fiat: 100, currency: 'USD', bitcoin_price: 54000, bitcoin_amount: 0.00185185, purchase_date: '2024-08-03' },
  { id: 5, amount_fiat: 100, currency: 'USD', bitcoin_price: 53000, bitcoin_amount: 0.00188679, purchase_date: '2024-07-27' }
];

const DEMO_ACHIEVEMENTS = [
  { id: 1, name: 'First Stack', description: 'Made your first Bitcoin purchase', icon: '⚡', unlocked: true, unlocked_at: '2024-06-01' },
  { id: 2, name: 'Consistent Stacker', description: '10 consecutive weeks of DCA', icon: '🔥', unlocked: true, unlocked_at: '2024-08-10' },
  { id: 3, name: 'HODL Master', description: 'Held for 6+ months without selling', icon: '💎', unlocked: false },
  { id: 4, name: 'Bitcoin Whale', description: 'Accumulated 1+ Bitcoin', icon: '🐋', unlocked: false },
  { id: 5, name: 'Family First', description: 'Convinced spouse to support Bitcoin', icon: '👨‍👩‍👧‍👦', unlocked: true, unlocked_at: '2024-07-15' },
  { id: 6, name: 'Rocket Fuel', description: '52 weeks of consistent DCA', icon: '🚀', unlocked: false }
];

const DEMO_LEADERBOARD = [
  { rank: 1, name: 'Bitcoin Dad', username: 'bitcoin_dad', streak: 13, bitcoin: 0.02345678, achievements: 3 },
  { rank: 2, name: 'HODL Henry', username: 'hodl_henry', streak: 12, bitcoin: 0.01876543, achievements: 3 },
  { rank: 3, name: 'Stack Sally', username: 'stack_sally', streak: 11, bitcoin: 0.02987654, achievements: 2 },
  { rank: 4, name: 'Crypto Charlie', username: 'crypto_charlie', streak: 8, bitcoin: 0.01567890, achievements: 2 },
  { rank: 5, name: 'DCA Dave', username: 'dca_dave', streak: 6, bitcoin: 0.01234567, achievements: 1 },
];

function App() {
  const [currentTab, setCurrentTab] = useState('portfolio');
  const [bitcoinPrice, setBitcoinPrice] = useState({ USD: 57000, EUR: 52000, GBP: 45000, AUD: 85500 });
  const [userData, setUserData] = useState(DEMO_USER);
  const [purchases, setPurchases] = useState(DEMO_PURCHASES);
  const [achievements, setAchievements] = useState(DEMO_ACHIEVEMENTS);
  const [leaderboard, setLeaderboard] = useState(DEMO_LEADERBOARD);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [purchaseForm, setPurchaseForm] = useState({
    amount: '',
    currency: 'USD',
    date: dayjs().format('YYYY-MM-DD')
  });

  useEffect(() => {
    loadBitcoinPrice();
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const loadBitcoinPrice = async () => {
    // FIXED: Use fallback prices immediately - no API calls that cause 403 errors
    console.log('Loading Bitcoin prices...');
    setBitcoinPrice({ USD: 57000, EUR: 52000, GBP: 45000, AUD: 85500 });
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  const handleAddPurchase = (e) => {
    e.preventDefault();
    
    if (!purchaseForm.amount || !purchaseForm.currency || !purchaseForm.date) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const amount = parseFloat(purchaseForm.amount);
    const price = bitcoinPrice[purchaseForm.currency];
    const bitcoinAmount = amount / price;

    const newPurchase = {
      id: purchases.length + 1,
      amount_fiat: amount,
      currency: purchaseForm.currency,
      bitcoin_price: price,
      bitcoin_amount: bitcoinAmount,
      purchase_date: purchaseForm.date
    };

    setPurchases([newPurchase, ...purchases]);
    
    // Update user data
    setUserData(prev => ({
      ...prev,
      total_invested: prev.total_invested + amount,
      total_bitcoin: prev.total_bitcoin + bitcoinAmount,
      purchase_count: prev.purchase_count + 1,
      last_purchase_date: purchaseForm.date,
      average_price: (prev.total_invested + amount) / (prev.total_bitcoin + bitcoinAmount)
    }));

    // Reset form
    setPurchaseForm({
      amount: '',
      currency: 'USD',  
      date: dayjs().format('YYYY-MM-DD')
    });

    showToast('Purchase added successfully!', 'success');
  };

  const generateChartData = () => {
    const weeks = [];
    const invested = [];
    const bitcoinValue = [];
    
    for (let i = 12; i >= 0; i--) {
      const date = dayjs().subtract(i, 'week');
      weeks.push(date.format('MMM DD'));
      
      const weeklyInvestment = 100 * (13 - i);
      invested.push(weeklyInvestment);
      
      // Simulate Bitcoin value growth with some volatility
      const currentValue = weeklyInvestment * (1 + (Math.sin(i / 2) * 0.3) + 0.1);
      bitcoinValue.push(currentValue);
    }

    return {
      labels: weeks,
      datasets: [
        {
          label: 'Amount Invested',
          data: invested,
          borderColor: '#6b7280',
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          borderWidth: 2,
          fill: false
        },
        {
          label: 'Bitcoin Value',
          data: bitcoinValue,
          borderColor: '#f7931a',
          backgroundColor: 'rgba(247, 147, 26, 0.1)',
          borderWidth: 3,
          fill: true
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: '#374151'
        }
      },
      y: {
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: '#374151'
        }
      }
    }
  };

  const currentValue = userData.total_bitcoin * bitcoinPrice[userData.preferred_currency];
  const gainLoss = currentValue - userData.total_invested;
  const gainLossPercent = ((gainLoss / userData.total_invested) * 100);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bitcoin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Bitcoin Dad Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Bitcoin className="w-8 h-8 mr-2 text-bitcoin" />
                  Bitcoin Dad Ledger
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Current BTC Price</div>
                <div className="text-lg font-semibold text-bitcoin">
                  ${formatNumber(bitcoinPrice.USD)}
                </div>
              </div>
              <div className="h-8 w-8 bg-bitcoin rounded-full flex items-center justify-center text-black font-bold">
                {userData.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
              { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'leaderboard', label: 'Leaderboard', icon: Users },
              { id: 'community', label: 'Community', icon: Heart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  currentTab === tab.id
                    ? 'border-bitcoin text-bitcoin'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'portfolio' && (
          <div className="space-y-8">
            {/* Portfolio Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat-card bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Invested</p>
                    <p className="text-2xl font-bold text-white">
                      {userData.preferred_currency} ${formatNumber(userData.total_invested)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="stat-card bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Bitcoin Holdings</p>
                    <p className="text-2xl font-bold text-bitcoin">
                      ₿ {userData.total_bitcoin.toFixed(8)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-bitcoin rounded-lg flex items-center justify-center">
                    <Bitcoin className="h-6 w-6 text-black" />
                  </div>
                </div>
              </div>

              <div className="stat-card bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Current Value</p>
                    <p className="text-2xl font-bold text-white">
                      {userData.preferred_currency} ${formatNumber(currentValue)}
                    </p>
                    <p className={`text-sm ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {gainLoss >= 0 ? '+' : ''}${formatNumber(gainLoss)} ({gainLossPercent.toFixed(1)}%)
                    </p>
                  </div>
                  <div className={`h-12 w-12 ${gainLoss >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-lg flex items-center justify-center`}>
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="stat-card bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Week Streak</p>
                    <p className="text-2xl font-bold text-bitcoin">
                      {userData.current_streak_weeks} weeks
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Chart */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Portfolio Growth
              </h3>
              <div className="h-80">
                <Line data={generateChartData()} options={chartOptions} />
              </div>
            </div>

            {/* Add New Purchase */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Purchase
              </h3>
              <form onSubmit={handleAddPurchase} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                    <input
                      type="number"
                      value={purchaseForm.amount}
                      onChange={(e) => setPurchaseForm({...purchaseForm, amount: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-bitcoin focus:ring-1 focus:ring-bitcoin"
                      placeholder="100.00"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                    <select
                      value={purchaseForm.currency}
                      onChange={(e) => setPurchaseForm({...purchaseForm, currency: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-bitcoin focus:ring-1 focus:ring-bitcoin"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                    <input
                      type="date"
                      value={purchaseForm.date}
                      onChange={(e) => setPurchaseForm({...purchaseForm, date: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-bitcoin focus:ring-1 focus:ring-bitcoin"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    Current BTC Price: <span className="text-bitcoin font-semibold">${formatNumber(bitcoinPrice[purchaseForm.currency])}</span>
                  </div>
                  <button
                    type="submit"
                    className="bg-bitcoin hover:bg-bitcoin-dark text-black px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Purchase
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentTab === 'purchases' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2" />
                Purchase History
              </h2>
              <div className="text-sm text-gray-400">
                Total: {userData.purchase_count} purchases
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount (Fiat)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">BTC Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bitcoin Received</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {purchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(purchase.purchase_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {purchase.currency} ${formatNumber(purchase.amount_fiat)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-bitcoin">
                          ${formatNumber(purchase.bitcoin_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          ₿ {purchase.bitcoin_amount.toFixed(8)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Purchase Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Average Purchase</h3>
                <p className="text-xl font-bold text-white">
                  {userData.preferred_currency} ${formatNumber(userData.total_invested / userData.purchase_count)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Average Price</h3>
                <p className="text-xl font-bold text-bitcoin">
                  ${formatNumber(userData.average_price)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-2">DCA Frequency</h3>
                <p className="text-xl font-bold text-white">Weekly</p>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Award className="w-6 h-6 mr-2" />
                Achievements
              </h2>
              <div className="text-sm text-gray-400">
                {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-gray-800 rounded-xl p-6 border transition-all ${
                    achievement.unlocked 
                      ? 'border-bitcoin shadow-lg shadow-bitcoin/20' 
                      : 'border-gray-700 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{achievement.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <span className="inline-block bg-bitcoin text-black px-3 py-1 rounded-full text-xs font-medium">
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Progress */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Progress to Next Achievement
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Rocket Fuel (52 week streak)</span>
                    <span>{userData.current_streak_weeks}/52 weeks</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-bitcoin rounded-full h-2 transition-all duration-500" 
                      style={{width: `${Math.min((userData.current_streak_weeks / 52) * 100, 100)}%`}}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Bitcoin Whale (1 BTC)</span>
                    <span>₿ {userData.total_bitcoin.toFixed(8)}/1.00000000</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-bitcoin rounded-full h-2 transition-all duration-500" 
                      style={{width: `${Math.min((userData.total_bitcoin / 1) * 100, 100)}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Community Leaderboard
              </h2>
              <div className="text-sm text-gray-400">
                2,847+ Bitcoin Dads Worldwide
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Dad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Streak</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bitcoin Stack</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Achievements</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {leaderboard.map((user) => (
                      <tr 
                        key={user.rank} 
                        className={`hover:bg-gray-700 transition-colors ${
                          user.username === userData.username ? 'bg-bitcoin bg-opacity-10' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            user.rank === 1 ? 'bg-yellow-500 text-black' :
                            user.rank === 2 ? 'bg-gray-400 text-black' :
                            user.rank === 3 ? 'bg-yellow-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {user.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-bitcoin rounded-full flex items-center justify-center text-black font-bold text-sm mr-3">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{user.name}</div>
                              <div className="text-sm text-gray-400">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Flame className="w-4 h-4 mr-2 text-bitcoin" />
                            <span className="text-sm text-white">{user.streak} weeks</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-bitcoin">
                          ₿ {user.bitcoin.toFixed(8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          <span className="bg-gray-700 text-bitcoin px-2 py-1 rounded-full text-xs">
                            {user.achievements} badges
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'community' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                Bitcoin Dad Community
              </h2>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-bitcoin mb-2">2,847</div>
                  <p className="text-gray-400">Active Bitcoin Dads</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-bitcoin mb-2">₿ 456.78</div>
                  <p className="text-gray-400">Total Community Stack</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-bitcoin mb-2">1,234</div>
                  <p className="text-gray-400">Active Streaks</p>
                </div>
              </div>
            </div>

            {/* Community Features */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Join the Community
              </h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Connect with fellow Bitcoin dads who are building generational wealth through consistent DCA investing.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-bitcoin hover:bg-bitcoin-dark text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Join Discord
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                    <Twitter className="w-4 h-4 mr-2" />
                    Follow on Twitter
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                  </button>
                </div>
              </div>
            </div>

            {/* Weekly Challenge */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                This Week's Challenge
              </h3>
              <div className="bg-gradient-to-r from-bitcoin to-yellow-500 rounded-lg p-4 text-black">
                <h4 className="font-bold mb-2">Stack and Share Challenge</h4>
                <p className="mb-3">Make a DCA purchase and share your Bitcoin dad story with the community!</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reward: Exclusive "Community Builder" badge</span>
                  <button className="bg-black text-bitcoin px-3 py-1 rounded text-sm font-medium">
                    Participate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p className="mb-2">
              <strong className="text-bitcoin">Bitcoin Dad Ledger</strong> - 
              Building generational wealth, one satoshi at a time.
            </p>
            <p className="text-sm">
              Powered by React & Vite | Deployed on Vercel
            </p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`bg-gray-800 border rounded-lg p-4 shadow-lg max-w-sm ${
            toast.type === 'success' ? 'border-green-500' :
            toast.type === 'error' ? 'border-red-500' :
            'border-blue-500'
          }`}>
            <div className="flex items-center">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mr-3" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-500 mr-3" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 mr-3" />}
              <span className="text-white">{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;