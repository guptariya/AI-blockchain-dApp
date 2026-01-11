# AI-Powered Blockchain DApp

A cutting-edge decentralized application that combines Web3 technology with artificial intelligence to provide intelligent blockchain interactions.

## 🚀 Live Demo

**🌐 Live Application:** [Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/ai-blockchain-dapp)

> See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

> **Note:** This project requires an OpenAI API key for AI features to work.

## 🤖 AI Features

### ✅ Implemented

### 1. AI Smart Contract Analyzer
- Analyze contract code for vulnerabilities
- Security risk assessment (Low/Medium/High)
- Gas optimization suggestions
- Best practice recommendations
- Plain language explanations

### 2. AI Transaction Risk Assessment
- Pre-transaction risk analysis
- Scam and malicious activity detection
- Success probability prediction
- Gas optimization recommendations
- Safety warnings

### 3. AI Blockchain Assistant (Chat)
- Chat interface for blockchain questions
- Educational content about Web3
- DeFi concept explanations
- Real-time AI responses using OpenAI

### 4. Gas Fee Predictor
- Estimate gas fees for transactions before sending
- Support for simple ETH transfers and contract interactions
- Real-time gas price information
- USD cost conversion
- EIP-1559 fee details
- Recommended gas prices for faster confirmation

### 🚧 Coming Soon

### 4. AI Token Price Predictor
- ML-powered price predictions
- Market sentiment analysis
- Trading recommendations

### 5. AI Contract Interaction Helper
- Natural language to contract calls
- Auto-generate transaction parameters
- Function explanations

### 6. AI Portfolio Advisor
- Risk analysis
- Diversification suggestions
- Performance predictions

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **AI**: OpenAI API (GPT-3.5/GPT-4)
- **Blockchain**: Ethers.js v6
- **Backend/Storage**: Firebase (Firestore, optional)
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Setup OpenAI API Key

1. Create a `.env` file in the root directory:
   ```bash
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

2. Get your API key from: https://platform.openai.com/api-keys

3. Add it to the `.env` file

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3001`

### Build

```bash
npm run build
```

## 📝 Project Structure

```
ai-blockchain-dapp/
├── src/
│   ├── components/
│   │   └── AI/
│   │       ├── ChatAssistant.jsx      # AI Chat Interface
│   │       ├── ContractAnalyzer.jsx   # Contract Analysis
│   │       └── RiskAssessment.jsx     # Transaction Risk
│   ├── services/
│   │   └── aiService.js               # OpenAI Integration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env (create this)
├── package.json
└── README.md
```

## 🔑 API Keys Required

- **OpenAI API Key** - Required for all AI features
  - Get it from: https://platform.openai.com/api-keys
  - Add to `.env` file as `VITE_OPENAI_API_KEY`
  - Free tier available with $5 credit

- **Firebase Configuration** - Optional, for cloud storage and sync
  - See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for setup instructions
  - Adds cloud storage for chat history, analyses, and user data
  - App works without Firebase (uses localStorage as fallback)

## 💡 Usage

### AI Chat Assistant
1. Click on "AI Assistant" tab
2. Ask questions about blockchain, DeFi, smart contracts
3. Get instant AI-powered answers

### Contract Analyzer
1. Click on "Contract Analyzer" tab
2. Paste your Solidity contract code
3. Get security analysis and recommendations

### Risk Assessment
1. Click on "Risk Assessment" tab
2. Enter transaction details (to, value, data)
3. Get risk analysis and warnings

### Gas Fee Predictor
1. Connect your wallet
2. Click on "Gas Fee Predictor" tab
3. Enter recipient address and transaction details
4. Get gas fee estimate in ETH and USD
5. View recommended gas prices for faster confirmation

## 🎯 Skills Demonstrated

- **AI Integration**: OpenAI API integration
- **Natural Language Processing**: AI-powered text analysis
- **Security Analysis**: Smart contract vulnerability detection
- **Risk Assessment**: Transaction safety analysis
- **Modern UI/UX**: Beautiful, responsive design
- **React Development**: Component-based architecture

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase integration guide
- [IMPROVEMENTS.md](./IMPROVEMENTS.md) - List of improvements made
- [DEPLOYMENT.md](./DEPLOYMENT.md) - GitHub Pages deployment guide
- [RESUME_FEATURES.md](./RESUME_FEATURES.md) - **Features to boost your resume** 🚀
- [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md) - Implementation roadmap

## 🎯 Project Status

✅ **Core AI Features Complete**
- AI Chat Assistant ✅
- Contract Analyzer ✅
- Risk Assessment ✅
- Gas Fee Predictor ✅
- Wallet integration (MetaMask) ✅
- Firebase cloud storage ✅
- Error boundaries and better error handling ✅
- Chat history persistence ✅
- Copy to clipboard functionality ✅
- Input validation ✅

🚧 **In Development**
- Price prediction models
- Portfolio advisor
- Natural language contract interactions

📈 **Resume-Boosting Features**
- See [RESUME_FEATURES.md](./RESUME_FEATURES.md) for prioritized feature list
- See [QUICK_START_FEATURES.md](./QUICK_START_FEATURES.md) for quick implementation guide
- See [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md) for implementation timeline

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Review AI suggestions before executing transactions
- AI analysis is a tool, not a replacement for professional audits

## 📄 License

MIT

---

Built with ❤️ by **Riya Gupta** | AI + Blockchain = Future of Web3
