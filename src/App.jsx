import { useState, useEffect } from 'react'
import { Zap, Brain, Shield, TrendingUp, MessageSquare, Sparkles, Home, AlertCircle, Cloud, CloudOff } from 'lucide-react'
import ChatAssistant from './components/AI/ChatAssistant'
import ContractAnalyzer from './components/AI/ContractAnalyzer'
import RiskAssessment from './components/AI/RiskAssessment'
import GasFeePredictor from './components/AI/GasFeePredictor'
import WalletConnection from './components/WalletConnection'
import ErrorBoundary from './components/ErrorBoundary'
import { isFirebaseConfigured } from './config/firebase'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [apiKeyConfigured, setApiKeyConfigured] = useState(true)
  const [firebaseConfigured, setFirebaseConfigured] = useState(false)

  useEffect(() => {
    // Check if API key is configured
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    setApiKeyConfigured(!!apiKey)
    
    // Check if Firebase is configured
    setFirebaseConfigured(isFirebaseConfigured())
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-[#0f0f1a]/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-lg"></div>
                <Brain className="w-8 h-8 text-cyan-400 relative z-10" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold gradient-text tracking-tight">AI Blockchain DApp</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <WalletConnection />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-500 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <Sparkles className="w-20 h-20 text-cyan-400 relative z-10 mx-auto drop-shadow-[0_0_20px_rgba(0,245,255,0.6)]" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text tracking-tight">
              AI-Powered Blockchain
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-cyan-200 mb-4 font-light drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">
              Intelligent Web3 Platform
            </p>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Combine the power of AI with blockchain technology. Analyze contracts, assess risks, predict prices, and interact with smart contracts using natural language.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={Brain}
              title="AI Contract Analyzer"
              description="Analyze smart contracts for vulnerabilities and security issues using AI"
              color="cyan"
            />
            <FeatureCard
              icon={Shield}
              title="Risk Assessment"
              description="AI-powered transaction risk analysis before execution"
              color="pink"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Price Predictor"
              description="ML-powered token price predictions and market analysis"
              color="yellow"
            />
            <FeatureCard
              icon={MessageSquare}
              title="AI Assistant"
              description="Chat with AI to learn about blockchain and get help"
              color="green"
            />
            <FeatureCard
              icon={Zap}
              title="Smart Interactions"
              description="Natural language to contract calls - just describe what you want"
              color="cyan"
            />
            <FeatureCard
              icon={Sparkles}
              title="Portfolio Advisor"
              description="AI-powered portfolio analysis and optimization suggestions"
              color="pink"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-cyan-500/20 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'home'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'analyzer'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              <Brain className="w-5 h-5" />
              Contract Analyzer
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'risk'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              <Shield className="w-5 h-5" />
              Risk Assessment
            </button>
            <button
              onClick={() => setActiveTab('gas')}
              className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'gas'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              <Zap className="w-5 h-5" />
              Gas Fee Predictor
            </button>
          </div>

          {/* API Key Warning */}
          {!apiKeyConfigured && (
            <div className="glass-card rounded-xl p-4 mb-6 border-yellow-500/40 bg-yellow-500/10">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-yellow-200 text-sm">
                    <strong>OpenAI API Key not configured.</strong> Please create a <code className="bg-black/30 px-1 rounded">.env</code> file with <code className="bg-black/30 px-1 rounded">VITE_OPENAI_API_KEY=your_key_here</code> to use AI features.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Firebase Status */}
          <div className={`glass-card rounded-xl p-3 mb-6 border ${firebaseConfigured ? 'border-green-500/40 bg-green-500/10' : 'border-gray-500/40 bg-gray-500/10'}`}>
            <div className="flex items-center gap-3">
              {firebaseConfigured ? (
                <>
                  <Cloud className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-green-200 text-sm">
                      <strong>Firebase Connected</strong> - Your data is being synced to the cloud.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CloudOff className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">
                      <strong>Firebase Not Configured</strong> - Using local storage. See <code className="bg-black/30 px-1 rounded">FIREBASE_SETUP.md</code> to enable cloud sync.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'home' ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold gradient-text mb-4">🚀 AI Features</h2>
              <p className="text-gray-300 mb-6">
                Explore the AI-powered features above. Each feature demonstrates the integration of AI with blockchain technology.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <span className="px-4 py-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">OpenAI Integration</span>
                <span className="px-4 py-2 bg-pink-500/10 rounded-lg border border-pink-500/20">Smart Contract Analysis</span>
                <span className="px-4 py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">ML Price Prediction</span>
                <span className="px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/20">Risk Assessment</span>
              </div>
            </div>
          ) : activeTab === 'chat' ? (
            <ChatAssistant />
          ) : activeTab === 'analyzer' ? (
            <ContractAnalyzer />
          ) : activeTab === 'risk' ? (
            <RiskAssessment />
          ) : activeTab === 'gas' ? (
            <GasFeePredictor />
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="mb-2">
            Created by <span className="text-cyan-400 font-semibold">Riya Gupta</span>
          </p>
          <p>AI + Blockchain = Future of Web3</p>
        </div>
      </footer>
      </div>
    </ErrorBoundary>
  )
}

function FeatureCard({ icon: Icon, title, description, color }) {
  const colorClasses = {
    cyan: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/20',
    pink: 'text-pink-400 bg-pink-500/20 border-pink-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/20',
    green: 'text-green-400 bg-green-500/20 border-green-500/20',
  }

  return (
    <div className={`glass-card rounded-xl p-6 hover:scale-105 transition-all duration-300 ${colorClasses[color]}`}>
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

export default App
