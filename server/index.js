require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { 
  CopilotRuntime, 
  OpenAIAdapter, 
  copilotRuntimeNodeExpressEndpoint 
} = require('@copilotkit/runtime');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for the React app
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', /\.devinapps\.com$/],
  credentials: true,
}));

app.use(express.json());

// Create the service adapter with explicit API key
const serviceAdapter = new OpenAIAdapter({
  model: 'gpt-4o',
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Create runtime (direct LLM mode)
const runtime = new CopilotRuntime();

// CopilotKit runtime endpoint using the official Express endpoint handler
app.use('/api/copilotkit', copilotRuntimeNodeExpressEndpoint({
  runtime,
  serviceAdapter,
  endpoint: '/api/copilotkit',
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`CopilotKit server running on port ${PORT}`);
});
