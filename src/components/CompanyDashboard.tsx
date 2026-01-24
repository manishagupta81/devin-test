import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  SelectChangeEvent,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Search,
  NotificationsActive,
  Description,
  Assessment,
  People,
  Warning,
  CheckCircle,
  Info,
  OpenInNew,
  Star,
  StarBorder,
  FilterList,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  ShowChart,
  CandlestickChart,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  ReferenceLine,
} from 'recharts';
import yahooFinanceService, { StockQuote, HistoricalDataPoint } from '../services/yahooFinance';

// Synthetic documents data
const syntheticDocuments = [
  { id: '1', title: 'Q4 2024 Earnings Call Transcript', source: 'FactSet', type: 'transcript', date: '2024-01-25', sentiment: 0.72, ticker: 'AAPL', content: 'Strong iPhone sales drove revenue growth...' },
  { id: '2', title: 'Apple: iPhone 16 Cycle Analysis', source: 'AlphaSense', type: 'research', date: '2024-01-24', sentiment: 0.65, ticker: 'AAPL', content: 'The iPhone 16 cycle shows promising early indicators...' },
  { id: '3', title: 'Management Meeting Notes - Tim Cook', source: 'Internal', type: 'note', date: '2024-01-23', sentiment: 0.58, ticker: 'AAPL', content: 'Key takeaways from the management meeting...' },
  { id: '4', title: 'Expert Call: Supply Chain Deep Dive', source: 'ThirdBridge', type: 'expert', date: '2024-01-22', sentiment: 0.45, ticker: 'AAPL', content: 'Supply chain expert discusses component availability...' },
  { id: '5', title: 'Services Revenue Acceleration', source: 'Bloomberg', type: 'research', date: '2024-01-21', sentiment: 0.78, ticker: 'AAPL', content: 'Apple Services segment continues to outperform...' },
  { id: '6', title: 'China Market Risk Assessment', source: 'Internal', type: 'memo', date: '2024-01-20', sentiment: 0.32, ticker: 'AAPL', content: 'Analysis of regulatory and competitive risks in China...' },
  { id: '7', title: 'Microsoft Cloud Growth Analysis', source: 'FactSet', type: 'research', date: '2024-01-24', sentiment: 0.81, ticker: 'MSFT', content: 'Azure continues to gain market share...' },
  { id: '8', title: 'NVIDIA AI Chip Demand Report', source: 'AlphaSense', type: 'research', date: '2024-01-23', sentiment: 0.89, ticker: 'NVDA', content: 'H100 demand remains extremely strong...' },
  { id: '9', title: 'Google Search Market Share Update', source: 'Bloomberg', type: 'research', date: '2024-01-22', sentiment: 0.52, ticker: 'GOOGL', content: 'Search market share faces pressure from AI alternatives...' },
  { id: '10', title: 'Amazon AWS Pricing Analysis', source: 'Internal', type: 'note', date: '2024-01-21', sentiment: 0.61, ticker: 'AMZN', content: 'Competitive pricing dynamics in cloud infrastructure...' },
];

const mockMetrics = [
  { label: 'Revenue (TTM)', value: '$383.3B', change: 2.8, source: 'FactSet' },
  { label: 'EPS (TTM)', value: '$6.29', change: 5.2, source: 'Bloomberg' },
  { label: 'Gross Margin', value: '44.1%', change: -0.3, source: 'FactSet' },
  { label: 'Operating Margin', value: '29.8%', change: 1.1, source: 'FactSet' },
  { label: 'FCF (TTM)', value: '$99.6B', change: 8.4, source: 'Bloomberg' },
  { label: 'ROE', value: '147.3%', change: 12.1, source: 'FactSet' },
];

const mockConsensus = {
  rating: 'Buy',
  targetPrice: 195.50,
  targetPriceHigh: 220.00,
  targetPriceLow: 160.00,
  numAnalysts: 42,
  buyRatings: 28,
  holdRatings: 12,
  sellRatings: 2,
  epsEstimateQ1: 1.52,
  epsEstimateQ2: 1.38,
  revenueEstimateQ1: 90.2,
  revenueEstimateQ2: 85.5,
};

const mockAlerts = [
  { id: '1', type: 'estimate', message: 'Q1 EPS estimate revised up by Goldman Sachs (+$0.05)', severity: 'info', time: '2 hours ago' },
  { id: '2', type: 'sentiment', message: 'Negative tone shift detected in recent analyst reports', severity: 'warning', time: '5 hours ago' },
  { id: '3', type: 'data', message: 'New 10-K filing available', severity: 'info', time: '1 day ago' },
  { id: '4', type: 'price', message: 'Stock crossed above 50-day moving average', severity: 'success', time: '1 day ago' },
  { id: '5', type: 'alternative', message: 'Job postings increased 15% MoM', severity: 'info', time: '2 days ago' },
];

const mockSentimentHistory = [
  { period: 'Q4 2023', score: 0.65, label: 'Positive' },
  { period: 'Q1 2024', score: 0.58, label: 'Neutral' },
  { period: 'Q2 2024', score: 0.72, label: 'Positive' },
  { period: 'Q3 2024', score: 0.68, label: 'Positive' },
  { period: 'Q4 2024', score: 0.71, label: 'Positive' },
];

const mockCoverageUniverse = [
  { ticker: 'AAPL', name: 'Apple Inc.', priority: 'core', lastViewed: '2 hours ago' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', priority: 'core', lastViewed: '1 day ago' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', priority: 'core', lastViewed: '3 days ago' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', priority: 'secondary', lastViewed: '1 week ago' },
  { ticker: 'AMD', name: 'AMD Inc.', priority: 'watchlist', lastViewed: '2 weeks ago' },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const getSentimentColor = (score: number) => {
  if (score >= 0.6) return '#4caf50';
  if (score >= 0.4) return '#ff9800';
  return '#f44336';
};

const getSentimentLabel = (score: number) => {
  if (score >= 0.6) return 'Positive';
  if (score >= 0.4) return 'Neutral';
  return 'Negative';
};

const getAlertIcon = (severity: string) => {
  switch (severity) {
    case 'warning': return <Warning sx={{ color: '#ff9800' }} />;
    case 'success': return <CheckCircle sx={{ color: '#4caf50' }} />;
    default: return <Info sx={{ color: '#2196f3' }} />;
  }
};

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'transcript': return <Assessment />;
    case 'research': return <Description />;
    case 'expert': return <People />;
    default: return <Description />;
  }
};

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toFixed(2)}`;
};

const formatVolume = (volume: number): string => {
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
  return volume.toString();
};

interface CompanyDashboardProps {
  selectedCompany?: string;
  onCompanySelect?: (ticker: string) => void;
}

type TimeRange = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y';

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ 
  selectedCompany: initialCompany = 'AAPL',
  onCompanySelect 
}) => {
  const [selectedTicker, setSelectedTicker] = useState(initialCompany);
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [competitors, setCompetitors] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  const availableSymbols = yahooFinanceService.getAvailableSymbols();

  // Fetch stock data when ticker changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const quote = await yahooFinanceService.getQuote(selectedTicker);
        setStockData(quote);

        // Fetch competitors
        const competitorSymbols = availableSymbols.filter(s => s !== selectedTicker).slice(0, 5);
        const competitorData = await yahooFinanceService.getQuotes(competitorSymbols);
        setCompetitors(competitorData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTicker]);

  // Fetch chart data when ticker or time range changes
  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true);
      try {
        const data = await yahooFinanceService.getHistoricalData(selectedTicker, timeRange);
        setChartData(data.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [selectedTicker, timeRange]);

  const handleTickerChange = (event: SelectChangeEvent<string>) => {
    const newTicker = event.target.value;
    setSelectedTicker(newTicker);
    onCompanySelect?.(newTicker);
  };

  const handleTimeRangeChange = (_event: React.MouseEvent<HTMLElement>, newRange: TimeRange | null) => {
    if (newRange) {
      setTimeRange(newRange);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCompanyClick = (ticker: string) => {
    setSelectedTicker(ticker);
    onCompanySelect?.(ticker);
  };

  // Filter documents based on selected ticker and search query
  const filteredDocuments = syntheticDocuments.filter(doc => {
    const matchesTicker = doc.ticker === selectedTicker;
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTicker && matchesSearch;
  });

  // Get documents by type for tabs
  const getDocumentsByType = (type: string | null) => {
    if (type === null) return filteredDocuments;
    return filteredDocuments.filter(doc => doc.type === type);
  };

  // Calculate price change color
  const priceChangeColor = stockData && stockData.regularMarketChange >= 0 ? '#4caf50' : '#f44336';

  // Format chart data for display
  const formattedChartData = chartData.map(d => ({
    ...d,
    displayDate: timeRange === '1D' 
      ? new Date(d.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  // Calculate chart min/max for better visualization
  const chartMin = chartData.length > 0 ? Math.min(...chartData.map(d => d.low)) * 0.995 : 0;
  const chartMax = chartData.length > 0 ? Math.max(...chartData.map(d => d.high)) * 1.005 : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stockData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Unable to load stock data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Ticker</InputLabel>
              <Select
                value={selectedTicker}
                label="Ticker"
                onChange={handleTickerChange}
              >
                {availableSymbols.map(symbol => (
                  <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="h4" fontWeight="bold">
              {stockData.symbol}
            </Typography>
            <Chip label={stockData.sector || 'Technology'} size="small" color="primary" variant="outlined" />
            <IconButton size="small">
              <Star sx={{ color: '#ffc107' }} />
            </IconButton>
          </Box>
          <Typography variant="h6" color="text.secondary">
            {stockData.longName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stockData.industry || 'Consumer Electronics'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
            <Typography variant="h4" fontWeight="bold">
              ${stockData.regularMarketPrice.toFixed(2)}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: priceChangeColor
            }}>
              {stockData.regularMarketChange >= 0 ? <TrendingUp /> : <TrendingDown />}
              <Typography variant="body1" fontWeight="medium">
                {stockData.regularMarketChange >= 0 ? '+' : ''}{stockData.regularMarketChange.toFixed(2)} ({stockData.regularMarketChangePercent.toFixed(2)}%)
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Market Cap: {formatMarketCap(stockData.marketCap)} | Vol: {formatVolume(stockData.regularMarketVolume)}
          </Typography>
        </Box>
      </Box>

      {/* Stock Price Chart - Google Finance Style */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Price Chart
              </Typography>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={(_, value) => value && setChartType(value)}
                size="small"
              >
                <ToggleButton value="area">
                  <ShowChart fontSize="small" />
                </ToggleButton>
                <ToggleButton value="line">
                  <CandlestickChart fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              size="small"
            >
              <ToggleButton value="1D">1D</ToggleButton>
              <ToggleButton value="5D">5D</ToggleButton>
              <ToggleButton value="1M">1M</ToggleButton>
              <ToggleButton value="3M">3M</ToggleButton>
              <ToggleButton value="6M">6M</ToggleButton>
              <ToggleButton value="1Y">1Y</ToggleButton>
              <ToggleButton value="5Y">5Y</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          {chartLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'area' ? (
                <AreaChart data={formattedChartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={priceChangeColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={priceChangeColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="displayDate" 
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[chartMin, chartMax]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0' }}
                  />
                  <ReferenceLine y={stockData.regularMarketPrice - stockData.regularMarketChange} stroke="#999" strokeDasharray="5 5" />
                  <Area
                    type="monotone" 
                    dataKey="close" 
                    stroke={priceChangeColor}
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              ) : (
                <LineChart data={formattedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="displayDate" 
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[chartMin, chartMax]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0' }}
                  />
                  <ReferenceLine y={stockData.regularMarketPrice - stockData.regularMarketChange} stroke="#999" strokeDasharray="5 5" />
                  <Line
                    type="monotone" 
                    dataKey="close" 
                    stroke={priceChangeColor}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}

          {/* Volume Chart */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Volume</Typography>
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={formattedChartData}>
                <XAxis dataKey="displayDate" hide />
                <YAxis hide />
                <Bar dataKey="volume" fill="#90caf9" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search across all documents, transcripts, and research for this company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': { 
              backgroundColor: 'white',
              borderRadius: 2,
            } 
          }}
        />
      </Box>

      {/* Main Dashboard Layout */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Left Column - Key Metrics & Documents */}
        <Box sx={{ flex: '1 1 65%', minWidth: 400 }}>
          {/* Key Metrics */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Key Metrics
                </Typography>
                <Box>
                  <Tooltip title="Refresh data">
                    <IconButton size="small">
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Filter">
                    <IconButton size="small">
                      <FilterList />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {mockMetrics.map((metric, index) => (
                  <Box key={index} sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 150 }}>
                    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {metric.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {metric.value}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: metric.change >= 0 ? '#4caf50' : '#f44336',
                          fontSize: '0.75rem'
                        }}>
                          {metric.change >= 0 ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
                          {Math.abs(metric.change)}%
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Source: {metric.source}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Consensus Estimates */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Consensus Estimates
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 30%', minWidth: 150 }}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e9', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {mockConsensus.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Consensus Rating
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        {mockConsensus.buyRatings} Buy | {mockConsensus.holdRatings} Hold | {mockConsensus.sellRatings} Sell
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ flex: '1 1 30%', minWidth: 150 }}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight="bold">
                      ${mockConsensus.targetPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price Target (Avg)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Range: ${mockConsensus.targetPriceLow} - ${mockConsensus.targetPriceHigh}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: '1 1 30%', minWidth: 150 }}>
                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                      EPS Estimates
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Q1 2025:</Typography>
                      <Typography variant="body2" fontWeight="bold">${mockConsensus.epsEstimateQ1}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Q2 2025:</Typography>
                      <Typography variant="body2" fontWeight="bold">${mockConsensus.epsEstimateQ2}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Documents Section with Tabs */}
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label={`All Documents (${getDocumentsByType(null).length})`} />
                  <Tab label={`Transcripts (${getDocumentsByType('transcript').length})`} />
                  <Tab label={`Research (${getDocumentsByType('research').length})`} />
                  <Tab label={`Internal Notes (${getDocumentsByType('note').length + getDocumentsByType('memo').length})`} />
                  <Tab label={`Expert Calls (${getDocumentsByType('expert').length})`} />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <DocumentTable documents={getDocumentsByType(null)} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <DocumentTable documents={getDocumentsByType('transcript')} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <DocumentTable documents={getDocumentsByType('research')} />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <DocumentTable documents={[...getDocumentsByType('note'), ...getDocumentsByType('memo')]} />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <DocumentTable documents={getDocumentsByType('expert')} />
              </TabPanel>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Alerts, Sentiment, Competitors */}
        <Box sx={{ flex: '1 1 30%', minWidth: 300 }}>
          {/* Alerts Panel */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Alerts
                </Typography>
                <Chip 
                  icon={<NotificationsActive sx={{ fontSize: 16 }} />} 
                  label={mockAlerts.length} 
                  size="small" 
                  color="primary" 
                />
              </Box>
              <List dense>
                {mockAlerts.map((alert) => (
                  <ListItem key={alert.id} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getAlertIcon(alert.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {alert.message}
                        </Typography>
                      }
                      secondary={alert.time}
                    />
                  </ListItem>
                ))}
              </List>
              <Button variant="outlined" fullWidth size="small" sx={{ mt: 1 }}>
                Configure Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Sentiment Trend */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Sentiment Trend
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Current Sentiment</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: getSentimentColor(0.71) }}>
                    Positive (0.71)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={71} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getSentimentColor(0.71),
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                Historical Trend
              </Typography>
              {mockSentimentHistory.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.period}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 4, 
                      backgroundColor: '#e0e0e0', 
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        width: `${item.score * 100}%`, 
                        height: '100%', 
                        backgroundColor: getSentimentColor(item.score),
                        borderRadius: 2
                      }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: getSentimentColor(item.score), minWidth: 50 }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Competitors - Now with real data */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Competitors
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticker</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Change</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {competitors.map((comp) => (
                      <TableRow 
                        key={comp.symbol} 
                        hover 
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleCompanyClick(comp.symbol)}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {comp.symbol}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {comp.shortName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          ${comp.regularMarketPrice.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            sx={{ color: comp.regularMarketChangePercent >= 0 ? '#4caf50' : '#f44336' }}
                          >
                            {comp.regularMarketChangePercent >= 0 ? '+' : ''}{comp.regularMarketChangePercent.toFixed(2)}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Coverage Universe */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                My Coverage Universe
              </Typography>
              <List dense>
                {mockCoverageUniverse.map((company) => (
                  <ListItem 
                    key={company.ticker} 
                    sx={{ px: 0, cursor: 'pointer' }}
                    onClick={() => handleCompanyClick(company.ticker)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        fontSize: '0.75rem',
                        backgroundColor: company.priority === 'core' ? 'primary.main' : 
                                        company.priority === 'secondary' ? 'secondary.main' : 'grey.400'
                      }}>
                        {company.ticker.substring(0, 2)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {company.ticker}
                          </Typography>
                          <Chip 
                            label={company.priority} 
                            size="small" 
                            sx={{ 
                              height: 18, 
                              fontSize: '0.65rem',
                              backgroundColor: company.priority === 'core' ? '#e3f2fd' : 
                                              company.priority === 'secondary' ? '#fff3e0' : '#f5f5f5'
                            }} 
                          />
                        </Box>
                      }
                      secondary={`Last viewed: ${company.lastViewed}`}
                    />
                    <IconButton size="small">
                      {company.priority === 'core' ? <Star sx={{ color: '#ffc107', fontSize: 18 }} /> : <StarBorder sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Button variant="outlined" fullWidth size="small" sx={{ mt: 1 }}>
                Manage Coverage
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

// Document Table Component
interface DocumentTableProps {
  documents: typeof syntheticDocuments;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No documents found</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Document</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Sentiment</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id} hover sx={{ cursor: 'pointer' }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getDocumentIcon(doc.type)}
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {doc.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={doc.source} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 6, 
                      backgroundColor: '#e0e0e0', 
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        width: `${doc.sentiment * 100}%`, 
                        height: '100%', 
                        backgroundColor: getSentimentColor(doc.sentiment),
                        borderRadius: 3
                      }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: getSentimentColor(doc.sentiment) }}>
                      {getSentimentLabel(doc.sentiment)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <OpenInNew fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button variant="text" color="primary">
          View All Documents
        </Button>
      </Box>
    </>
  );
};

export default CompanyDashboard;
