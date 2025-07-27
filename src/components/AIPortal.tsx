import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Tab,
  Tabs,
  Badge,
  Rating,
  TextField,
} from '@mui/material';
import {
  ExpandMore,
  TrendingUp,
  School,
  Group,
  Code,
  Security,
  Gavel,
  AccountBalance,
  Psychology,
  Business,
  Event,
  Star,
  Launch,
  Email,
  Edit,
} from '@mui/icons-material';
import {
  AIDepartment,
  AIUseCase,
  AIPromptTool,
  AIWorkshop,
  AITeamMember,
  AIBestPractice,
  AIEnablementResource,
} from '../types';

const mockDepartments: AIDepartment[] = [
  {
    id: 'investments',
    name: 'Investments',
    description: 'AI-driven investment analysis and portfolio optimization',
    useCases: [
      {
        id: 'inv-1',
        title: 'Portfolio Risk Analysis',
        description: 'AI-powered risk assessment for investment portfolios',
        status: 'active',
        priority: 'high',
        department: 'investments',
        lastUpdated: new Date('2024-01-20'),
        owner: 'Sarah Chen',
      },
      {
        id: 'inv-2',
        title: 'Market Sentiment Analysis',
        description: 'Real-time sentiment analysis from news and social media',
        status: 'active',
        priority: 'high',
        department: 'investments',
        lastUpdated: new Date('2024-01-18'),
        owner: 'Michael Rodriguez',
      },
    ],
    promptsTools: [
      {
        id: 'inv-p1',
        title: 'Investment Research Prompt',
        description: 'Comprehensive prompt for analyzing investment opportunities',
        category: 'prompt',
        department: 'investments',
        tags: ['research', 'analysis', 'due-diligence'],
        usage: 245,
        rating: 4.8,
        lastUpdated: new Date('2024-01-15'),
        author: 'Investment Team',
      },
      {
        id: 'inv-p2',
        title: 'Risk Assessment Agent',
        description: 'Automated agent for portfolio risk evaluation',
        category: 'agent',
        department: 'investments',
        tags: ['risk', 'portfolio', 'automation'],
        usage: 189,
        rating: 4.6,
        lastUpdated: new Date('2024-01-12'),
        author: 'Risk Management',
      },
    ],
    workshops: [
      {
        id: 'inv-w1',
        title: 'AI in Investment Decision Making',
        description: 'Workshop on integrating AI tools into investment processes',
        type: 'past',
        date: new Date('2024-01-10'),
        duration: '2 hours',
        department: 'investments',
        instructor: 'Dr. Emily Watson',
        attendees: 28,
      },
      {
        id: 'inv-w2',
        title: 'Advanced Portfolio Analytics',
        description: 'Deep dive into AI-powered portfolio optimization',
        type: 'upcoming',
        date: new Date('2024-02-15'),
        duration: '3 hours',
        department: 'investments',
        instructor: 'James Liu',
        attendees: 15,
        maxAttendees: 30,
      },
    ],
    teamMembers: [
      {
        id: 'inv-t1',
        name: 'Sarah Chen',
        role: 'Senior Investment Analyst',
        department: 'investments',
        expertise: ['Portfolio Analysis', 'Risk Management', 'AI Tools'],
        email: 'sarah.chen@company.com',
      },
      {
        id: 'inv-t2',
        name: 'Michael Rodriguez',
        role: 'Quantitative Researcher',
        department: 'investments',
        expertise: ['Machine Learning', 'Market Analysis', 'Data Science'],
        email: 'michael.rodriguez@company.com',
      },
    ],
  },
  {
    id: 'client-advisors',
    name: 'Client Advisors',
    description: 'AI tools for enhanced client relationship management',
    useCases: [
      {
        id: 'ca-1',
        title: 'Client Communication Assistant',
        description: 'AI-powered email and communication drafting',
        status: 'active',
        priority: 'high',
        department: 'client-advisors',
        lastUpdated: new Date('2024-01-22'),
        owner: 'Lisa Thompson',
      },
      {
        id: 'ca-2',
        title: 'Meeting Preparation Tool',
        description: 'Automated client meeting preparation and agenda creation',
        status: 'planned',
        priority: 'medium',
        department: 'client-advisors',
        lastUpdated: new Date('2024-01-19'),
        owner: 'David Park',
      },
    ],
    promptsTools: [
      {
        id: 'ca-p1',
        title: 'Client Email Templates',
        description: 'Professional email templates for various client scenarios',
        category: 'prompt',
        department: 'client-advisors',
        tags: ['communication', 'email', 'client-service'],
        usage: 312,
        rating: 4.9,
        lastUpdated: new Date('2024-01-20'),
        author: 'Client Services Team',
      },
    ],
    workshops: [
      {
        id: 'ca-w1',
        title: 'AI-Enhanced Client Interactions',
        description: 'Best practices for using AI in client communications',
        type: 'upcoming',
        date: new Date('2024-02-20'),
        duration: '1.5 hours',
        department: 'client-advisors',
        instructor: 'Amanda Foster',
        attendees: 22,
        maxAttendees: 40,
      },
    ],
    teamMembers: [
      {
        id: 'ca-t1',
        name: 'Lisa Thompson',
        role: 'Senior Client Advisor',
        department: 'client-advisors',
        expertise: ['Client Relations', 'AI Communication Tools', 'Wealth Planning'],
        email: 'lisa.thompson@company.com',
      },
    ],
  },
  {
    id: 'wealth-advisors',
    name: 'Wealth Advisors',
    description: 'AI-driven wealth management and advisory services',
    useCases: [
      {
        id: 'wa-1',
        title: 'Personalized Investment Recommendations',
        description: 'AI-generated investment recommendations based on client profiles',
        status: 'active',
        priority: 'high',
        department: 'wealth-advisors',
        lastUpdated: new Date('2024-01-21'),
        owner: 'Robert Kim',
      },
    ],
    promptsTools: [
      {
        id: 'wa-p1',
        title: 'Wealth Assessment Framework',
        description: 'Comprehensive framework for evaluating client wealth status',
        category: 'utility',
        department: 'wealth-advisors',
        tags: ['assessment', 'wealth-planning', 'client-analysis'],
        usage: 156,
        rating: 4.7,
        lastUpdated: new Date('2024-01-18'),
        author: 'Wealth Advisory Team',
      },
    ],
    workshops: [],
    teamMembers: [
      {
        id: 'wa-t1',
        name: 'Robert Kim',
        role: 'Wealth Advisor',
        department: 'wealth-advisors',
        expertise: ['Wealth Management', 'Investment Strategy', 'AI Analytics'],
        email: 'robert.kim@company.com',
      },
    ],
  },
  {
    id: 'wealth-planning',
    name: 'Wealth Planning',
    description: 'Strategic wealth planning with AI-powered insights',
    useCases: [
      {
        id: 'wp-1',
        title: 'Estate Planning Optimizer',
        description: 'AI-assisted estate planning and tax optimization',
        status: 'active',
        priority: 'medium',
        department: 'wealth-planning',
        lastUpdated: new Date('2024-01-17'),
        owner: 'Jennifer Walsh',
      },
    ],
    promptsTools: [
      {
        id: 'wp-p1',
        title: 'Tax Strategy Prompts',
        description: 'Prompts for tax-efficient wealth planning strategies',
        category: 'prompt',
        department: 'wealth-planning',
        tags: ['tax-planning', 'estate-planning', 'optimization'],
        usage: 98,
        rating: 4.5,
        lastUpdated: new Date('2024-01-16'),
        author: 'Tax Planning Team',
      },
    ],
    workshops: [
      {
        id: 'wp-w1',
        title: 'AI in Estate Planning',
        description: 'Leveraging AI for comprehensive estate planning',
        type: 'past',
        date: new Date('2024-01-05'),
        duration: '2.5 hours',
        department: 'wealth-planning',
        instructor: 'Mark Stevens',
        attendees: 18,
      },
    ],
    teamMembers: [
      {
        id: 'wp-t1',
        name: 'Jennifer Walsh',
        role: 'Wealth Planning Specialist',
        department: 'wealth-planning',
        expertise: ['Estate Planning', 'Tax Strategy', 'AI Tools'],
        email: 'jennifer.walsh@company.com',
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'AI-powered financial analysis and reporting',
    useCases: [
      {
        id: 'fin-1',
        title: 'Automated Financial Reporting',
        description: 'AI-generated financial reports and analysis',
        status: 'active',
        priority: 'high',
        department: 'finance',
        lastUpdated: new Date('2024-01-23'),
        owner: 'Thomas Anderson',
      },
    ],
    promptsTools: [
      {
        id: 'fin-p1',
        title: 'Financial Analysis Templates',
        description: 'Standardized templates for financial analysis',
        category: 'utility',
        department: 'finance',
        tags: ['reporting', 'analysis', 'templates'],
        usage: 203,
        rating: 4.6,
        lastUpdated: new Date('2024-01-21'),
        author: 'Finance Team',
      },
    ],
    workshops: [],
    teamMembers: [
      {
        id: 'fin-t1',
        name: 'Thomas Anderson',
        role: 'Financial Analyst',
        department: 'finance',
        expertise: ['Financial Modeling', 'Data Analysis', 'AI Reporting'],
        email: 'thomas.anderson@company.com',
      },
    ],
  },
  {
    id: 'compliance-legal',
    name: 'Compliance and Legal',
    description: 'AI tools for compliance monitoring and legal research',
    useCases: [
      {
        id: 'cl-1',
        title: 'Regulatory Compliance Monitor',
        description: 'AI-powered monitoring of regulatory changes and compliance',
        status: 'active',
        priority: 'high',
        department: 'compliance-legal',
        lastUpdated: new Date('2024-01-24'),
        owner: 'Maria Gonzalez',
      },
    ],
    promptsTools: [
      {
        id: 'cl-p1',
        title: 'Legal Research Assistant',
        description: 'AI prompts for efficient legal research and analysis',
        category: 'agent',
        department: 'compliance-legal',
        tags: ['legal-research', 'compliance', 'regulation'],
        usage: 87,
        rating: 4.8,
        lastUpdated: new Date('2024-01-22'),
        author: 'Legal Team',
      },
    ],
    workshops: [
      {
        id: 'cl-w1',
        title: 'AI Ethics in Financial Services',
        description: 'Understanding ethical AI use in financial compliance',
        type: 'upcoming',
        date: new Date('2024-02-28'),
        duration: '2 hours',
        department: 'compliance-legal',
        instructor: 'Dr. Patricia Lee',
        attendees: 12,
        maxAttendees: 25,
      },
    ],
    teamMembers: [
      {
        id: 'cl-t1',
        name: 'Maria Gonzalez',
        role: 'Compliance Officer',
        department: 'compliance-legal',
        expertise: ['Regulatory Compliance', 'Risk Management', 'AI Governance'],
        email: 'maria.gonzalez@company.com',
      },
    ],
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'AI-powered software development and infrastructure automation',
    useCases: [
      {
        id: 'tech-1',
        title: 'Code Review Assistant',
        description: 'AI-powered code review and quality analysis',
        status: 'active',
        priority: 'high',
        department: 'technology',
        lastUpdated: new Date('2024-01-25'),
        owner: 'Alex Johnson',
      },
      {
        id: 'tech-2',
        title: 'Infrastructure Monitoring',
        description: 'AI-driven system monitoring and anomaly detection',
        status: 'active',
        priority: 'medium',
        department: 'technology',
        lastUpdated: new Date('2024-01-23'),
        owner: 'Sam Wilson',
      },
    ],
    promptsTools: [
      {
        id: 'tech-p1',
        title: 'Development Best Practices',
        description: 'AI prompts for code quality and development standards',
        category: 'prompt',
        department: 'technology',
        tags: ['development', 'code-quality', 'best-practices'],
        usage: 167,
        rating: 4.7,
        lastUpdated: new Date('2024-01-20'),
        author: 'Tech Team',
      },
    ],
    workshops: [
      {
        id: 'tech-w1',
        title: 'AI in Software Development',
        description: 'Leveraging AI tools for enhanced development workflows',
        type: 'upcoming',
        date: new Date('2024-03-05'),
        duration: '2.5 hours',
        department: 'technology',
        instructor: 'Dr. Rachel Green',
        attendees: 18,
        maxAttendees: 35,
      },
    ],
    teamMembers: [
      {
        id: 'tech-t1',
        name: 'Alex Johnson',
        role: 'Senior Software Engineer',
        department: 'technology',
        expertise: ['AI Tools', 'Code Review', 'System Architecture'],
        email: 'alex.johnson@company.com',
      },
      {
        id: 'tech-t2',
        name: 'Sam Wilson',
        role: 'DevOps Engineer',
        department: 'technology',
        expertise: ['Infrastructure', 'Monitoring', 'Automation'],
        email: 'sam.wilson@company.com',
      },
    ],
  },
];

const mockBestPractices: AIBestPractice[] = [
  {
    id: 'bp-1',
    title: 'AI Model Validation Standards',
    description: 'Comprehensive standards for validating AI models before deployment',
    category: 'governance',
    importance: 'critical',
    lastUpdated: new Date('2024-01-20'),
  },
  {
    id: 'bp-2',
    title: 'Data Privacy in AI Applications',
    description: 'Guidelines for maintaining client data privacy in AI systems',
    category: 'ethics',
    importance: 'critical',
    lastUpdated: new Date('2024-01-18'),
  },
  {
    id: 'bp-3',
    title: 'Prompt Engineering Best Practices',
    description: 'Standards for creating effective and safe AI prompts',
    category: 'usage',
    importance: 'important',
    lastUpdated: new Date('2024-01-15'),
  },
  {
    id: 'bp-4',
    title: 'AI Security Framework',
    description: 'Security protocols for AI system implementation and maintenance',
    category: 'security',
    importance: 'critical',
    lastUpdated: new Date('2024-01-22'),
  },
];

const mockEnablementResources: AIEnablementResource[] = [
  {
    id: 'er-1',
    title: 'AI Onboarding Kit',
    description: 'Complete onboarding package for new AI tool users',
    type: 'guide',
    lastUpdated: new Date('2024-01-20'),
  },
  {
    id: 'er-2',
    title: 'Enterprise AI Training Portal',
    description: 'Centralized learning platform for AI skills development',
    type: 'training',
    url: 'https://training.company.com/ai',
    lastUpdated: new Date('2024-01-18'),
  },
  {
    id: 'er-3',
    title: 'AI Tool Directory',
    description: 'Comprehensive directory of approved AI tools and applications',
    type: 'tool',
    url: 'https://tools.company.com/ai-directory',
    lastUpdated: new Date('2024-01-22'),
  },
  {
    id: 'er-4',
    title: 'Prompt Template Library',
    description: 'Reusable prompt templates for common business scenarios',
    type: 'template',
    lastUpdated: new Date('2024-01-19'),
  },
];

const AIPortal: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedDepartment, setExpandedDepartment] = useState<string | false>('investments');
  const [textInput, setTextInput] = useState('');
  const [showContentGenerator, setShowContentGenerator] = useState<string | null>(null);
  const [departments, setDepartments] = useState<AIDepartment[]>(mockDepartments);
  const [enablementResources, setEnablementResources] = useState<AIEnablementResource[]>(mockEnablementResources);
  const [bestPractices, setBestPractices] = useState<AIBestPractice[]>(mockBestPractices);
  const [editingItem, setEditingItem] = useState<{type: string, id: string} | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleDepartmentChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedDepartment(isExpanded ? panel : false);
  };

  const getExamplePrompt = (sectionType: string) => {
    switch (sectionType) {
      case 'departments':
        return `Example for Investments Department:

USE CASES:
- Portfolio Risk Analysis: AI-powered risk assessment for investment portfolios (Status: active, Priority: high, Owner: Sarah Chen)
- Market Sentiment Analysis: Real-time sentiment analysis from news and social media (Status: active, Priority: high, Owner: Michael Rodriguez)

PROMPTS & TOOLS:
- Investment Research Prompt: Comprehensive prompt for analyzing investment opportunities (Category: prompt, Tags: research, analysis, due-diligence, Rating: 4.8, Author: Investment Team)

WORKSHOPS:
- AI in Investment Decision Making: Workshop on integrating AI tools into investment processes (Type: past, Date: 2024-01-10, Duration: 2 hours, Instructor: Dr. Emily Watson, Attendees: 28)

TEAM MEMBERS:
- Sarah Chen: Senior Investment Analyst (Expertise: Portfolio Analysis, Risk Management, AI Tools, Email: sarah.chen@company.com)`;
      
      case 'enablement':
        return `Example for Gen AI Enablement Resources:

TRAINING RESOURCES:
- AI Fundamentals Course: Comprehensive introduction to AI concepts and applications (Type: training, URL: https://training.company.com/ai-fundamentals)
- Enterprise AI Training Portal: Centralized learning platform for AI skills development (Type: training, URL: https://training.company.com/ai)

TOOLS & GUIDES:
- AI Tool Directory: Comprehensive directory of approved AI tools and applications (Type: tool, URL: https://tools.company.com/ai-directory)
- Prompt Template Library: Reusable prompt templates for common business scenarios (Type: template)`;
      
      default:
        return 'Paste your text content here. AI will generate structured cards based on this input...';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'planned': return 'warning';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'error';
      case 'important': return 'warning';
      case 'recommended': return 'info';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'governance': return <Gavel />;
      case 'ethics': return <Psychology />;
      case 'usage': return <Code />;
      case 'security': return <Security />;
      default: return <Business />;
    }
  };

  const getDepartmentIcon = (departmentId: string) => {
    switch (departmentId) {
      case 'investments': return <TrendingUp />;
      case 'client-advisors': return <Group />;
      case 'wealth-advisors': return <AccountBalance />;
      case 'wealth-planning': return <Business />;
      case 'finance': return <AccountBalance />;
      case 'compliance-legal': return <Gavel />;
      case 'technology': return <Code />;
      default: return <Business />;
    }
  };

  const renderUseCase = (useCase: AIUseCase) => (
    <Card key={useCase.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3">
            {useCase.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton 
              size="small" 
              onClick={() => setEditingItem({type: 'useCase', id: useCase.id})}
              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <Chip 
              label={useCase.status} 
              color={getStatusColor(useCase.status) as any}
              size="small"
            />
            <Chip 
              label={useCase.priority} 
              color={getPriorityColor(useCase.priority) as any}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {useCase.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Owner: {useCase.owner}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Updated: {useCase.lastUpdated.toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderPromptTool = (tool: AIPromptTool) => (
    <Card key={tool.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3">
            {tool.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton 
              size="small" 
              onClick={() => setEditingItem({type: 'promptTool', id: tool.id})}
              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <Chip 
              label={tool.category} 
              color="primary"
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {tool.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
          {tool.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating value={tool.rating} readOnly size="small" />
              <Typography variant="caption">({tool.rating})</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {tool.usage} uses
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            By: {tool.author}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderWorkshop = (workshop: AIWorkshop) => (
    <Card key={workshop.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3">
            {workshop.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton 
              size="small" 
              onClick={() => setEditingItem({type: 'workshop', id: workshop.id})}
              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <Chip 
              label={workshop.type} 
              color={workshop.type === 'upcoming' ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {workshop.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" display="block">
              <Event sx={{ fontSize: 14, mr: 0.5 }} />
              {workshop.date.toLocaleDateString()} • {workshop.duration}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Instructor: {workshop.instructor}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {workshop.attendees}{workshop.maxAttendees ? `/${workshop.maxAttendees}` : ''} attendees
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderTeamMember = (member: AITeamMember) => (
    <Card key={member.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 48, height: 48 }}>
            {member.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3">
              {member.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {member.role}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={() => setEditingItem({type: 'teamMember', id: member.id})}
            sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <Tooltip title="Send Email">
            <IconButton size="small" href={`mailto:${member.email}`}>
              <Email />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {member.expertise.map((skill) => (
            <Chip key={skill} label={skill} size="small" color="primary" variant="outlined" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const parseTextToStructuredData = (text: string, sectionType: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const result: any = {};

    if (sectionType === 'departments') {
      result.useCases = [];
      result.promptsTools = [];
      result.workshops = [];
      result.teamMembers = [];

      let currentSection = '';
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.toUpperCase().includes('USE CASES')) {
          currentSection = 'useCases';
        } else if (trimmed.toUpperCase().includes('PROMPTS') || trimmed.toUpperCase().includes('TOOLS')) {
          currentSection = 'promptsTools';
        } else if (trimmed.toUpperCase().includes('WORKSHOPS')) {
          currentSection = 'workshops';
        } else if (trimmed.toUpperCase().includes('TEAM')) {
          currentSection = 'teamMembers';
        } else if (trimmed.startsWith('-') && currentSection) {
          const content = trimmed.substring(1).trim();
          const id = `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          if (currentSection === 'useCases') {
            const [title, ...descParts] = content.split(':');
            const description = descParts.join(':').trim();
            const statusMatch = description.match(/Status:\s*(\w+)/i);
            const priorityMatch = description.match(/Priority:\s*(\w+)/i);
            const ownerMatch = description.match(/Owner:\s*([^,)]+)/i);
            
            result.useCases.push({
              id,
              title: title.trim(),
              description: description.replace(/\(.*?\)/g, '').trim(),
              status: statusMatch ? statusMatch[1].toLowerCase() : 'planned',
              priority: priorityMatch ? priorityMatch[1].toLowerCase() : 'medium',
              department: 'generated',
              lastUpdated: new Date(),
              owner: ownerMatch ? ownerMatch[1].trim() : 'Unknown'
            });
          } else if (currentSection === 'promptsTools') {
            const [title, ...descParts] = content.split(':');
            const description = descParts.join(':').trim();
            const categoryMatch = description.match(/Category:\s*(\w+)/i);
            const tagsMatch = description.match(/Tags:\s*([^,)]+)/i);
            const ratingMatch = description.match(/Rating:\s*([\d.]+)/i);
            const authorMatch = description.match(/Author:\s*([^,)]+)/i);
            
            result.promptsTools.push({
              id,
              title: title.trim(),
              description: description.replace(/\(.*?\)/g, '').trim(),
              category: categoryMatch ? categoryMatch[1].toLowerCase() : 'prompt',
              department: 'generated',
              tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [],
              usage: Math.floor(Math.random() * 200) + 50,
              rating: ratingMatch ? parseFloat(ratingMatch[1]) : 4.0,
              lastUpdated: new Date(),
              author: authorMatch ? authorMatch[1].trim() : 'Unknown'
            });
          } else if (currentSection === 'workshops') {
            const [title, ...descParts] = content.split(':');
            const description = descParts.join(':').trim();
            const typeMatch = description.match(/Type:\s*(\w+)/i);
            const dateMatch = description.match(/Date:\s*([\d-]+)/i);
            const durationMatch = description.match(/Duration:\s*([^,)]+)/i);
            const instructorMatch = description.match(/Instructor:\s*([^,)]+)/i);
            const attendeesMatch = description.match(/Attendees:\s*(\d+)/i);
            
            result.workshops.push({
              id,
              title: title.trim(),
              description: description.replace(/\(.*?\)/g, '').trim(),
              type: typeMatch ? typeMatch[1].toLowerCase() : 'upcoming',
              date: dateMatch ? new Date(dateMatch[1]) : new Date(),
              duration: durationMatch ? durationMatch[1].trim() : '1 hour',
              department: 'generated',
              instructor: instructorMatch ? instructorMatch[1].trim() : 'TBD',
              attendees: attendeesMatch ? parseInt(attendeesMatch[1]) : 0
            });
          } else if (currentSection === 'teamMembers') {
            const [name, ...roleParts] = content.split(':');
            const roleAndDetails = roleParts.join(':').trim();
            const expertiseMatch = roleAndDetails.match(/Expertise:\s*([^,)]+)/i);
            const emailMatch = roleAndDetails.match(/Email:\s*([^,)]+)/i);
            
            result.teamMembers.push({
              id,
              name: name.trim(),
              role: roleAndDetails.replace(/\(.*?\)/g, '').trim(),
              department: 'generated',
              expertise: expertiseMatch ? expertiseMatch[1].split(',').map(e => e.trim()) : [],
              email: emailMatch ? emailMatch[1].trim() : 'unknown@company.com'
            });
          }
        }
      });
    } else if (sectionType === 'enablement') {
      result.resources = [];
      let currentSection = '';
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.toUpperCase().includes('TRAINING') || trimmed.toUpperCase().includes('RESOURCES')) {
          currentSection = 'resources';
        } else if (trimmed.toUpperCase().includes('TOOLS') || trimmed.toUpperCase().includes('GUIDES')) {
          currentSection = 'resources';
        } else if (trimmed.startsWith('-') && currentSection === 'resources') {
          const content = trimmed.substring(1).trim();
          const [title, ...descParts] = content.split(':');
          const description = descParts.join(':').trim();
          const typeMatch = description.match(/Type:\s*(\w+)/i);
          const urlMatch = description.match(/URL:\s*(https?:\/\/[^\s,)]+)/i);
          const id = `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          result.resources.push({
            id,
            title: title.trim(),
            description: description.replace(/\(.*?\)/g, '').trim(),
            type: typeMatch ? typeMatch[1].toLowerCase() : 'guide',
            url: urlMatch ? urlMatch[1] : undefined,
            lastUpdated: new Date()
          });
        }
      });
    }

    return result;
  };

  const handleGenerateContent = (sectionType: string) => {
    console.log(`Generating content for ${sectionType} from text:`, textInput);
    
    const parsedData = parseTextToStructuredData(textInput, sectionType);
    
    if (sectionType === 'departments') {
      const updatedDepartments = [...departments];
      if (updatedDepartments.length > 0) {
        const targetDept = updatedDepartments[0];
        targetDept.useCases = [...targetDept.useCases, ...parsedData.useCases];
        targetDept.promptsTools = [...targetDept.promptsTools, ...parsedData.promptsTools];
        targetDept.workshops = [...targetDept.workshops, ...parsedData.workshops];
        targetDept.teamMembers = [...targetDept.teamMembers, ...parsedData.teamMembers];
        setDepartments(updatedDepartments);
      }
    } else if (sectionType === 'enablement') {
      setEnablementResources([...enablementResources, ...parsedData.resources]);
    }
    
    setTextInput('');
    setShowContentGenerator(null);
  };

  const renderContentGenerator = (sectionType: string) => (
    <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        AI Content Generator - {sectionType}
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={8}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder={getExamplePrompt(sectionType)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
          variant="contained" 
          onClick={() => handleGenerateContent(sectionType)}
          disabled={!textInput.trim()}
        >
          Generate Content
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => setShowContentGenerator(null)}
        >
          Cancel
        </Button>
        <Button 
          variant="text" 
          onClick={() => setTextInput(getExamplePrompt(sectionType))}
        >
          Load Example
        </Button>
      </Box>
    </Paper>
  );

  const renderDepartmentSection = (department: AIDepartment) => (
    <Accordion
      key={department.id}
      expanded={expandedDepartment === department.id}
      onChange={handleDepartmentChange(department.id)}
      sx={{ mb: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getDepartmentIcon(department.id)}
          <Box>
            <Typography variant="h6">{department.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {department.description}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label={`Use Cases (${department.useCases.length})`} />
          <Tab label={`Tools & Prompts (${department.promptsTools.length})`} />
          <Tab label={`Workshops (${department.workshops.length})`} />
          <Tab label={`Team (${department.teamMembers.length})`} />
        </Tabs>

        {selectedTab === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Active & High-Priority Use Cases</Typography>
            {department.useCases.length > 0 ? (
              department.useCases.map(renderUseCase)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No use cases available for this department.
              </Typography>
            )}
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Reusable Prompts & Tools</Typography>
            {department.promptsTools.length > 0 ? (
              department.promptsTools.map(renderPromptTool)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No prompts or tools available for this department.
              </Typography>
            )}
          </Box>
        )}

        {selectedTab === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Workshops & Training</Typography>
            {department.workshops.length > 0 ? (
              department.workshops.map(renderWorkshop)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No workshops scheduled for this department.
              </Typography>
            )}
          </Box>
        )}

        {selectedTab === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Team Highlights</Typography>
            {department.teamMembers.length > 0 ? (
              department.teamMembers.map(renderTeamMember)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No team members listed for this department.
              </Typography>
            )}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
        AI Portal
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Centralized hub for AI-related updates, best practices, and resources across the organization
      </Typography>

      {/* Departmental Sections */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Departmental AI Initiatives
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => setShowContentGenerator('departments')}
          >
            Generate from Text
          </Button>
        </Box>
        {showContentGenerator === 'departments' && renderContentGenerator('Departmental Content')}
        {departments.map(renderDepartmentSection)}
      </Paper>

      {/* Gen AI Enablement/Training/Workshops Announcements */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Gen AI Enablement/Training/Workshops Announcements
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => setShowContentGenerator('enablement')}
          >
            Generate from Text
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Organization-wide training resources, onboarding kits, and links to internal AI tools and learning journeys.
        </Typography>
        {showContentGenerator === 'enablement' && renderContentGenerator('Enablement Resources')}
        <Grid container spacing={3}>
          {enablementResources.map((resource) => (
            <Grid key={resource.id} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h3">
                      {resource.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => setEditingItem({type: 'enablementResource', id: resource.id})}
                        sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <Chip 
                        label={resource.type} 
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {resource.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {resource.url && (
                      <Button 
                        size="small" 
                        startIcon={<Launch />}
                        href={resource.url}
                        target="_blank"
                      >
                        Access Resource
                      </Button>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Updated: {resource.lastUpdated.toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* AI Best Practices and AI Security Framework */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            AI Best Practices and AI Security Framework
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => setShowContentGenerator('best-practices')}
          >
            Generate from Text
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          AI governance guidelines, ethical considerations, model usage policies, and enterprise prompting standards.
        </Typography>
        {showContentGenerator === 'best-practices' && renderContentGenerator('Best Practices')}
        <Grid container spacing={3}>
          {bestPractices.map((practice) => (
            <Grid key={practice.id} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getCategoryIcon(practice.category)}
                      <Typography variant="h6" component="h3">
                        {practice.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => setEditingItem({type: 'bestPractice', id: practice.id})}
                        sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <Chip 
                        label={practice.importance} 
                        color={getImportanceColor(practice.importance) as any}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {practice.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={practice.category} 
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Updated: {practice.lastUpdated.toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AIPortal;
