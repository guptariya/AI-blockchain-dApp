// AI Service for OpenAI and other AI integrations
// Note: You'll need to add your OpenAI API key in environment variables

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * Call OpenAI API for chat completions
 */
export const chatWithAI = async (messages, model = 'gpt-3.5-turbo') => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file')
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      const errorMessage = error.error?.message || `HTTP ${response.status}: ${response.statusText}`
      
      // Provide user-friendly error messages
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.')
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      } else if (response.status === 500) {
        throw new Error('OpenAI service error. Please try again later.')
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'No response from AI'
  } catch (error) {
    console.error('AI Service Error:', error)
    // Re-throw with user-friendly message if it's not already an Error object
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to connect to AI service. Please check your internet connection and try again.')
  }
}

/**
 * Analyze smart contract code
 */
export const analyzeContract = async (contractCode) => {
  const systemPrompt = `You are an expert smart contract security auditor. Analyze the provided contract code and identify:
1. Security vulnerabilities
2. Gas optimization opportunities
3. Best practice violations
4. Risk level (Low/Medium/High)
5. Recommendations for improvement

Format your response as JSON with the following structure:
{
  "riskLevel": "High|Medium|Low",
  "vulnerabilities": ["list of issues"],
  "gasOptimizations": ["suggestions"],
  "bestPractices": ["violations"],
  "recommendations": ["improvements"],
  "summary": "brief summary"
}`

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Analyze this smart contract:\n\n${contractCode}` },
  ]

  try {
    const response = await chatWithAI(messages)
    // Try to parse JSON response
    try {
      return JSON.parse(response)
    } catch {
      // If not JSON, return as text
      return {
        riskLevel: 'Unknown',
        summary: response,
        vulnerabilities: [],
        gasOptimizations: [],
        bestPractices: [],
        recommendations: [],
      }
    }
  } catch (error) {
    throw error
  }
}

/**
 * Assess transaction risk
 */
export const assessTransactionRisk = async (transactionData) => {
  const systemPrompt = `You are an expert blockchain security analyst. Analyze this transaction and assess:
1. Risk level (Low/Medium/High/Critical)
2. Potential scams or malicious activity
3. Gas optimization suggestions
4. Success probability
5. Warnings or red flags

Format your response as JSON:
{
  "riskLevel": "Low|Medium|High|Critical",
  "successProbability": 0.0-1.0,
  "warnings": ["list of warnings"],
  "gasOptimization": "suggestion",
  "isSafe": true|false,
  "explanation": "detailed explanation"
}`

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Analyze this transaction:\n\n${JSON.stringify(transactionData, null, 2)}` },
  ]

  try {
    const response = await chatWithAI(messages)
    try {
      return JSON.parse(response)
    } catch {
      return {
        riskLevel: 'Unknown',
        successProbability: 0.5,
        warnings: [],
        isSafe: false,
        explanation: response,
      }
    }
  } catch (error) {
    throw error
  }
}

/**
 * Get blockchain education/explanation
 */
export const explainBlockchain = async (question) => {
  const systemPrompt = `You are an expert blockchain and Web3 educator. Provide clear, accurate explanations about blockchain technology, Ethereum, DeFi, smart contracts, and related topics. Keep explanations beginner-friendly but accurate.`

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ]

  try {
    return await chatWithAI(messages)
  } catch (error) {
    throw error
  }
}

/**
 * Convert natural language to contract interaction
 */
export const parseNaturalLanguage = async (userIntent, contractABI) => {
  const systemPrompt = `You are a smart contract interaction assistant. Given a user's intent in natural language and a contract ABI, determine:
1. Which function to call
2. What parameters to use
3. Estimated gas
4. Explanation of what will happen

Format as JSON:
{
  "functionName": "function name",
  "parameters": ["param1", "param2"],
  "estimatedGas": "gas estimate",
  "explanation": "what this will do"
}`

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `User wants: ${userIntent}\n\nContract ABI:\n${JSON.stringify(contractABI, null, 2)}` },
  ]

  try {
    const response = await chatWithAI(messages)
    try {
      return JSON.parse(response)
    } catch {
      return {
        functionName: 'unknown',
        parameters: [],
        explanation: response,
      }
    }
  } catch (error) {
    throw error
  }
}

/**
 * Mock price prediction (for demo - replace with actual ML model)
 */
export const predictTokenPrice = async (tokenAddress, timeframe = '24h') => {
  // This is a mock - in production, use a trained ML model
  return {
    currentPrice: 100,
    predictedPrice: 105,
    confidence: 0.75,
    trend: 'up',
    timeframe,
    factors: [
      'Market sentiment: Positive',
      'Trading volume: Increasing',
      'Technical indicators: Bullish',
    ],
  }
}
