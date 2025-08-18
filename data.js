// Bitcoin DCA Data Processing
// Complete transaction history from Swyftx and Bitaroo (23/11/2024 - 13/08/2025)

// Prevent redeclaration
if (typeof swyftxData !== 'undefined') {
    console.warn('Data already loaded, skipping redeclaration');
} else {

// Swyftx transactions ($3800 total)
const swyftxData = [
    {
        date: '2025-08-13',
        localTime: '13/08/2025',
        amount: 200,
        btcReceived: 0.0010814,
        rate: 185834,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-001'
    },
    {
        date: '2025-08-06',
        localTime: '06/08/2025',
        amount: 100,
        btcReceived: 0.0005668,
        rate: 175370.05,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-002'
    },
    {
        date: '2025-07-31',
        localTime: '31/07/2025',
        amount: 200,
        btcReceived: 0.0010737,
        rate: 184524.26,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-003'
    },
    {
        date: '2025-07-30',
        localTime: '30/07/2025',
        amount: 50,
        btcReceived: 0.0002723,
        rate: 183005.05,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-004'
    },
    {
        date: '2025-07-27',
        localTime: '27/07/2025',
        amount: 100,
        btcReceived: 0.0005533,
        rate: 180619.55,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-005'
    },
    {
        date: '2025-07-23',
        localTime: '23/07/2025',
        amount: 50,
        btcReceived: 0.0002045,
        rate: 185779.326,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-006'
    },
    {
        date: '2025-07-20',
        localTime: '20/07/2025',
        amount: 100,
        btcReceived: 0.0005456,
        rate: 181764.79,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-007'
    },
    {
        date: '2025-07-19',
        localTime: '19/07/2025',
        amount: 100,
        btcReceived: 0.0005403,
        rate: 182041.205,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-008'
    },
    {
        date: '2025-07-18',
        localTime: '18/07/2025',
        amount: 100,
        btcReceived: 0.0005619,
        rate: 177360.14,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-009'
    },
    {
        date: '2025-07-17',
        localTime: '17/07/2025',
        amount: 49.1,
        btcReceived: 0.0002537,
        rate: 165066.085,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-010'
    },
    {
        date: '2025-07-16',
        localTime: '16/07/2025',
        amount: 100,
        btcReceived: 0.0005313,
        rate: 184800.04,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-011'
    },
    {
        date: '2025-07-15',
        localTime: '15/07/2025',
        amount: 50,
        btcReceived: 0.0003026,
        rate: 162278.846,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-012'
    },
    {
        date: '2025-07-13',
        localTime: '13/07/2025',
        amount: 50,
        btcReceived: 0.0003079,
        rate: 161368.817,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-013'
    },
    {
        date: '2025-07-11',
        localTime: '11/07/2025',
        amount: 200,
        btcReceived: 0.0011589,
        rate: 173489.526,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-014'
    },
    {
        date: '2025-07-10',
        localTime: '10/07/2025',
        amount: 200,
        btcReceived: 0.0011449,
        rate: 173568.955,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-015'
    },
    {
        date: '2025-07-10',
        localTime: '10/07/2025',
        amount: 200,
        btcReceived: 0.0011811,
        rate: 168287.91,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-017'
    },
    {
        date: '2025-07-03',
        localTime: '03/07/2025',
        amount: 50,
        btcReceived: 0.0003042,
        rate: 165433.229,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-018'
    },
    {
        date: '2025-07-03',
        localTime: '03/07/2025',
        amount: 50,
        btcReceived: 0.0002959,
        rate: 167930.626,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-019'
    },
    {
        date: '2025-06-28',
        localTime: '28/06/2025',
        amount: 50,
        btcReceived: 0.0002242,
        rate: 159939.936,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-020'
    },
    {
        date: '2025-06-22',
        localTime: '22/06/2025',
        amount: 100,
        btcReceived: 0.0005739,
        rate: 163297.022,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-021'
    },
    {
        date: '2025-06-21',
        localTime: '21/06/2025',
        amount: 100,
        btcReceived: 0.0006104,
        rate: 162297.685,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-022'
    },
    {
        date: '2025-06-17',
        localTime: '17/06/2025',
        amount: 50,
        btcReceived: 0.0002537,
        rate: 165066.085,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-023'
    },
    {
        date: '2025-06-15',
        localTime: '15/06/2025',
        amount: 50,
        btcReceived: 0.0003026,
        rate: 162278.846,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-024'
    },
    {
        date: '2025-05-28',
        localTime: '28/05/2025',
        amount: 50,
        btcReceived: 0.0002242,
        rate: 159939.936,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-025'
    },
    {
        date: '2025-05-15',
        localTime: '15/05/2025',
        amount: 100,
        btcReceived: 0.0006102,
        rate: 161358.021,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-026'
    },
    {
        date: '2025-05-22',
        localTime: '22/05/2025',
        amount: 100,
        btcReceived: 0.0005739,
        rate: 169223.46,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-027'
    },
    {
        date: '2025-05-07',
        localTime: '07/05/2025',
        amount: 100,
        btcReceived: 0.0006466,
        rate: 149549.073,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-028'
    },
    {
        date: '2025-04-26',
        localTime: '26/04/2025',
        amount: 50,
        btcReceived: 0.0003303,
        rate: 149235.744,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-029'
    },
    {
        date: '2025-04-17',
        localTime: '17/04/2025',
        amount: 50,
        btcReceived: 0.0003241,
        rate: 149515.268,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-030'
    },
    {
        date: '2025-04-02',
        localTime: '02/04/2025',
        amount: 50,
        btcReceived: 0.0003623,
        rate: 162297.685,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-031'
    },
    {
        date: '2025-03-31',
        localTime: '31/03/2025',
        amount: 50,
        btcReceived: 0.0003358,
        rate: 129985.387,
        status: 'PROCESSED',
        source: 'Swyftx',
        orderId: 'SWY-032'
    }
];

// Bitaroo transactions ($1114.9 total) - from second screenshot
const bitarooData = [
    {
        date: '2025-03-14',
        localTime: '14/03/2025 0:01',
        amount: 48.05,
        btcReceived: 0.00035737,
        rate: 134454,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-001'
    },
    {
        date: '2025-03-04',
        localTime: '04/03/2025 22:56',
        amount: 98.05,
        btcReceived: 0.00071288,
        rate: 137540,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-002'
    },
    {
        date: '2025-03-02',
        localTime: '02/03/2025 4:48',
        amount: 98.05,
        btcReceived: 0.00070195,
        rate: 139681,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-003'
    },
    {
        date: '2025-02-27',
        localTime: '27/02/2025 13:36',
        amount: 48.05,
        btcReceived: 0.00035036,
        rate: 137143,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-004'
    },
    {
        date: '2025-02-20',
        localTime: '20/02/2025 6:31',
        amount: 48.05,
        btcReceived: 0.00031378,
        rate: 153130,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-005'
    },
    {
        date: '2025-02-14',
        localTime: '14/02/2025 3:38',
        amount: 48.05,
        btcReceived: 0.00031168,
        rate: 154162,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-006'
    },
    {
        date: '2025-02-11',
        localTime: '11/02/2025 4:37',
        amount: 48.05,
        btcReceived: 0.0003059,
        rate: 157073,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-007'
    },
    {
        date: '2025-02-05',
        localTime: '05/02/2025 23:08',
        amount: 48.05,
        btcReceived: 0.00030195,
        rate: 159131,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-008'
    },
    {
        date: '2025-02-01',
        localTime: '01/02/2025 17:12',
        amount: 48.05,
        btcReceived: 0.00028668,
        rate: 167604,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-009'
    },
    {
        date: '2025-01-22',
        localTime: '22/01/2025 14:00',
        amount: 48.05,
        btcReceived: 0.00028057,
        rate: 171255,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-010'
    },
    {
        date: '2025-01-21',
        localTime: '21/01/2025 13:13',
        amount: 98.05,
        btcReceived: 0.00059011,
        rate: 166154,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-011'
    },
    {
        date: '2025-01-16',
        localTime: '16/01/2025 3:09',
        amount: 48.05,
        btcReceived: 0.00029708,
        rate: 161736,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-012'
    },
    {
        date: '2025-01-10',
        localTime: '10/01/2025 18:29',
        amount: 48.05,
        btcReceived: 0.00030994,
        rate: 155027,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-013'
    },
    {
        date: '2025-01-01',
        localTime: '01/01/2025 3:45',
        amount: 48.05,
        btcReceived: 0.00030663,
        rate: 156703,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-014'
    },
    {
        date: '2024-12-26',
        localTime: '26/12/2024 2:44',
        amount: 48.05,
        btcReceived: 0.00029837,
        rate: 161040,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-015'
    },
    {
        date: '2024-12-22',
        localTime: '22/12/2024 15:39',
        amount: 48.05,
        btcReceived: 0.00030528,
        rate: 157392,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-016'
    },
    {
        date: '2024-11-27',
        localTime: '27/11/2024 23:54',
        amount: 98.05,
        btcReceived: 0.00067091,
        rate: 146143,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-017'
    },
    {
        date: '2024-11-23',
        localTime: '23/11/2024 17:29',
        amount: 98.05,
        btcReceived: 0.00064041,
        rate: 153105,
        status: 'PROCESSED',
        source: 'Bitaroo',
        orderId: 'BIT-018'
    }
];

// Combine all transactions
const allTransactions = [...swyftxData, ...bitarooData].sort((a, b) => new Date(b.date) - new Date(a.date));

// Calculate metrics
const calculateMetrics = (transactions) => {
    const totalInvested = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalBTC = transactions.reduce((sum, tx) => sum + tx.btcReceived, 0);
    const avgCostBasis = totalInvested / totalBTC;
    
    return {
        totalInvested: totalInvested.toFixed(2),
        totalBTC: totalBTC.toFixed(8),
        avgCostBasis: avgCostBasis.toFixed(0),
        transactionCount: transactions.length,
        dateRange: {
            start: '23/11/2024',
            end: '13/08/2025'
        }
    };
};

// Format currency
const formatCurrency = (amount) => {
    // Dynamically format currency based on selected currency stored in window.selectedCurrency.
    // Default to AUD if none is set.
    const currencyCode = window.selectedCurrency || 'AUD';
    let locale = 'en-AU';
    switch (currencyCode) {
        case 'USD':
            locale = 'en-US';
            break;
        case 'EUR':
            locale = 'de-DE'; // Commonly used locale for EUR formatting
            break;
        case 'GBP':
            locale = 'en-GB';
            break;
        default:
            locale = 'en-AU';
            break;
    }
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2
    }).format(amount);
};

// Format BTC
const formatBTC = (amount) => {
    return `₿ ${amount.toFixed(8)}`;
};

// Format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Export data for use in main.js
window.dcaTransactions = allTransactions;
window.calculateMetrics = calculateMetrics;
window.formatCurrency = formatCurrency;
window.formatBTC = formatBTC;
window.formatDate = formatDate;

} // End of data loading check