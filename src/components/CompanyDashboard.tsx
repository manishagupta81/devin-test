import React, { useState } from 'react';
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
} from '@mui/icons-material';

const mockCompanyData = {
  ticker: 'AAPL',
  name: 'Apple Inc.',
  sector: 'Technology',
  industry: 'Consumer Electronics',
  marketCap: 2.89,
  price: 178.72,
  priceChange: 2.34,
  priceChangePercent: 1.33,
  volume: '52.3M',
  avgVolume: '58.2M',
  peRatio: 28.4,
  eps: 6.29,
  dividend: 0.96,
  dividendYield: 0.54,
  beta: 1.28,
  week52High: 199.62,
  week52Low: 143.90,
};

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

const mockRecentDocuments = [
  { id: '1', title: 'Q4 2024 Earnings Call Transcript', source: 'FactSet', type: 'transcript', date: '2024-01-25', sentiment: 0.72 },
  { id: '2', title: 'Apple: iPhone 16 Cycle Analysis', source: 'AlphaSense', type: 'research', date: '2024-01-24', sentiment: 0.65 },
  { id: '3', title: 'Management Meeting Notes - Tim Cook', source: 'Internal', type: 'note', date: '2024-01-23', sentiment: 0.58 },
  { id: '4', title: 'Expert Call: Supply Chain Deep Dive', source: 'ThirdBridge', type: 'expert', date: '2024-01-22', sentiment: 0.45 },
  { id: '5', title: 'Services Revenue Acceleration', source: 'Bloomberg', type: 'research', date: '2024-01-21', sentiment: 0.78 },
  { id: '6', title: 'China Market Risk Assessment', source: 'Internal', type: 'memo', date: '2024-01-20', sentiment: 0.32 },
];

const mockAlerts = [
  { id: '1', type: 'estimate', message: 'Q1 EPS estimate revised up by Goldman Sachs (+$0.05)', severity: 'info', time: '2 hours ago' },
  { id: '2', type: 'sentiment', message: 'Negative tone shift detected in recent analyst reports', severity: 'warning', time: '5 hours ago' },
  { id: '3', type: 'data', message: 'New 10-K filing available', severity: 'info', time: '1 day ago' },
  { id: '4', type: 'price', message: 'Stock crossed above 50-day moving average', severity: 'success', time: '1 day ago' },
  { id: '5', type: 'alternative', message: 'Job postings increased 15% MoM', severity: 'info', time: '2 days ago' },
];

const mockCompetitors = [
  { ticker: 'MSFT', name: 'Microsoft', price: 378.91, change: 1.2, marketCap: '2.81T' },
  { ticker: 'GOOGL', name: 'Alphabet', price: 141.80, change: -0.5, marketCap: '1.78T' },
  { ticker: 'AMZN', name: 'Amazon', price: 155.20, change: 0.8, marketCap: '1.61T' },
  { ticker: 'META', name: 'Meta', price: 384.27, change: 2.1, marketCap: '987B' },
  { ticker: 'NVDA', name: 'NVIDIA', price: 615.27, change: 3.5, marketCap: '1.52T' },
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

interface CompanyDashboardProps {
  selectedCompany?: string;
  onCompanySelect?: (ticker: string) => void;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ 
  selectedCompany = 'AAPL',
  onCompanySelect 
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              {mockCompanyData.ticker}
            </Typography>
            <Chip label={mockCompanyData.sector} size="small" color="primary" variant="outlined" />
            <IconButton size="small">
              <Star sx={{ color: '#ffc107' }} />
            </IconButton>
          </Box>
          <Typography variant="h6" color="text.secondary">
            {mockCompanyData.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mockCompanyData.industry}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
            <Typography variant="h4" fontWeight="bold">
              ${mockCompanyData.price.toFixed(2)}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: mockCompanyData.priceChange >= 0 ? '#4caf50' : '#f44336' 
            }}>
              {mockCompanyData.priceChange >= 0 ? <TrendingUp /> : <TrendingDown />}
              <Typography variant="body1" fontWeight="medium">
                {mockCompanyData.priceChange >= 0 ? '+' : ''}{mockCompanyData.priceChange.toFixed(2)} ({mockCompanyData.priceChangePercent.toFixed(2)}%)
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Market Cap: ${mockCompanyData.marketCap}T | Vol: {mockCompanyData.volume}
          </Typography>
        </Box>
      </Box>

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
                  <Tab label="All Documents" />
                  <Tab label="Transcripts" />
                  <Tab label="Research" />
                  <Tab label="Internal Notes" />
                  <Tab label="Expert Calls" />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
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
                      {mockRecentDocuments.map((doc) => (
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
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Typography color="text.secondary">Transcript documents will be displayed here</Typography>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Typography color="text.secondary">Research documents will be displayed here</Typography>
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <Typography color="text.secondary">Internal notes will be displayed here</Typography>
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <Typography color="text.secondary">Expert call transcripts will be displayed here</Typography>
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

          {/* Competitors */}
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
                    {mockCompetitors.map((comp) => (
                      <TableRow 
                        key={comp.ticker} 
                        hover 
                        sx={{ cursor: 'pointer' }}
                        onClick={() => onCompanySelect?.(comp.ticker)}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {comp.ticker}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {comp.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          ${comp.price.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            sx={{ color: comp.change >= 0 ? '#4caf50' : '#f44336' }}
                          >
                            {comp.change >= 0 ? '+' : ''}{comp.change}%
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
                    onClick={() => onCompanySelect?.(company.ticker)}
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

export default CompanyDashboard;
