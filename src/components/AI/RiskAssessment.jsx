import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Zap, Loader, Copy, Check } from 'lucide-react'
import { assessTransactionRisk } from '../../services/aiService'
import { isValidEthereumAddress, copyToClipboard } from '../../utils/clipboard'

const RiskAssessment = () => {
  const [transactionData, setTransactionData] = useState({
    to: '',
    value: '',
    data: '',
    gasLimit: '',
  })
  const [assessment, setAssessment] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleAssess = async () => {
    if (!transactionData.to) {
      setError('Please enter recipient address')
      return
    }

    if (!isValidEthereumAddress(transactionData.to)) {
      setError('Invalid Ethereum address format')
      return
    }

    setIsLoading(true)
    setError(null)
    setAssessment(null)

    try {
      const result = await assessTransactionRisk(transactionData)
      setAssessment(result)
    } catch (err) {
      setError(err.message || 'Failed to assess transaction risk')
      console.error('Assessment error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'text-red-400 bg-red-500/20 border-red-500/40'
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40'
      case 'low':
        return 'text-green-400 bg-green-500/20 border-green-500/40'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/40'
    }
  }

  const getSuccessColor = (probability) => {
    if (probability >= 0.8) return 'text-green-400'
    if (probability >= 0.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-cyan-400" />
          <div>
            <h2 className="text-2xl font-bold gradient-text">AI Transaction Risk Assessment</h2>
            <p className="text-gray-400">Analyze transactions before execution for potential risks</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
            <div className="relative">
              <input
                type="text"
                value={transactionData.to}
                onChange={(e) => {
                  setTransactionData({ ...transactionData, to: e.target.value })
                  setError(null)
                }}
                placeholder="0x..."
                className={`w-full px-4 py-3 pr-10 bg-black/20 border rounded-lg focus:outline-none text-white font-mono ${
                  transactionData.to && !isValidEthereumAddress(transactionData.to)
                    ? 'border-red-500/40 focus:border-red-500/60'
                    : 'border-cyan-500/20 focus:border-cyan-500/40'
                }`}
              />
              {transactionData.to && (
                <button
                  onClick={async () => {
                    const success = await copyToClipboard(transactionData.to)
                    if (success) {
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  title="Copy address"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            {transactionData.to && !isValidEthereumAddress(transactionData.to) && (
              <p className="text-xs text-red-400 mt-1">Invalid Ethereum address format</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Value (ETH)</label>
            <input
              type="text"
              value={transactionData.value}
              onChange={(e) => setTransactionData({ ...transactionData, value: e.target.value })}
              placeholder="0.1"
              className="w-full px-4 py-3 bg-black/20 border border-cyan-500/20 rounded-lg focus:outline-none focus:border-cyan-500/40 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Transaction Data (Optional)</label>
            <textarea
              value={transactionData.data}
              onChange={(e) => setTransactionData({ ...transactionData, data: e.target.value })}
              placeholder="0x..."
              className="w-full h-24 px-4 py-3 bg-black/20 border border-cyan-500/20 rounded-lg focus:outline-none focus:border-cyan-500/40 text-white font-mono text-sm"
            />
          </div>

          <button
            onClick={handleAssess}
            disabled={isLoading || !transactionData.to}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg font-semibold hover:from-cyan-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Assessing Risk...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Assess Transaction Risk
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

      {/* Assessment Results */}
      {assessment && (
        <div className="space-y-6">
          {/* Risk Summary */}
          <div className={`glass-card rounded-xl p-6 border-2 ${getRiskColor(assessment.riskLevel)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {assessment.isSafe ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <AlertTriangle className="w-8 h-8" />
                )}
                <div>
                  <div className="text-sm text-gray-400 mb-1">Risk Level</div>
                  <div className="text-2xl font-bold">{assessment.riskLevel || 'Unknown'}</div>
                </div>
              </div>
              {assessment.successProbability !== undefined && (
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Success Probability</div>
                  <div className={`text-2xl font-bold ${getSuccessColor(assessment.successProbability)}`}>
                    {(assessment.successProbability * 100).toFixed(0)}%
                  </div>
                </div>
              )}
            </div>
            {assessment.explanation && (
              <p className="text-gray-300">{assessment.explanation}</p>
            )}
          </div>

          {/* Warnings */}
          {assessment.warnings && assessment.warnings.length > 0 && (
            <div className="glass-card rounded-xl p-6 border-red-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Warnings
              </h3>
              <ul className="space-y-2">
                {assessment.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-red-400 mt-1">⚠</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gas Optimization */}
          {assessment.gasOptimization && (
            <div className="glass-card rounded-xl p-6 border-yellow-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Gas Optimization
              </h3>
              <p className="text-gray-300">{assessment.gasOptimization}</p>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="glass-card rounded-xl p-4 mt-6">
        <p className="text-sm text-gray-400">
          <strong className="text-cyan-400">Note:</strong> This AI risk assessment analyzes transactions for potential scams, 
          malicious contracts, and optimization opportunities. Always verify addresses and review transactions carefully.
        </p>
      </div>
    </div>
  )
}

export default RiskAssessment
