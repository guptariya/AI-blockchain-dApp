import { useState } from 'react'
import { Brain, AlertTriangle, CheckCircle, Zap, Loader } from 'lucide-react'
import { analyzeContract } from '../../services/aiService'

const ContractAnalyzer = () => {
  const [contractCode, setContractCode] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!contractCode.trim()) {
      setError('Please enter contract code')
      return
    }

    setIsLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const result = await analyzeContract(contractCode)
      setAnalysis(result)
    } catch (err) {
      setError(err.message || 'Failed to analyze contract')
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'text-red-400 bg-red-500/20 border-red-500/40'
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40'
      case 'low':
        return 'text-green-400 bg-green-500/20 border-green-500/40'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/40'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-cyan-400" />
          <div>
            <h2 className="text-2xl font-bold gradient-text">AI Contract Analyzer</h2>
            <p className="text-gray-400">Analyze smart contracts for security vulnerabilities and optimizations</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Smart Contract Code</label>
            <textarea
              value={contractCode}
              onChange={(e) => setContractCode(e.target.value)}
              placeholder="Paste your Solidity contract code here..."
              className="w-full h-64 px-4 py-3 bg-black/20 border border-cyan-500/20 rounded-lg focus:outline-none focus:border-cyan-500/40 text-white font-mono text-sm"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !contractCode.trim()}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg font-semibold hover:from-cyan-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Analyze Contract
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Risk Level */}
          <div className={`glass-card rounded-xl p-6 border-2 ${getRiskColor(analysis.riskLevel)}`}>
            <div className="flex items-center gap-3 mb-4">
              {analysis.riskLevel?.toLowerCase() === 'high' || analysis.riskLevel?.toLowerCase() === 'critical' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <CheckCircle className="w-6 h-6" />
              )}
              <div>
                <div className="text-sm text-gray-400 mb-1">Risk Level</div>
                <div className="text-2xl font-bold">{analysis.riskLevel || 'Unknown'}</div>
              </div>
            </div>
            {analysis.summary && (
              <p className="text-gray-300">{analysis.summary}</p>
            )}
          </div>

          {/* Vulnerabilities */}
          {analysis.vulnerabilities && analysis.vulnerabilities.length > 0 && (
            <div className="glass-card rounded-xl p-6 border-red-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Security Vulnerabilities
              </h3>
              <ul className="space-y-2">
                {analysis.vulnerabilities.map((vuln, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{vuln}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gas Optimizations */}
          {analysis.gasOptimizations && analysis.gasOptimizations.length > 0 && (
            <div className="glass-card rounded-xl p-6 border-yellow-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Gas Optimizations
              </h3>
              <ul className="space-y-2">
                {analysis.gasOptimizations.map((opt, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="glass-card rounded-xl p-6 border-cyan-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="glass-card rounded-xl p-4 mt-6">
        <p className="text-sm text-gray-400">
          <strong className="text-cyan-400">Note:</strong> This AI analyzer uses OpenAI to analyze contract code. 
          For production use, consider using specialized security audit tools like Slither or Mythril in addition to AI analysis.
        </p>
      </div>
    </div>
  )
}

export default ContractAnalyzer
