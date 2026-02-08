import React, { useState, useEffect, useContext } from 'react';
import { DashboardStateContext } from '../App';
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
  Paper,
  Grid,
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
  Timeline,
  Business,
  TrendingFlat,
  Circle,
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
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
} from 'recharts';
import yahooFinanceService, { StockQuote, HistoricalDataPoint } from '../services/yahooFinance';
import { generateCompanyIntelligence, generateMarketCommentary, generateInvestmentSummary, CompanyIntelligence } from '../services/openaiService';

// Company name mapping for OpenAI prompts
const companyNames: Record<string, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corporation',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com Inc.',
  META: 'Meta Platforms Inc.',
  NVDA: 'NVIDIA Corporation',
  AMD: 'Advanced Micro Devices Inc.',
};

// Key Leading Indicators Data
const keyLeadingIndicators = [
  {
    category: 'Backlog + Revenue Correlation',
    status: 'positive',
    items: [
      { label: 'Lead Time', value: '4 months' },
      { label: 'Correlation', value: '0.82 (Strong)' },
      { label: 'Implication', value: 'Current backlog strength suggests revenue upside in Q2/Q3' },
    ],
  },
  {
    category: 'Hiring Headcount',
    status: 'neutral',
    items: [
      { label: 'Engineering Jobs', value: '+12% QoQ' },
      { label: 'Sales Headcount', value: '+5% QoQ' },
      { label: 'Implication', value: 'Company investing for growth, confident in pipeline' },
    ],
  },
  {
    category: 'Alt-Soft Signals',
    status: 'positive',
    items: [
      { label: 'App Downloads', value: '+15% MoM' },
      { label: 'Web Traffic', value: '+8% MoM' },
      { label: 'Credit Card Data', value: '+6% (post-holiday)' },
      { label: 'Implication', value: 'Strong consumer demand, but seasonal decline expected' },
    ],
  },
];

// Commentary Synthesis Data
const commentarySynthesis = [
  {
    title: 'Strong Dealer Environment',
    confidence: 'High',
    source: 'Expert Network',
    date: '3 days ago',
    summary: 'Former Apple supply chain exec: "Inventory levels at all-time lows, demand for 5G premium tier remains very strong, particularly in the enterprise segment."',
    sentiment: 'positive',
  },
  {
    title: 'Strong Retail Demand',
    confidence: 'High',
    source: 'ThirdBridge',
    date: '1 week ago',
    summary: 'Store managers report ASP mix up 8% YoY. Pro models in 85% inventory. Customer trading up more than prior cycles.',
    sentiment: 'positive',
  },
  {
    title: 'Risk: China Competition',
    confidence: 'Medium',
    source: 'AlphaSense',
    date: '2 weeks ago',
    summary: 'Local competitors gaining share in $200-400 segment. Premium tier holding but mid-market pressure increasing.',
    sentiment: 'negative',
  },
  {
    title: 'Weak Supply Chain',
    confidence: 'Medium',
    source: 'Expert Network',
    date: '3 weeks ago',
    summary: 'OLED yield issues at LG Display running 5% below target 85%. Could constrain Pro Max availability in Q1.',
    sentiment: 'negative',
  },
];

// Management Tone Analysis
const managementToneAnalysis = [
  { category: 'Improving - Sentiment Score', value: 0.72, change: '+0.15 QoQ', trend: 'up' },
  { category: 'Positive - Services Growth', value: 0.85, description: 'Called out "accelerating" 2x in prepared remarks vs last quarter', trend: 'up' },
  { category: 'Mixed - China Commentary', value: 0.45, description: 'Acknowledged "macro headwinds" but emphasized premium positioning', trend: 'flat' },
  { category: 'Strong - Capex Guidance', value: 0.78, description: 'Raised FY24 capex to $15bn vs $12bn "AI infrastructure"', trend: 'up' },
];

// Competitive & Sell-Side Intelligence
const sellSideActivity = [
  { analyst: 'Goldman Sachs', action: 'Initiating coverage', rating: 'Buy', target: '$220', date: '2 days ago' },
  { analyst: 'Morgan Stanley', action: 'Reiterated', rating: 'Overweight', target: '$215', date: '1 week ago' },
  { analyst: 'JP Morgan', action: 'Price target raised', rating: 'Buy', target: '$210', date: '2 weeks ago' },
];

const competitorCommentary = [
  { company: 'Microsoft', sentiment: 'positive', note: 'Azure growth re-accelerating; AI monetization ahead of expectations' },
  { company: 'Google', sentiment: 'negative', note: 'Search share erosion concerns; AI integration slower than expected' },
  { company: 'Samsung', sentiment: 'neutral', note: 'Galaxy S24 launch solid but ASP pressure in mid-tier' },
];

// Investment Bottom Line
const investmentBottomLine = {
  summary: 'Synthesis: Multiple data points suggest Street estimates may be 5-8% too low for FY25.',
  keyPoints: [
    'Leading indicators positive: Backlog, alt-data, hiring all supportive of estimates. Under-appreciated AI services opportunity.',
    'Qualitative improving: Management tone up, expert sentiment bullish, sell-side positioning still conservative.',
    'Risk: China: The supply constraints and local share loss risk but offset by strength elsewhere, supply constraints manageable.',
  ],
  bottomLine: 'Maintain View: Estimates are beatable. Estimates +8% above Street consensus justified by data.',
};

// Data Quality Scores
const dataQualityScores = [
  { source: 'Alt Data', score: 85, color: '#4caf50' },
  { source: 'Management Commentary', score: 72, color: '#8bc34a' },
  { source: 'Competitor Intel', score: 68, color: '#cddc39' },
  { source: 'Sell-Side', score: 55, color: '#ffeb3b' },
];

// Management Earnings Call Analysis Data
const earningsCallTrend = [
  { quarter: 'Q1 2023', sentiment: 0.62, mentions: 45 },
  { quarter: 'Q2 2023', sentiment: 0.58, mentions: 52 },
  { quarter: 'Q3 2023', sentiment: 0.65, mentions: 48 },
  { quarter: 'Q4 2023', sentiment: 0.71, mentions: 61 },
  { quarter: 'Q1 2024', sentiment: 0.68, mentions: 55 },
  { quarter: 'Q2 2024', sentiment: 0.75, mentions: 67 },
  { quarter: 'Q3 2024', sentiment: 0.72, mentions: 58 },
  { quarter: 'Q4 2024', sentiment: 0.78, mentions: 72 },
];

const topicBreakdown = [
  { name: 'iPhone/Hardware', value: 35, color: '#1976d2' },
  { name: 'Services', value: 25, color: '#d32f2f' },
  { name: 'AI/ML', value: 20, color: '#388e3c' },
  { name: 'China/Macro', value: 12, color: '#f57c00' },
  { name: 'Other', value: 8, color: '#7b1fa2' },
];

// Revenue Estimates Comparison
const revenueEstimates = [
  { period: 'Q1 2024', street: 89.5, internal: 91.2, actual: 90.8 },
  { period: 'Q2 2024', street: 82.3, internal: 84.1, actual: 85.5 },
  { period: 'Q3 2024', street: 78.9, internal: 80.5, actual: 81.2 },
  { period: 'Q4 2024', street: 95.2, internal: 98.5, actual: null },
  { period: 'Q1 2025', street: 92.1, internal: 96.8, actual: null },
  { period: 'Q2 2025', street: 85.5, internal: 89.2, actual: null },
];

// Detailed Estimate Comparison
const detailedEstimates = [
  { metric: 'Revenue', q1_street: '$92.1B', q1_internal: '$96.8B', q2_street: '$85.5B', q2_internal: '$89.2B', variance: '+5.1%' },
  { metric: 'Gross Margin', q1_street: '45.2%', q1_internal: '45.8%', q2_street: '44.8%', q2_internal: '45.5%', variance: '+0.6pp' },
  { metric: 'EPS', q1_street: '$1.52', q1_internal: '$1.65', q2_street: '$1.38', q2_internal: '$1.48', variance: '+8.6%' },
  { metric: 'iPhone Units', q1_street: '48.2M', q1_internal: '51.5M', q2_street: '42.1M', q2_internal: '44.8M', variance: '+6.8%' },
  { metric: 'Services Rev', q1_street: '$23.5B', q1_internal: '$24.8B', q2_street: '$24.2B', q2_internal: '$25.5B', variance: '+5.5%' },
];

// Expert Network Intelligence
const expertSentimentByType = [
  { type: 'Supply Chain', positive: 65, neutral: 25, negative: 10 },
  { type: 'Retail Channel', positive: 72, neutral: 18, negative: 10 },
  { type: 'Enterprise', positive: 58, neutral: 30, negative: 12 },
  { type: 'Competitors', positive: 45, neutral: 35, negative: 20 },
];

const expertSentimentTrend = [
  { month: 'Jul', score: 0.62 },
  { month: 'Aug', score: 0.58 },
  { month: 'Sep', score: 0.65 },
  { month: 'Oct', score: 0.71 },
  { month: 'Nov', score: 0.68 },
  { month: 'Dec', score: 0.75 },
  { month: 'Jan', score: 0.72 },
];

// M Science Alternative Data
const appStoreDownloads = [
  { date: 'Jul 1', value: 48.2, ma7: 47.5 },
  { date: 'Jul 15', value: 51.3, ma7: 49.2 },
  { date: 'Aug 1', value: 49.8, ma7: 50.1 },
  { date: 'Aug 15', value: 52.1, ma7: 50.8 },
  { date: 'Sep 1', value: 55.2, ma7: 52.4 },
  { date: 'Sep 15', value: 58.7, ma7: 54.9 },
  { date: 'Oct 1', value: 54.3, ma7: 55.8 },
  { date: 'Oct 15', value: 52.8, ma7: 54.2 },
  { date: 'Nov 1', value: 56.1, ma7: 53.9 },
  { date: 'Nov 15', value: 61.2, ma7: 56.8 },
  { date: 'Dec 1', value: 68.5, ma7: 61.4 },
  { date: 'Dec 15', value: 72.3, ma7: 66.2 },
  { date: 'Jan 1', value: 58.9, ma7: 64.8 },
  { date: 'Jan 15', value: 51.4, ma7: 58.2 },
];

const creditCardSpending = [
  { date: 'Jul 1', value: 985, ma7: 972 },
  { date: 'Jul 15', value: 1012, ma7: 995 },
  { date: 'Aug 1', value: 998, ma7: 1002 },
  { date: 'Aug 15', value: 1025, ma7: 1010 },
  { date: 'Sep 1', value: 1089, ma7: 1045 },
  { date: 'Sep 15', value: 1156, ma7: 1098 },
  { date: 'Oct 1', value: 1078, ma7: 1105 },
  { date: 'Oct 15', value: 1045, ma7: 1078 },
  { date: 'Nov 1', value: 1112, ma7: 1068 },
  { date: 'Nov 15', value: 1198, ma7: 1125 },
  { date: 'Dec 1', value: 1345, ma7: 1218 },
  { date: 'Dec 15', value: 1425, ma7: 1312 },
  { date: 'Jan 1', value: 1156, ma7: 1285 },
  { date: 'Jan 15', value: 1031.7, ma7: 1178 },
];

// Recent Intelligence Feed
const recentIntelligence = [
  {
    source: 'Semiconductor Industry Consultant',
    date: 'Nov 30',
    topic: 'TSMC N3P production',
    summary: 'Topic: N3P capacity expansion. "TSMC is running at 95% utilization on N3P. No incremental capacity for Apple until Q2 2025. Performance improvements are substantial."',
    sentiment: 'positive',
  },
  {
    source: 'Former App Store Business Manager',
    date: 'Oct 25',
    topic: 'App Store growth',
    summary: 'Topic: App Store growth. "New subscription tiers are driving higher ARPU. Gaming subscriptions in particular showing 15% growth. Expect acceleration in Q1."',
    sentiment: 'positive',
  },
  {
    source: 'Apple China Sales Executive',
    date: 'Sep 30',
    topic: 'China competition',
    summary: 'Topic: China market. "Current Model 16 is winning back market share in tier 1 cities. We are gaining share in premium segment despite macro headwinds."',
    sentiment: 'neutral',
  },
];

const managementCommentary = [
  {
    source: 'Tim Cook',
    date: 'Oct 30',
    topic: 'China Market',
    quote: '"We\'re seeing stronger than expected demand in China. Our premium positioning continues to resonate with consumers."',
    sentiment: 'positive',
  },
  {
    source: 'Tim Cook',
    date: 'Oct 30',
    topic: 'AI Investment',
    quote: '"We\'re making significant investments in AI across our product line. Expect to see meaningful AI features in 2025."',
    sentiment: 'positive',
  },
  {
    source: 'Luca Maestri',
    date: 'Oct 30',
    topic: 'Services Growth',
    quote: '"Services revenue continues to accelerate. We expect double-digit growth to continue through FY25."',
    sentiment: 'positive',
  },
];

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

// Quantitative Analysis Data - Sales per Employee
const salesPerEmployee = [
  { year: '2019', value: 1.92 },
  { year: '2020', value: 2.15 },
  { year: '2021', value: 2.38 },
  { year: '2022', value: 2.52 },
  { year: '2023', value: 2.68 },
  { year: '2024', value: 2.85 },
];

// Cash Flow Margins (Operating and Free Cash Flow)
const cashFlowMargins = [
  { year: '2019', operatingCF: 24.5, freeCF: 21.2 },
  { year: '2020', operatingCF: 26.8, freeCF: 23.5 },
  { year: '2021', operatingCF: 28.2, freeCF: 25.1 },
  { year: '2022', operatingCF: 27.5, freeCF: 24.8 },
  { year: '2023', operatingCF: 29.1, freeCF: 26.2 },
  { year: '2024', operatingCF: 30.5, freeCF: 27.8 },
];

// Historical Annual Growth Rate
const historicalGrowthRate = [
  { year: '2019', revenue: 5.2, earnings: 7.8, eps: 10.2 },
  { year: '2020', revenue: 8.5, earnings: 12.4, eps: 15.1 },
  { year: '2021', revenue: 15.2, earnings: 18.5, eps: 21.3 },
  { year: '2022', revenue: 8.1, earnings: 5.2, eps: 8.9 },
  { year: '2023', revenue: 12.5, earnings: 14.8, eps: 16.2 },
  { year: '2024', revenue: 15.0, earnings: 18.2, eps: 19.5 },
];

// Profitability Margins (EBITDA, EBIT, EPS Growth)
const profitabilityMargins = [
  { year: '2019', ebitda: 32.5, ebit: 28.2, netMargin: 21.5 },
  { year: '2020', ebitda: 34.2, ebit: 29.8, netMargin: 23.1 },
  { year: '2021', ebitda: 35.8, ebit: 31.5, netMargin: 25.2 },
  { year: '2022', ebitda: 34.5, ebit: 30.2, netMargin: 24.5 },
  { year: '2023', ebitda: 36.2, ebit: 32.1, netMargin: 26.1 },
  { year: '2024', ebitda: 37.5, ebit: 33.5, netMargin: 27.8 },
];

// EPS Historical Data
const epsHistory = [
  { year: '2019', eps: 2.97, growth: 10.2 },
  { year: '2020', eps: 3.28, growth: 10.4 },
  { year: '2021', eps: 5.61, growth: 71.0 },
  { year: '2022', eps: 6.11, growth: 8.9 },
  { year: '2023', eps: 6.13, growth: 0.3 },
  { year: '2024', eps: 6.42, growth: 4.7 },
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'positive': return { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' };
    case 'negative': return { bg: '#ffebee', border: '#f44336', text: '#c62828' };
    case 'neutral': return { bg: '#fff8e1', border: '#ff9800', text: '#f57c00' };
    default: return { bg: '#f5f5f5', border: '#9e9e9e', text: '#616161' };
  }
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
  selectedCompany = 'AAPL',
  onCompanySelect 
}) => {
  // Get context for chat-driven competitor analysis
  const dashboardContext = useContext(DashboardStateContext);
  
  const [selectedTicker, setSelectedTicker] = useState(selectedCompany);
  
  // Sync with parent's selectedCompany prop when it changes
  useEffect(() => {
    if (selectedCompany !== selectedTicker) {
      setSelectedTicker(selectedCompany);
    }
  }, [selectedCompany]);
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [competitors, setCompetitors] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  
  // OpenAI-generated data state
  const [aiIntelligence, setAiIntelligence] = useState<CompanyIntelligence | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [useAiData, setUseAiData] = useState(false);
  
  // Competitor Analysis state - use context values if available (from chat)
  const [competitor1, setCompetitor1] = useState<string>(dashboardContext?.competitor1 || 'MSFT');
  const [competitor2, setCompetitor2] = useState<string>(dashboardContext?.competitor2 || 'GOOGL');
  const [showCompetitorSection, setShowCompetitorSection] = useState<boolean>(dashboardContext?.showCompetitorAnalysis || false);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<{
    competitor1Data: StockQuote | null;
    competitor2Data: StockQuote | null;
    aiAnalysis: string | null;
    loading: boolean;
  }>({
    competitor1Data: null,
    competitor2Data: null,
    aiAnalysis: null,
    loading: false,
  });
  
  // Sync competitor state with context (when chat updates competitors)
  useEffect(() => {
    if (dashboardContext?.competitor1 && dashboardContext?.competitor2) {
      setCompetitor1(dashboardContext.competitor1);
      setCompetitor2(dashboardContext.competitor2);
    }
  }, [dashboardContext?.competitor1, dashboardContext?.competitor2]);
  
  // Show competitor section when triggered from chat and scroll to it
  useEffect(() => {
    if (dashboardContext?.showCompetitorAnalysis) {
      setShowCompetitorSection(true);
      // Scroll to the competitor analysis section
      setTimeout(() => {
        const element = document.getElementById('competitor-analysis-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [dashboardContext?.showCompetitorAnalysis]);

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

  // Fetch OpenAI-generated intelligence data
  const fetchAiIntelligence = async () => {
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      setAiError('OpenAI API key not configured');
      return;
    }
    
    setAiLoading(true);
    setAiError(null);
    try {
      const companyName = companyNames[selectedTicker] || selectedTicker;
      const intelligence = await generateCompanyIntelligence(selectedTicker, companyName);
      setAiIntelligence(intelligence);
      setUseAiData(true);
    } catch (error) {
      console.error('Error fetching AI intelligence:', error);
      setAiError('Failed to generate AI intelligence. Using synthetic data.');
      setUseAiData(false);
    } finally {
      setAiLoading(false);
    }
  };

  // Fetch competitor analysis data
  const fetchCompetitorAnalysis = async () => {
    setCompetitorAnalysis(prev => ({ ...prev, loading: true }));
    try {
      const [data1, data2] = await Promise.all([
        yahooFinanceService.getQuote(competitor1),
        yahooFinanceService.getQuote(competitor2),
      ]);
      
      if (!data1 || !data2) {
        setCompetitorAnalysis(prev => ({ ...prev, loading: false }));
        return;
      }
      
      // Generate AI analysis comparing the two competitors
      const company1Name = companyNames[competitor1] || competitor1;
      const company2Name = companyNames[competitor2] || competitor2;

      setCompetitorAnalysis({
        competitor1Data: data1,
        competitor2Data: data2,
        aiAnalysis: `${company1Name} trades at a ${data1.trailingPE && data2.trailingPE ? (data1.trailingPE > data2.trailingPE ? 'premium' : 'discount') : 'comparable'} valuation compared to ${company2Name}. ${data1.regularMarketChangePercent > data2.regularMarketChangePercent ? company1Name : company2Name} shows stronger recent momentum with better daily performance. Both companies remain key players in the technology sector with distinct competitive advantages.`,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching competitor analysis:', error);
      setCompetitorAnalysis(prev => ({ ...prev, loading: false }));
    }
  };

  // Fetch competitor data when competitors change
  useEffect(() => {
    if (competitor1 && competitor2) {
      fetchCompetitorAnalysis();
    }
  }, [competitor1, competitor2]);

  // Get the data to display (AI-generated or synthetic)
  const displaySalesPerEmployee = useAiData && aiIntelligence?.quantitative?.salesPerEmployee 
    ? aiIntelligence.quantitative.salesPerEmployee 
    : salesPerEmployee;
  
  const displayCashFlowMargins = useAiData && aiIntelligence?.quantitative?.cashFlowMargins 
    ? aiIntelligence.quantitative.cashFlowMargins 
    : cashFlowMargins;
  
  const displayHistoricalGrowthRate = useAiData && aiIntelligence?.quantitative?.historicalGrowthRate 
    ? aiIntelligence.quantitative.historicalGrowthRate 
    : historicalGrowthRate;
  
  const displayProfitabilityMargins = useAiData && aiIntelligence?.quantitative?.profitabilityMargins 
    ? aiIntelligence.quantitative.profitabilityMargins 
    : profitabilityMargins;
  
  const displayEpsHistory = useAiData && aiIntelligence?.quantitative?.epsHistory 
    ? aiIntelligence.quantitative.epsHistory 
    : epsHistory;

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
    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Dashboard Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1a237e' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
              {stockData.symbol} Intelligence Dashboard
            </Typography>
            <FormControl size="small" sx={{ minWidth: 100, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' } } }}>
              <Select
                value={selectedTicker}
                onChange={handleTickerChange}
                sx={{ color: 'white' }}
              >
                {availableSymbols.map(symbol => (
                  <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Last Updated: January 24, 2025 at 09:17 AM
          </Typography>
        </Box>

        {/* Key Metrics Bar */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Revenue (TTM)</Typography>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>$42,797M</Typography>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>+15.0% YoY</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Gross Margin</Typography>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>28.3%</Typography>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>+1.2%pp</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>SG Gross TTM</Typography>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>$15,109M</Typography>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>+12.5% vs Estimate</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Quant Sentiment</Typography>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>0.56/1.0</Typography>
            <Chip label="Weak" size="small" sx={{ backgroundColor: '#ff9800', color: 'white', height: 20 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Data Freshness</Typography>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>Live</Typography>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>All sources active</Typography>
          </Box>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['Key Takeaways', 'Executive Summary', 'Estimates vs Street', 'Commentary Intelligence', 'Market Context', 'Alternative Data', 'Investment View'].map((tab, index) => (
            <Chip 
              key={tab}
              label={tab}
              size="small"
              sx={{ 
                backgroundColor: index === 0 ? 'white' : 'rgba(255,255,255,0.2)', 
                color: index === 0 ? '#1a237e' : 'white',
                '&:hover': { backgroundColor: index === 0 ? 'white' : 'rgba(255,255,255,0.3)' }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Competitor Analysis Section - At the Top */}
      <Card 
        id="competitor-analysis-section"
        sx={{ 
          mb: 2, 
          border: showCompetitorSection ? '3px solid #4caf50' : '2px solid #1a237e',
          transition: 'border-color 0.3s ease',
          animation: showCompetitorSection ? 'pulse 2s ease-in-out' : 'none',
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
            '70%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business color="primary" /> Competitor Analysis
            </Typography>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<Refresh />}
              onClick={fetchCompetitorAnalysis}
              disabled={competitorAnalysis.loading}
            >
              Refresh Analysis
            </Button>
          </Box>
          
          {/* Competitor Selection */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Competitor 1</InputLabel>
              <Select
                value={competitor1}
                label="Competitor 1"
                onChange={(e) => setCompetitor1(e.target.value)}
              >
                {availableSymbols.filter(s => s !== competitor2).map(symbol => (
                  <MenuItem key={symbol} value={symbol}>
                    {symbol} - {companyNames[symbol]?.split(' ')[0] || symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="h6" color="text.secondary">vs</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Competitor 2</InputLabel>
              <Select
                value={competitor2}
                label="Competitor 2"
                onChange={(e) => setCompetitor2(e.target.value)}
              >
                {availableSymbols.filter(s => s !== competitor1).map(symbol => (
                  <MenuItem key={symbol} value={symbol}>
                    {symbol} - {companyNames[symbol]?.split(' ')[0] || symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {competitorAnalysis.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Comparison Table */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Competitor 1 Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#e3f2fd', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {competitor1}
                      </Typography>
                      <Chip 
                        label={companyNames[competitor1]?.split(' ')[0] || competitor1}
                        size="small"
                        color="primary"
                      />
                    </Box>
                    {competitorAnalysis.competitor1Data && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Price</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            ${competitorAnalysis.competitor1Data.regularMarketPrice.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Change</Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            sx={{ color: competitorAnalysis.competitor1Data.regularMarketChange >= 0 ? '#4caf50' : '#f44336' }}
                          >
                            {competitorAnalysis.competitor1Data.regularMarketChange >= 0 ? '+' : ''}
                            {competitorAnalysis.competitor1Data.regularMarketChangePercent.toFixed(2)}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            ${formatMarketCap(competitorAnalysis.competitor1Data.marketCap)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">P/E Ratio</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {competitorAnalysis.competitor1Data.trailingPE?.toFixed(2) || 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">52W Range</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            ${competitorAnalysis.competitor1Data.fiftyTwoWeekLow.toFixed(0)} - ${competitorAnalysis.competitor1Data.fiftyTwoWeekHigh.toFixed(0)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                {/* Competitor 2 Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#fce4ec', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#c2185b' }}>
                        {competitor2}
                      </Typography>
                      <Chip 
                        label={companyNames[competitor2]?.split(' ')[0] || competitor2}
                        size="small"
                        sx={{ backgroundColor: '#c2185b', color: 'white' }}
                      />
                    </Box>
                    {competitorAnalysis.competitor2Data && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Price</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            ${competitorAnalysis.competitor2Data.regularMarketPrice.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Change</Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            sx={{ color: competitorAnalysis.competitor2Data.regularMarketChange >= 0 ? '#4caf50' : '#f44336' }}
                          >
                            {competitorAnalysis.competitor2Data.regularMarketChange >= 0 ? '+' : ''}
                            {competitorAnalysis.competitor2Data.regularMarketChangePercent.toFixed(2)}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            ${formatMarketCap(competitorAnalysis.competitor2Data.marketCap)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">P/E Ratio</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {competitorAnalysis.competitor2Data.trailingPE?.toFixed(2) || 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">52W Range</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            ${competitorAnalysis.competitor2Data.fiftyTwoWeekLow.toFixed(0)} - ${competitorAnalysis.competitor2Data.fiftyTwoWeekHigh.toFixed(0)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              {/* AI Analysis Summary */}
              {competitorAnalysis.aiAnalysis && (
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', borderLeft: '4px solid #1a237e' }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment color="primary" /> AI Analysis Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {competitorAnalysis.aiAnalysis}
                  </Typography>
                </Paper>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Centralized Investment Takeaways */}
      <Card sx={{ mb: 2, borderLeft: '4px solid #1a237e' }}>
        <CardContent sx={{ py: 1.5 }}>
          <Typography variant="subtitle2" color="primary" fontWeight="bold">
            Centralized Investment Takeaways
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Synthesized insights across all data sources - Updated daily
          </Typography>
        </CardContent>
      </Card>

      {/* Key Leading Indicators */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline color="primary" /> Key Leading Indicators
          </Typography>
          <Grid container spacing={2}>
            {keyLeadingIndicators.map((indicator, index) => {
              const colors = getStatusColor(indicator.status);
              return (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Paper sx={{ p: 2, backgroundColor: colors.bg, borderLeft: `4px solid ${colors.border}`, height: '100%' }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: colors.text, mb: 1 }}>
                      {indicator.status === 'positive' ? '↑' : indicator.status === 'negative' ? '↓' : '→'} {indicator.category}
                    </Typography>
                    {indicator.items.map((item, idx) => (
                      <Box key={idx} sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          <strong>{item.label}:</strong> {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Commentary Synthesis */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People color="primary" /> Commentary Synthesis
            </Typography>
            <Typography variant="caption" color="text.secondary">Expert Network Takeaways (Last 60 Days)</Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              {commentarySynthesis.map((item, index) => {
                const colors = getStatusColor(item.sentiment);
                return (
                  <Paper key={index} sx={{ p: 1.5, mb: 1, backgroundColor: colors.bg, borderLeft: `3px solid ${colors.border}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {item.sentiment === 'positive' ? '↑' : item.sentiment === 'negative' ? '↓' : '→'} {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Confidence: {item.confidence} | Source: {item.source} | {item.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, fontSize: '0.8rem' }}>
                      {item.summary}
                    </Typography>
                  </Paper>
                );
              })}
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Management Tone Analysis</Typography>
                {managementToneAnalysis.map((item, index) => (
                  <Box key={index} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} {item.category}
                      </Typography>
                      <Typography variant="caption" sx={{ color: getSentimentColor(item.value) }}>
                        {item.change || `${(item.value * 100).toFixed(0)}%`}
                      </Typography>
                    </Box>
                    {item.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {item.description}
                      </Typography>
                    )}
                    <LinearProgress 
                      variant="determinate" 
                      value={item.value * 100} 
                      sx={{ 
                        height: 4, 
                        borderRadius: 2,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': { backgroundColor: getSentimentColor(item.value) }
                      }} 
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Intelligence Feed */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assessment color="primary" /> Recent Intelligence Feed
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Expert Insights (Last 30 Days)
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              {recentIntelligence.map((item, index) => {
                const colors = getStatusColor(item.sentiment);
                return (
                  <Paper key={index} sx={{ p: 1.5, mb: 1, borderLeft: `3px solid ${colors.border}` }}>
                    <Typography variant="subtitle2" fontWeight="bold">{item.source} - {item.date}</Typography>
                    <Typography variant="caption" color="primary">Topic: {item.topic}</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.8rem' }}>{item.summary}</Typography>
                  </Paper>
                );
              })}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Management Commentary (Recent Quarters)</Typography>
                {managementCommentary.map((item, index) => (
                  <Box key={index} sx={{ mb: 1.5, pb: 1.5, borderBottom: index < managementCommentary.length - 1 ? '1px solid #bbdefb' : 'none' }}>
                    <Typography variant="caption" fontWeight="bold">{item.source} - {item.date}</Typography>
                    <Typography variant="caption" color="primary" sx={{ display: 'block' }}>Topic: {item.topic}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{item.quote}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Competitive & Sell-Side Intelligence */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business color="primary" /> Competitive & Sell-Side Intelligence
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Recent Sell-Side Activity</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Analyst</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Target</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sellSideActivity.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.analyst}</TableCell>
                          <TableCell>{item.action}</TableCell>
                          <TableCell>
                            <Chip label={item.rating} size="small" color="success" sx={{ height: 20 }} />
                          </TableCell>
                          <TableCell>{item.target}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Competitor Commentary</Typography>
                {competitorCommentary.map((item, index) => {
                  const colors = getStatusColor(item.sentiment);
                  return (
                    <Box key={index} sx={{ mb: 1, p: 1, backgroundColor: colors.bg, borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="bold">{item.company}</Typography>
                      <Typography variant="caption">{item.note}</Typography>
                    </Box>
                  );
                })}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Investment Bottom Line */}
      <Card sx={{ mb: 2, backgroundColor: '#fff8e1', borderLeft: '4px solid #ff9800' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star sx={{ color: '#ff9800' }} /> Investment Bottom Line
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>{investmentBottomLine.summary}</Typography>
              <List dense>
                {investmentBottomLine.keyPoints.map((point, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <Circle sx={{ fontSize: 8, color: index === 2 ? '#f44336' : '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2">{point}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
              <Paper sx={{ p: 1.5, mt: 1, backgroundColor: '#fff3e0' }}>
                <Typography variant="body2" fontWeight="bold">{investmentBottomLine.bottomLine}</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Data Quality Score</Typography>
                {dataQualityScores.map((item, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">{item.source}</Typography>
                      <Typography variant="caption" fontWeight="bold">{item.score}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.score} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': { backgroundColor: item.color }
                      }} 
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Management Earnings Call Analysis */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Management Earnings Call Analysis
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Management Sentiment Trend</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={earningsCallTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0.5, 0.9]} tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="sentiment" stroke="#1976d2" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Topic Breakdown</Typography>
              <Typography variant="caption" color="text.secondary">Management Focus Areas</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={topicBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                    {topicBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    layout="vertical" 
                    align="right" 
                    verticalAlign="middle"
                    formatter={(value) => <span style={{ fontSize: '10px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Revenue Estimates Comparison */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Revenue Estimates Comparison
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Forward Revenue Estimates: Deviator vs Street
          </Typography>
          
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={revenueEstimates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[70, 100]} />
              <RechartsTooltip />
              <Legend />
              <Area type="monotone" dataKey="street" fill="#e3f2fd" stroke="#1976d2" name="Street Estimate" />
              <Line type="monotone" dataKey="internal" stroke="#4caf50" strokeWidth={2} name="Internal Estimate" />
              <Line type="monotone" dataKey="actual" stroke="#f44336" strokeWidth={2} strokeDasharray="5 5" name="Actual" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Estimate Comparison */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Detailed Estimate Comparison
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Metric</TableCell>
                  <TableCell>Q1 Street</TableCell>
                  <TableCell>Q1 Internal</TableCell>
                  <TableCell>Q2 Street</TableCell>
                  <TableCell>Q2 Internal</TableCell>
                  <TableCell>Variance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailedEstimates.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.metric}</TableCell>
                    <TableCell>{row.q1_street}</TableCell>
                    <TableCell sx={{ backgroundColor: '#e8f5e9' }}>{row.q1_internal}</TableCell>
                    <TableCell>{row.q2_street}</TableCell>
                    <TableCell sx={{ backgroundColor: '#e8f5e9' }}>{row.q2_internal}</TableCell>
                    <TableCell sx={{ backgroundColor: '#c8e6c9', fontWeight: 'bold', color: '#2e7d32' }}>{row.variance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Expert Network Intelligence */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Expert Network Intelligence
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Ratings Sentiment by Expert Type</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={expertSentimentByType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="type" tick={{ fontSize: 10 }} width={80} />
                  <RechartsTooltip />
                  <Bar dataKey="positive" stackId="a" fill="#4caf50" name="Positive" />
                  <Bar dataKey="neutral" stackId="a" fill="#ff9800" name="Neutral" />
                  <Bar dataKey="negative" stackId="a" fill="#f44336" name="Negative" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Expert Sentiment Trend</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={expertSentimentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0.5, 0.8]} tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="score" fill="#c8e6c9" stroke="#4caf50" />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* M Science Alternative Data */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShowChart color="primary" /> M Science Alternative Data
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">App Store Daily Downloads</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold">51.4</Typography>
                    <Typography variant="caption" color="text.secondary">Rolling Avg</Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">App Store Daily Downloads Trend</Typography>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={appStoreDownloads}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 8 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="value" stroke="#f44336" strokeWidth={1} dot={false} name="Daily" />
                    <Line type="monotone" dataKey="ma7" stroke="#1976d2" strokeWidth={2} dot={false} name="7-Day MA" />
                  </LineChart>
                </ResponsiveContainer>
                <Typography variant="caption" color="text.secondary">Data Type: app_intelligence</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">Apple Store Credit Card Spending</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold">1031.7</Typography>
                    <Typography variant="caption" color="text.secondary">Rolling Avg</Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">Apple Store Credit Card Spending Trend</Typography>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={creditCardSpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 8 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="value" stroke="#f44336" strokeWidth={1} dot={false} name="Daily" />
                    <Line type="monotone" dataKey="ma7" stroke="#1976d2" strokeWidth={2} dot={false} name="7-Day MA" />
                  </LineChart>
                </ResponsiveContainer>
                <Typography variant="caption" color="text.secondary">Data Type: credit_card</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Quantitative Analysis Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment color="primary" /> Quantitative Analysis
              {useAiData && (
                <Chip 
                  label="AI Generated" 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {aiError && (
                <Typography variant="caption" color="error">{aiError}</Typography>
              )}
              <Button
                variant={useAiData ? "outlined" : "contained"}
                size="small"
                onClick={fetchAiIntelligence}
                disabled={aiLoading}
                startIcon={aiLoading ? <CircularProgress size={16} /> : <Refresh />}
              >
                {aiLoading ? 'Generating...' : useAiData ? 'Refresh AI Data' : 'Generate AI Data'}
              </Button>
              {useAiData && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setUseAiData(false)}
                >
                  Use Synthetic
                </Button>
              )}
            </Box>
          </Box>

          {/* AI Qualitative Insights */}
          {useAiData && aiIntelligence?.qualitative && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                AI-Generated Executive Summary
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {aiIntelligence.qualitative.executiveSummary}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="caption" fontWeight="bold" color="primary">Key Insights</Typography>
                  <List dense>
                    {aiIntelligence.qualitative.keyInsights.slice(0, 3).map((insight, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckCircle sx={{ fontSize: 14, color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="caption">{insight}</Typography>} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="caption" fontWeight="bold" color="error">Risk Factors</Typography>
                  <List dense>
                    {aiIntelligence.qualitative.riskFactors.slice(0, 3).map((risk, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Warning sx={{ fontSize: 14, color: '#f44336' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="caption">{risk}</Typography>} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: '#1976d2' }}>Opportunities</Typography>
                  <List dense>
                    {aiIntelligence.qualitative.opportunities.slice(0, 3).map((opp, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <TrendingUp sx={{ fontSize: 14, color: '#1976d2' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="caption">{opp}</Typography>} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Investment Thesis: {aiIntelligence.qualitative.investmentThesis}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                Generated at: {new Date(aiIntelligence.generatedAt).toLocaleString()}
              </Typography>
            </Paper>
          )}
          
          <Grid container spacing={2}>
            {/* Sales per Employee */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Sales per Employee ($M)</Typography>
                <Typography variant="caption" color="text.secondary">Historical trend showing revenue efficiency</Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={displaySalesPerEmployee}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 3.5]} tickFormatter={(v) => `$${v}M`} />
                    <RechartsTooltip formatter={(value) => [`$${Number(value).toFixed(2)}M`, 'Sales/Employee']} />
                    <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">2024: $2.85M</Typography>
                  <Typography variant="caption" sx={{ color: '#4caf50' }}>+6.3% YoY</Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Cash Flow Margins */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Cash Flow Margins (%)</Typography>
                <Typography variant="caption" color="text.secondary">Operating CF vs Free Cash Flow Margin</Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={displayCashFlowMargins}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[15, 35]} tickFormatter={(v) => `${v}%`} />
                    <RechartsTooltip formatter={(value) => [`${Number(value).toFixed(1)}%`]} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line type="monotone" dataKey="operatingCF" stroke="#1976d2" strokeWidth={2} name="Operating CF" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="freeCF" stroke="#4caf50" strokeWidth={2} name="Free CF" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">OCF: 30.5% | FCF: 27.8%</Typography>
                  <Typography variant="caption" sx={{ color: '#4caf50' }}>+1.4pp / +1.6pp YoY</Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Historical Annual Growth Rate */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Historical Annual Growth Rate (%)</Typography>
                <Typography variant="caption" color="text.secondary">Revenue, Earnings, and EPS Growth</Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <ComposedChart data={displayHistoricalGrowthRate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                    <RechartsTooltip formatter={(value) => [`${Number(value).toFixed(1)}%`]} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="revenue" fill="#1976d2" name="Revenue" radius={[2, 2, 0, 0]} />
                    <Line type="monotone" dataKey="earnings" stroke="#f57c00" strokeWidth={2} name="Earnings" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="eps" stroke="#4caf50" strokeWidth={2} name="EPS" dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">2024: Rev +15.0% | Earn +18.2%</Typography>
                  <Typography variant="caption" sx={{ color: '#4caf50' }}>EPS +19.5%</Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Profitability Margins */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Profitability Margins (%)</Typography>
                <Typography variant="caption" color="text.secondary">EBITDA, EBIT, and Net Margin</Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={displayProfitabilityMargins}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[15, 45]} tickFormatter={(v) => `${v}%`} />
                    <RechartsTooltip formatter={(value) => [`${Number(value).toFixed(1)}%`]} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Area type="monotone" dataKey="ebitda" fill="#bbdefb" stroke="#1976d2" strokeWidth={2} name="EBITDA" />
                    <Area type="monotone" dataKey="ebit" fill="#c8e6c9" stroke="#4caf50" strokeWidth={2} name="EBIT" />
                    <Area type="monotone" dataKey="netMargin" fill="#ffe0b2" stroke="#f57c00" strokeWidth={2} name="Net Margin" />
                  </AreaChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">EBITDA: 37.5% | EBIT: 33.5%</Typography>
                  <Typography variant="caption" sx={{ color: '#4caf50' }}>Net: 27.8%</Typography>
                </Box>
              </Paper>
            </Grid>

            {/* EPS History */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>EPS History & Growth</Typography>
                <Typography variant="caption" color="text.secondary">Earnings Per Share with YoY Growth Rate</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={displayEpsHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                    <RechartsTooltip />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar yAxisId="left" dataKey="eps" fill="#1976d2" name="EPS ($)" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#f57c00" strokeWidth={2} name="Growth (%)" dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">2024 EPS: $6.42</Typography>
                  <Typography variant="caption" sx={{ color: '#4caf50' }}>+4.7% YoY | 5Y CAGR: 16.7%</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stock Price Chart */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Stock Price: ${stockData.regularMarketPrice.toFixed(2)}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: priceChangeColor, fontWeight: 'bold' }}
              >
                {stockData.regularMarketChange >= 0 ? '+' : ''}{stockData.regularMarketChange.toFixed(2)} ({stockData.regularMarketChangePercent.toFixed(2)}%)
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
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
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[chartMin, chartMax]}
                    tick={{ fontSize: 10 }}
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
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[chartMin, chartMax]}
                    tick={{ fontSize: 10 }}
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
            <ResponsiveContainer width="100%" height={50}>
              <BarChart data={formattedChartData}>
                <XAxis dataKey="displayDate" hide />
                <YAxis hide />
                <Bar dataKey="volume" fill="#90caf9" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Competitors */}
      <Card>
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
                  <TableCell align="right">Market Cap</TableCell>
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
                    <TableCell align="right">
                      {formatMarketCap(comp.marketCap)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompanyDashboard;
