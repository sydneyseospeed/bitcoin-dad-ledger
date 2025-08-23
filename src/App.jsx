import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Bitcoin, TrendingUp, Target, Award, Users, Calendar, DollarSign, Zap, Trophy, Star, Shield, Rocket } from 'lucide-react';
import './App.css';

// Mock Bitcoin price data (in production, this would come from a real API)
const mockBitcoinPrice = {
  USD: 43250,
  AUD: 65800,
  EUR: 39850,
  GBP: 34200
};

// Exchange rates for currency conversion
const exchangeRates = {
  USD: 1,
  AUD: 1.52,
  EUR: 0.92,
  GBP: 0.79
};

// Achievement definitions
const achievements = [
  { id: 'first_purchase', name: 'First Stack', description: 'Made your first Bitcoin purchase', icon: Bitcoin, threshold: 1, color: '#f7931a' },
  { id: 'consistent_stacker', name: 'Consistent Stacker', description: '10 consecutive weeks of DCA', icon: Calendar, threshold: 10, color: '#10b981' },
  { id: 'hodl_master', name: 'HODL Master', description: 'Held for 6+ months without selling', icon: Shield, threshold: 180, color: '#8b5cf6' },
  { id: 'whale_status', name: 'Bitcoin Whale', description: 'Accumulated 1+ Bitcoin', icon: Trophy, threshold: 1, color: '#f59e0b' },
  { id: 'family_first', name: 'Family First', description: 'Convinced spouse to support Bitcoin', icon: Users, threshold: 1, color: '#ef4444' },
  { id: 'rocket_fuel', name: 'Rocket Fuel', description: '52 weeks of consistent DCA', icon: Rocket, threshold: 52, color: '#06b6d4' }
];

// Mock leaderboard data
const leaderboardData = [
  { rank: 1, name: 'BitcoinDad_Mike', btcAmount: 2.45, weekStreak: 78, achievements: 6 },
  { rank: 2, name: 'SatsStacker_Dave', btcAmount: 1.89, weekStreak: 65, achievements: 5 },
  { rank: 3, name: 'HODLer_John', btcAmount: 1.67, weekStreak: 52, achievements: 4 },
  { rank: 4, name: 'StackingSam', btcAmount: 1.23, weekStreak: 43, achievements: 4 },
  { rank: 5, name: 'BitcoinBen', btcAmount: 0.98, weekStreak: 38, achievements: 3 }
];

function App() {
  const [currency, setCurrency] = useState('AUD');
  const [dcaAmount, setDcaAmount] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [purchases, setPurchases] = useState([]);
  const [userStats, setUserStats] = useState({
    totalInvested: 0,
    totalBTC: 0,
    averagePrice: 0,
    weekStreak: 0,
    unlockedAchievements: []
  });
  const [activeTab, setActiveTab] = useState('tracker');

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random price fluctuations for demo
      const fluctuation = (Math.random() - 0.5) * 1000;
      mockBitcoinPrice[currency] += fluctuation;
    }, 30000);

    return () => clearInterval(interval);
  }, [currency]);

  // Calculate user statistics
  useEffect(() => {
    const totalInvested = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalBTC = purchases.reduce((sum, purchase) => sum + purchase.btcAmount, 0);
    const averagePrice = totalBTC > 0 ? totalInvested / totalBTC : 0;
    
    // Calculate week streak (simplified)
    const weekStreak = purchases.length; // In real app, this would be more sophisticated
    
    // Check achievements
    const unlockedAchievements = achievements.filter(achievement => {
      switch (achievement.id) {
        case 'first_purchase':
          return purchases.length >= 1;
        case 'consistent_stacker':
          return weekStreak >= 10;
        case 'hodl_master':
          return purchases.length > 0 && (Date.now() - new Date(purchases[0].date).getTime()) > 180 * 24 * 60 * 60 * 1000;
        case 'whale_status':
          return totalBTC >= 1;
        case 'family_first':
          return weekStreak >= 5; // Simplified condition
        case 'rocket_fuel':
          return weekStreak >= 52;
        default:
          return false;
      }
    });

    setUserStats({
      totalInvested,
      totalBTC,
      averagePrice,
      weekStreak,
      unlockedAchievements
    });
  }, [purchases]);

  const addPurchase = () => {
    if (!dcaAmount || dcaAmount <= 0) return;
    
    const amount = parseFloat(dcaAmount);
    const btcPrice = mockBitcoinPrice[currency];
    const btcAmount = amount / btcPrice;
    
    const newPurchase = {
      id: Date.now(),
      date: new Date().toISOString(),
      amount: amount,
      btcAmount: btcAmount,
      price: btcPrice,
      currency: currency
    };
    
    setPurchases([...purchases, newPurchase]);
    setDcaAmount('');
  };

  // Chart data for portfolio growth
  const chartData = useMemo(() => {
    let runningTotal = 0;
    let runningBTC = 0;
    return purchases.map((purchase, index) => {
      runningTotal += purchase.amount;
      runningBTC += purchase.btcAmount;
      return {
        date: new Date(purchase.date).toLocaleDateString(),
        invested: runningTotal,
        btcValue: runningBTC * mockBitcoinPrice[currency],
        btcAmount: runningBTC
      };
    });
  }, [purchases, currency]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatBTC = (amount) => {
    return `₿${amount.toFixed(8)}`;
  };

  const currentPortfolioValue = userStats.totalBTC * mockBitcoinPrice[currency];
  const portfolioGainLoss = currentPortfolioValue - userStats.totalInvested;
  const portfolioGainLossPercent = userStats.totalInvested > 0 ? (portfolioGainLoss / userStats.totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Bitcoin Dad Ledger</h1>
                <p className="text-sm text-slate-400">Track your journey to generational wealth</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Bitcoin Price ({currency})</p>
                <p className="text-xl font-bold text-orange-500">{formatCurrency(mockBitcoinPrice[currency])}</p>
              </div>
              <Button 
                onClick={() => window.open('https://bitcoinreserve.com/wife-script', '_blank')}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Get Wife Script
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
            <TabsTrigger value="tracker" className="data-[state=active]:bg-orange-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              DCA Tracker
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-orange-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-orange-600">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-orange-600">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-orange-600">
              <Users className="w-4 h-4 mr-2" />
              Community
            </TabsTrigger>
          </TabsList>

          {/* DCA Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-400">Total Invested</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{formatCurrency(userStats.totalInvested)}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-400">Bitcoin Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-500">{formatBTC(userStats.totalBTC)}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-400">Portfolio Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{formatCurrency(currentPortfolioValue)}</p>
                  <p className={`text-sm ${portfolioGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {portfolioGainLoss >= 0 ? '+' : ''}{formatCurrency(portfolioGainLoss)} ({portfolioGainLossPercent.toFixed(1)}%)
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-400">Week Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-500">{userStats.weekStreak}</p>
                  <p className="text-sm text-slate-400">consecutive weeks</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Add DCA Purchase</CardTitle>
                <CardDescription className="text-slate-400">
                  Record your latest Bitcoin purchase to track your DCA journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="currency" className="text-slate-300">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="AUD">AUD (Australian Dollar)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="amount" className="text-slate-300">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="100"
                      value={dcaAmount}
                      onChange={(e) => setDcaAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frequency" className="text-slate-300">Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={addPurchase}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={!dcaAmount || dcaAmount <= 0}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Add Purchase
                    </Button>
                  </div>
                </div>
                
                {dcaAmount && dcaAmount > 0 && (
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-slate-300">
                      You'll receive approximately <span className="text-orange-500 font-bold">
                        {formatBTC(parseFloat(dcaAmount) / mockBitcoinPrice[currency])}
                      </span> at current price of {formatCurrency(mockBitcoinPrice[currency])}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {purchases.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Purchases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {purchases.slice(-10).reverse().map((purchase) => (
                      <div key={purchase.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{formatCurrency(purchase.amount)}</p>
                          <p className="text-sm text-slate-400">{new Date(purchase.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-orange-500 font-medium">{formatBTC(purchase.btcAmount)}</p>
                          <p className="text-sm text-slate-400">@ {formatCurrency(purchase.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            {chartData.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Portfolio Growth</CardTitle>
                  <CardDescription className="text-slate-400">
                    Track your investment vs Bitcoin value over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="invested" 
                          stroke="#6B7280" 
                          strokeWidth={2}
                          name="Total Invested"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="btcValue" 
                          stroke="#F97316" 
                          strokeWidth={2}
                          name="Bitcoin Value"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Average Purchase Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-500">
                    {userStats.averagePrice > 0 ? formatCurrency(userStats.averagePrice) : 'N/A'}
                  </p>
                  <p className="text-slate-400 mt-2">
                    Current price: {formatCurrency(mockBitcoinPrice[currency])}
                  </p>
                  {userStats.averagePrice > 0 && (
                    <p className={`text-sm mt-1 ${mockBitcoinPrice[currency] > userStats.averagePrice ? 'text-green-500' : 'text-red-500'}`}>
                      {mockBitcoinPrice[currency] > userStats.averagePrice ? 'Above' : 'Below'} your average by{' '}
                      {Math.abs(((mockBitcoinPrice[currency] - userStats.averagePrice) / userStats.averagePrice) * 100).toFixed(1)}%
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">DCA Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-slate-400 mb-1">
                        <span>Portfolio Progress</span>
                        <span>{Math.min(100, (userStats.totalBTC * 100)).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={Math.min(100, userStats.totalBTC * 100)} 
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-slate-400 mb-1">
                        <span>Consistency Score</span>
                        <span>{Math.min(100, userStats.weekStreak * 2)}%</span>
                      </div>
                      <Progress 
                        value={Math.min(100, userStats.weekStreak * 2)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-orange-500" />
                  Your Bitcoin Dad Achievements
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Unlock badges as you progress on your Bitcoin journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => {
                    const isUnlocked = userStats.unlockedAchievements.some(a => a.id === achievement.id);
                    const IconComponent = achievement.icon;
                    
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border transition-all ${
                          isUnlocked 
                            ? 'bg-slate-700 border-orange-500 shadow-lg shadow-orange-500/20' 
                            : 'bg-slate-800 border-slate-600 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isUnlocked ? 'bg-orange-500' : 'bg-slate-600'
                          }`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                              {achievement.name}
                            </h3>
                            {isUnlocked && (
                              <Badge className="bg-orange-500 text-white text-xs">Unlocked!</Badge>
                            )}
                          </div>
                        </div>
                        <p className={`text-sm ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Achievement Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-1">
                      <span>Achievements Unlocked</span>
                      <span>{userStats.unlockedAchievements.length}/{achievements.length}</span>
                    </div>
                    <Progress 
                      value={(userStats.unlockedAchievements.length / achievements.length) * 100} 
                      className="h-3"
                    />
                  </div>
                  <p className="text-slate-400 text-sm">
                    Keep stacking to unlock more achievements and climb the leaderboard!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-orange-500" />
                  Bitcoin Dad Leaderboard
                </CardTitle>
                <CardDescription className="text-slate-400">
                  See how you stack up against other Bitcoin dads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboardData.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        user.rank <= 3 
                          ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30' 
                          : 'bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-black' :
                          user.rank === 2 ? 'bg-gray-400 text-black' :
                          user.rank === 3 ? 'bg-orange-600 text-white' :
                          'bg-slate-600 text-white'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-sm text-slate-400">
                            {user.weekStreak} week streak • {user.achievements} achievements
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-500 font-bold">{formatBTC(user.btcAmount)}</p>
                        <p className="text-sm text-slate-400">
                          {formatCurrency(user.btcAmount * mockBitcoinPrice[currency])}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Your Ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">Keep Stacking!</p>
                  <p className="text-slate-400 mb-4">
                    You need {formatBTC(0.1 - userStats.totalBTC)} more Bitcoin to enter the leaderboard
                  </p>
                  <Button 
                    onClick={() => setActiveTab('tracker')}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Add Purchase
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-500" />
                  Bitcoin Dad Community
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Connect with fellow Bitcoin dads building generational wealth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <p className="text-2xl font-bold text-orange-500">2,847</p>
                    <p className="text-slate-400">Active Members</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <p className="text-2xl font-bold text-green-500">₿47.2</p>
                    <p className="text-slate-400">Total Stacked</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <p className="text-2xl font-bold text-blue-500">156</p>
                    <p className="text-slate-400">Countries</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={() => window.open('https://discord.gg/bitcoinreserve', '_blank')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Discord Community
                  </Button>
                  
                  <Button 
                    onClick={() => window.open('https://bitcoinreserve.com/wife-script', '_blank')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Get the Wife Script
                  </Button>
                  
                  <Button 
                    onClick={() => window.open('https://bitcoinreserve.com/story', '_blank')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                  >
                    <Bitcoin className="w-4 h-4 mr-2" />
                    Read Our Origin Story
                  </Button>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Weekly Challenge</h3>
                  <p className="text-slate-300 mb-3">
                    Stack sats for 7 consecutive days and earn the "Consistency Champion" badge!
                  </p>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Progress: 3/7 days</span>
                    <span>Ends in 4 days</span>
                  </div>
                  <Progress value={43} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-slate-400 mb-4">
              Building generational wealth, one satoshi at a time.
            </p>
            <div className="flex justify-center space-x-6">
              <Button 
                variant="ghost" 
                onClick={() => window.open('https://bitcoinreserve.com', '_blank')}
                className="text-slate-400 hover:text-white"
              >
                Bitcoin Reserve
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.open('https://bitcoinreserve.com/privacy', '_blank')}
                className="text-slate-400 hover:text-white"
              >
                Privacy Policy
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.open('https://bitcoinreserve.com/terms', '_blank')}
                className="text-slate-400 hover:text-white"
              >
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

