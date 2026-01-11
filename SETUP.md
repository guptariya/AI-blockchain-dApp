# AI Blockchain DApp - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env` file in the root directory:

```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy and paste it into your `.env` file

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3001`

## 📋 Features

### ✅ Implemented
- **AI Chat Assistant** - Chat with AI about blockchain topics
- **Contract Analyzer** - Analyze smart contracts for vulnerabilities
- **Risk Assessment** - Assess transaction risks before execution

### 🚧 Coming Soon
- Price Predictor (ML-powered)
- Portfolio Advisor
- Natural Language Contract Interactions

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **AI**: OpenAI API
- **Blockchain**: Ethers.js (to be integrated)

## 📝 Project Structure

```
ai-blockchain-dapp/
├── src/
│   ├── components/
│   │   └── AI/
│   │       ├── ChatAssistant.jsx
│   │       ├── ContractAnalyzer.jsx
│   │       └── RiskAssessment.jsx
│   ├── services/
│   │   └── aiService.js
│   ├── App.jsx
│   └── main.jsx
├── .env (create this)
└── package.json
```

## 🔑 API Keys

### Required
- **OpenAI API Key** - For AI features (chat, analysis, risk assessment)

### Optional (Future)
- Custom ML model endpoints
- Price prediction APIs

## 💡 Usage Tips

1. **AI Chat**: Ask questions about blockchain, DeFi, smart contracts
2. **Contract Analyzer**: Paste Solidity code to get security analysis
3. **Risk Assessment**: Enter transaction details to assess risks

## 🎯 Next Steps

1. Add wallet connection (MetaMask)
2. Integrate blockchain interactions
3. Add price prediction models
4. Implement portfolio advisor
5. Add natural language contract interactions

---

**Note**: Make sure to keep your API keys secure and never commit them to version control!
