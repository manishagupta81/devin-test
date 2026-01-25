import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface QualitativeAnalysis {
  executiveSummary: string;
  keyInsights: string[];
  riskFactors: string[];
  opportunities: string[];
  managementTone: {
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
    keyThemes: string[];
  };
  competitivePosition: string;
  investmentThesis: string;
}

export interface QuantitativeAnalysis {
  salesPerEmployee: { year: string; value: number }[];
  cashFlowMargins: { year: string; operatingCF: number; freeCF: number }[];
  historicalGrowthRate: { year: string; revenue: number; earnings: number; eps: number }[];
  profitabilityMargins: { year: string; ebitda: number; ebit: number; netMargin: number }[];
  epsHistory: { year: string; eps: number; growth: number }[];
  revenueEstimates: { quarter: string; actual: number; internal: number; street: number }[];
}

export interface CompanyIntelligence {
  qualitative: QualitativeAnalysis;
  quantitative: QuantitativeAnalysis;
  generatedAt: string;
}

export async function generateCompanyIntelligence(
  ticker: string,
  companyName: string
): Promise<CompanyIntelligence> {
  const prompt = `You are a financial analyst AI. Generate comprehensive intelligence data for ${companyName} (${ticker}).

Return a JSON object with the following structure:
{
  "qualitative": {
    "executiveSummary": "A 2-3 sentence executive summary of the company's current position and outlook",
    "keyInsights": ["Array of 4-5 key insights about the company"],
    "riskFactors": ["Array of 3-4 risk factors"],
    "opportunities": ["Array of 3-4 growth opportunities"],
    "managementTone": {
      "sentiment": "positive" or "neutral" or "negative",
      "score": number between 0 and 1,
      "keyThemes": ["Array of 3-4 key themes from recent communications"]
    },
    "competitivePosition": "A sentence describing competitive positioning",
    "investmentThesis": "A 2-3 sentence investment thesis"
  },
  "quantitative": {
    "salesPerEmployee": [{"year": "2019", "value": number in millions}, ... for years 2019-2024],
    "cashFlowMargins": [{"year": "2019", "operatingCF": percentage, "freeCF": percentage}, ... for years 2019-2024],
    "historicalGrowthRate": [{"year": "2019", "revenue": percentage, "earnings": percentage, "eps": percentage}, ... for years 2019-2024],
    "profitabilityMargins": [{"year": "2019", "ebitda": percentage, "ebit": percentage, "netMargin": percentage}, ... for years 2019-2024],
    "epsHistory": [{"year": "2019", "eps": dollar value, "growth": percentage}, ... for years 2019-2024],
    "revenueEstimates": [{"quarter": "Q1 2024", "actual": billions, "internal": billions, "street": billions}, ... for 4 quarters]
  }
}

Generate realistic but synthetic data based on typical metrics for a company like ${companyName} in its industry. Make the numbers plausible and internally consistent. Return ONLY the JSON object, no additional text.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a financial data analyst that generates realistic synthetic financial data and analysis. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from response');
    }

    const data = JSON.parse(jsonMatch[0]);
    
    return {
      qualitative: data.qualitative,
      quantitative: data.quantitative,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating company intelligence:', error);
    throw error;
  }
}

export async function generateMarketCommentary(
  ticker: string,
  companyName: string
): Promise<{
  recentNews: { title: string; summary: string; sentiment: string; date: string }[];
  analystComments: { analyst: string; firm: string; comment: string; rating: string; priceTarget: number }[];
  expertInsights: { expert: string; topic: string; insight: string; confidence: string }[];
}> {
  const prompt = `Generate realistic market commentary for ${companyName} (${ticker}).

Return a JSON object with:
{
  "recentNews": [
    {"title": "News headline", "summary": "Brief summary", "sentiment": "positive/neutral/negative", "date": "2024-01-XX"},
    ... (generate 4-5 news items)
  ],
  "analystComments": [
    {"analyst": "Analyst Name", "firm": "Investment Bank", "comment": "Brief comment", "rating": "Buy/Hold/Sell", "priceTarget": number},
    ... (generate 3-4 analyst comments)
  ],
  "expertInsights": [
    {"expert": "Expert title/role", "topic": "Topic area", "insight": "Detailed insight", "confidence": "High/Medium/Low"},
    ... (generate 3-4 expert insights)
  ]
}

Make the content realistic and relevant to ${companyName}'s industry and current market conditions. Return ONLY the JSON object.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a financial news and analysis generator. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating market commentary:', error);
    throw error;
  }
}

export async function generateInvestmentSummary(
  ticker: string,
  companyName: string,
  currentPrice: number
): Promise<{
  summary: string;
  bullCase: string;
  bearCase: string;
  keyMetrics: { metric: string; value: string; assessment: string }[];
  recommendation: string;
  targetPrice: number;
  confidence: number;
}> {
  const prompt = `Generate an investment summary for ${companyName} (${ticker}) with current price $${currentPrice}.

Return a JSON object with:
{
  "summary": "2-3 sentence investment summary",
  "bullCase": "Bull case thesis in 2-3 sentences",
  "bearCase": "Bear case thesis in 2-3 sentences",
  "keyMetrics": [
    {"metric": "Metric name", "value": "Value with units", "assessment": "Positive/Neutral/Negative"},
    ... (generate 5-6 key metrics)
  ],
  "recommendation": "Strong Buy/Buy/Hold/Sell/Strong Sell",
  "targetPrice": number (12-month target),
  "confidence": number between 0 and 1
}

Make the analysis realistic and consistent with typical valuations for ${companyName}. Return ONLY the JSON object.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a senior equity research analyst. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating investment summary:', error);
    throw error;
  }
}

export default {
  generateCompanyIntelligence,
  generateMarketCommentary,
  generateInvestmentSummary,
};
