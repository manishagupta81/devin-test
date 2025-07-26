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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleDepartmentChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedDepartment(isExpanded ? panel : false);
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
          <Box sx={{ display: 'flex', gap: 1 }}>
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
          <Chip 
            label={tool.category} 
            color="primary"
            size="small"
            variant="outlined"
          />
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
          <Chip 
            label={workshop.type} 
            color={workshop.type === 'upcoming' ? 'success' : 'default'}
            size="small"
          />
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
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Departmental AI Initiatives
        </Typography>
        {mockDepartments.map(renderDepartmentSection)}
      </Paper>

      {/* Global Enablement Layer */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Global Enablement Layer
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Organization-wide training resources, onboarding kits, and links to internal AI tools and learning journeys.
        </Typography>
        <Grid container spacing={3}>
          {mockEnablementResources.map((resource) => (
            <Grid key={resource.id} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h3">
                      {resource.title}
                    </Typography>
                    <Chip 
                      label={resource.type} 
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
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

      {/* Global AI Best Practices and Ethics */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          AI Best Practices & Ethics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          AI governance guidelines, ethical considerations, model usage policies, and enterprise prompting standards.
        </Typography>
        <Grid container spacing={3}>
          {mockBestPractices.map((practice) => (
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
                    <Chip 
                      label={practice.importance} 
                      color={getImportanceColor(practice.importance) as any}
                      size="small"
                    />
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
