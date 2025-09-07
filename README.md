# Bitcoin Dad Ledger - Complete Bitcoin DCA Portfolio Tracker
### API Integrations
- **CoinGecko API**: `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=aud&include_24hr_change=true`
- **Update Frequency**: Every 30 seconds for live price tracking
- **Error Handling**: Graceful fallback when API unavailable

## 💾 Data Models

### Transaction Structure
```javascript
{
    date: '2025-08-13',
    localTime: '13/08/2025',
    amount: 200,              // AUD invested
    btcReceived: 0.0010814,   // BTC received (8 decimals)
    rate: 185834,             // AUD/BTC rate
    status: 'PROCESSED',      // Transaction status
    source: 'Swyftx',         // Exchange source
    orderId: 'SWY-001'        // Unique identifier
}
```

### Achievement Structure
```javascript
{
    id: 'diamond_hands',
    title: 'Diamond Hands 💎🙌',
    description: 'Held through a -20% price drop',
    icon: 'fa-gem',
    condition: (data) => data.maxDrawdown >= 20,
    category: 'resilience',
    unlocked: boolean,
    progress: number          // 0-100 percentage
}
```

