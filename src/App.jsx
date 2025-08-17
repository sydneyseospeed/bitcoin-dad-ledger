import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Bitcoin, TrendingUp, DollarSign, Target, Calendar, Download, Users, ArrowUp, ArrowDown } from 'lucide-react'
import './App.css'
import logoSvg from './assets/Logotype.svg'

// Sample DCA data - in production this would come from API/CSV
const dcaData = [
  { date: '2024-01-15', source: 'Bitaroo', audAmount: 500, btcReceived: 0.01234567, pricePerBtc: 40500 },
  { date: '2024-01-22', source: 'Swyftx', audAmount: 500, btcReceived: 0.01198765, pricePerBtc: 41700 },
  { date: '2024-01-29', source: 'Bitaroo', audAmount: 500, btcReceived: 0.01156789, pricePerBtc: 43200 },
  { date: '2024-02-05', source: 'Swyftx', audAmount: 500, btcReceived: 0.01089123, pricePerBtc: 45900 },
  { date: '2024-02-12', source: 'Bitaroo', audAmount: 500, btcReceived: 0.01045678, pricePerBtc: 47800 },
  { date: '2024-02-19', source: 'Swyftx', audAmount: 500, btcReceived: 0.00987654, pricePerBtc: 50600 },
  { date: '2024-02-26', source: 'Bitaroo', audAmount: 500, btcReceived: 0.00934567, pricePerBtc: 53500 },
  { date: '2024-03-05', source: 'Swyftx', audAmount: 500, btcReceived: 0.00876543, pricePerBtc: 57000 },
  { date: '2024-03-12', source: 'Bitaroo', audAmount: 500, btcReceived: 0.00823456, pricePerBtc: 60700 },
  { date: '2024-03-19', source: 'Swyftx', audAmount: 500, btcReceived: 0.00789123, pricePerBtc: 63400 },
  { date: '2024-03-26', source: 'Bitaroo', audAmount: 500, btcReceived: 0.00756789, pricePerBtc: 66100 },
  { date: '2024-04-02', source: 'Swyftx', audAmount: 500, btcReceived: 0.00723456, pricePerBtc: 69200 },
  { date: '2024-04-09', source: 'Bitaroo', audAmount: 500, btcReceived: 0.00698765, pricePerBtc: 71500 },
  { date: '2024-04-16', source: 'Swyftx', audAmount: 500, btcReceived: 0.00667890, pricePerBtc: 74900 },
  { date: '2024-04-23', source: 'Bitaroo', audAmount: 500, btcReceived: 0.00634567, pricePerBtc: 78800 },
  { date: '2024-04-30', source: 'Swyftx', audAmount: 500, btcReceived: 0.00612345, pricePerBtc: 81700 },
  { date: '2024-05-07', source: 'Bitaroo', audAmount: 500, btcReceived: 0.00589123, pricePerBtc: 84900 },
  { date: '2024-05-14', source: 'Swyftx', audAmount: 500, btcReceived: 0.00567890, pricePerBtc: 88100 },
  { date: '2024-05-21', source: 'Bitaroo', audAmount: 500, btcReceived: 0.00545678, pricePerBtc: 91600 },
  { date: '2024-05-28', source: 'Swyftx', audAmount: 500, btcReceived: 0.00523456, pricePerBtc: 95500 }
]

function App() {
  const [btcPrice, setBtcPrice] = useState(98750) // Current BTC price in AUD
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })

  // Calculate summary metrics
  const totalAudInvested = dcaData.reduce((sum, entry) => sum + entry.audAmount, 0)
  const totalBtcStacked = dcaData.reduce((sum, entry) => sum + entry.btcReceived, 0)
  const averageCostBasis = totalAudInvested / totalBtcStacked
  const currentPortfolioValue = totalBtcStacked * btcPrice
  const unrealisedGainLoss = ((currentPortfolioValue - totalAudInvested) / totalAudInvested) * 100

  // Fetch BTC price (mock implementation)
  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        // In production, use mempool.space API or similar
        // const response = await fetch('https://mempool.space/api/v1/prices')
        // const data = await response.json()
        // setBtcPrice(data.AUD)
        
        // Mock price updates for demo
        const mockPrice = 98750 + (Math.random() - 0.5) * 1000
        setBtcPrice(mockPrice)
      } catch (error) {
        console.error('Error fetching BTC price:', error)
      }
    }

    fetchBtcPrice()
    const interval = setInterval(fetchBtcPrice, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Sort function
  const sortedData = [...dcaData].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
  })

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  // Chart data
  const chartData = dcaData.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }),
    price: entry.pricePerBtc,
    btc: entry.btcReceived
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logoSvg} alt="Bitcoin Reserve" className="h-8 w-auto" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="https://bitcoinreserve.bio" className="text-slate-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </a>
                <a href="#metrics" className="text-slate-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Metrics
                </a>
                <a href="#ledger" className="text-slate-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Ledger
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The <span className="text-orange-400">Bitcoin Dad Ledger</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              One dad. Two sons. Stacking every week... no matter what.
            </p>
            
            {/* Live BTC Price */}
            <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl p-6 border border-orange-500/30 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <Bitcoin className="h-8 w-8 text-orange-400" />
                <div>
                  <p className="text-sm text-slate-400">Live BTC Price (AUD)</p>
                  <p className="text-2xl font-bold text-white">
                    ${btcPrice.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="text-green-400">
                  <ArrowUp className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Metrics */}
      <section id="metrics" className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Proof-of-Work Metrics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Total AUD Invested
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ${totalAudInvested.toLocaleString('en-AU')}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                  <Bitcoin className="h-4 w-4 mr-2" />
                  Total BTC Stacked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">
                  {totalBtcStacked.toFixed(8)} BTC
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Average Cost Basis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ${averageCostBasis.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ${currentPortfolioValue.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                  {unrealisedGainLoss >= 0 ? <ArrowUp className="h-4 w-4 mr-2" /> : <ArrowDown className="h-4 w-4 mr-2" />}
                  Unrealised Gain/Loss
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${unrealisedGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {unrealisedGainLoss >= 0 ? '+' : ''}{unrealisedGainLoss.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* BTC Price Chart */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">DCA Timeline</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">BTC Price Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
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
                      dataKey="price" 
                      stroke="#F97316" 
                      strokeWidth={2}
                      dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">BTC Accumulated</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
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
                    <Bar dataKey="btc" fill="#F97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* DCA Table */}
      <section id="ledger" className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">DCA Transaction Ledger</h2>
          
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead 
                        className="text-slate-300 cursor-pointer hover:text-orange-400"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Date
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-slate-300 cursor-pointer hover:text-orange-400"
                        onClick={() => handleSort('source')}
                      >
                        Source
                      </TableHead>
                      <TableHead 
                        className="text-slate-300 cursor-pointer hover:text-orange-400"
                        onClick={() => handleSort('audAmount')}
                      >
                        AUD Amount
                      </TableHead>
                      <TableHead 
                        className="text-slate-300 cursor-pointer hover:text-orange-400"
                        onClick={() => handleSort('btcReceived')}
                      >
                        BTC Received
                      </TableHead>
                      <TableHead 
                        className="text-slate-300 cursor-pointer hover:text-orange-400"
                        onClick={() => handleSort('pricePerBtc')}
                      >
                        Price per BTC
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedData.map((entry, index) => (
                      <TableRow key={index} className="border-slate-700 hover:bg-slate-800/50">
                        <TableCell className="text-slate-300">
                          {new Date(entry.date).toLocaleDateString('en-AU')}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.source === 'Bitaroo' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {entry.source}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          ${entry.audAmount.toLocaleString('en-AU')}
                        </TableCell>
                        <TableCell className="text-orange-400 font-mono">
                          {entry.btcReceived.toFixed(8)}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          ${entry.pricePerBtc.toLocaleString('en-AU')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl p-8 md:p-12 border border-orange-500/30">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Join the Bitcoin Dad Mission
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Every week, no matter what. Building generational wealth, one satoshi at a time.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6">
                    <Download className="h-12 w-12 text-orange-400 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold text-white mb-3">Get the Bitcoin Dad Handbook</h3>
                    <p className="text-slate-300 mb-4">
                      Learn how to start your own DCA journey safely and effectively
                    </p>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                      Download Free
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6">
                    <Users className="h-12 w-12 text-orange-400 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold text-white mb-3">Join Bitcoin Dad Vault</h3>
                    <p className="text-slate-300 mb-4">
                      Private community of fathers building financial sovereignty
                    </p>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full">
                      Join Community
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Proof-of-Work Badge</h3>
                <p className="text-slate-300 mb-4">
                  {dcaData.length} consecutive weeks of DCA purchases. No matter the price. No matter the market. 
                  Building the foundation my sons will stand on.
                </p>
                <p className="text-orange-400 font-semibold">
                  "One block at a time. Proof-of-work for the people you love."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={logoSvg} alt="Bitcoin Reserve" className="h-8 w-auto mr-4" />
              <p className="text-slate-400">Building generational wealth, one block at a time.</p>
            </div>
            <div className="flex space-x-6">
              <a href="https://bitcoinreserve.bio" className="text-slate-400 hover:text-orange-400 transition-colors">
                Home
              </a>
              <a href="https://x.com/bitcoinreserve_" className="text-slate-400 hover:text-orange-400 transition-colors">
                Twitter
              </a>
              <a href="https://www.instagram.com/bitcoinreserve_/" className="text-slate-400 hover:text-orange-400 transition-colors">
                Instagram
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400">
              © 2025 Bitcoin Reserve. All rights reserved. Proof-of-work for the people you love.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
