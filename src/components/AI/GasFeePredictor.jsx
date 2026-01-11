import { useState } from 'react'
import { Zap, DollarSign, TrendingUp, Loader, AlertCircle, Copy, Check, Info } from 'lucide-react'
import { ethers } from 'ethers'
import { estimateGasFee, getRecommendedGasPrice } from '../../services/gasService'
import { useWallet } from '../../hooks/useWallet'
import { isValidEthereumAddress, copyToClipboard } from '../../utils/clipboard'

const GasFeePredictor = () => {
  const { account, provider, isConnected } = useWallet()
  const [transactionData, setTransactionData] = useState({
    to: '',
    value: '',
    data: '',
  })
  const [gasEstimate, setGasEstimate] = useState(null)
  const [gasPriceInfo, setGasPriceInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleEstimate = async () => {
    if (!isConnected || !provider) {
      setError('Please connect your wallet first')
      return
    }

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
    setGasEstimate(null)

    try {
      // Estimate gas fee
      const estimate = await estimateGasFee(provider, {
        to: transactionData.to,
        value: transactionData.value || '0',
        data: transactionData.data || '0x',
        from: account,
      })

      // Get recommended gas price
      const recommended = await getRecommendedGasPrice(provider)

      setGasEstimate(estimate)
      setGasPriceInfo(recommended)
    } catch (err) {
      setError(err.message || 'Failed to estimate gas fee. Please check transaction details.')
      console.error('Gas estimation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatGwei = (gwei) => {
    return parseFloat(gwei).toFixed(2)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-cyan-400" />
          <div>
            <h2 className="text-2xl font-bold gradient-text">Gas Fee Predictor</h2>
            <p className="text-gray-400">Estimate gas fees for your transactions before sending</p>
          </div>
        </div>

        {!isConnected && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-yellow-200 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">Please connect your wallet to estimate gas fees</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Recipient Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={transactionData.to}
              onChange={(e) => {
                setTransactionData({ ...transactionData, to: e.target.value })
                setError(null)
              }}
              placeholder="0x..."
              className={`w-full px-4 py-3 bg-black/20 border rounded-lg focus:outline-none text-white font-mono ${
                transactionData.to && !isValidEthereumAddress(transactionData.to)
                  ? 'border-red-500/40 focus:border-red-500/60'
                  : 'border-cyan-500/20 focus:border-cyan-500/40'
              }`}
            />
            {transactionData.to && !isValidEthereumAddress(transactionData.to) && (
              <p className="text-xs text-red-400 mt-1">Invalid Ethereum address format</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount (ETH)</label>
            <input
              type="text"
              value={transactionData.value}
              onChange={(e) => setTransactionData({ ...transactionData, value: e.target.value })}
              placeholder="0.1"
              className="w-full px-4 py-3 bg-black/20 border border-cyan-500/20 rounded-lg focus:outline-none focus:border-cyan-500/40 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for contract interactions</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Transaction Data (Optional)
            </label>
            <textarea
              value={transactionData.data}
              onChange={(e) => setTransactionData({ ...transactionData, data: e.target.value })}
              placeholder="0x..."
              className="w-full h-24 px-4 py-3 bg-black/20 border border-cyan-500/20 rounded-lg focus:outline-none focus:border-cyan-500/40 text-white font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include this for contract interactions. Leave empty for simple ETH transfers.
            </p>
          </div>

          <button
            onClick={handleEstimate}
            disabled={isLoading || !isConnected || !transactionData.to}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg font-semibold hover:from-cyan-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Estimating Gas Fee...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Estimate Gas Fee
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gas Price Info */}
      {gasPriceInfo && (
        <div className="glass-card rounded-xl p-6 mb-6 border-cyan-500/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Current Network Gas Prices
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/20 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Current Gas Price</div>
              <div className="text-xl font-bold text-cyan-400">
                {formatGwei(gasPriceInfo.currentGwei)} Gwei
              </div>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Recommended Gas Price</div>
              <div className="text-xl font-bold text-yellow-400">
                {formatGwei(gasPriceInfo.recommendedGwei)} Gwei
              </div>
              <div className="text-xs text-gray-500 mt-1">~10% higher for faster confirmation</div>
            </div>
          </div>
        </div>
      )}

      {/* Gas Estimate Results */}
      {gasEstimate && (
        <div className="space-y-6">
          {/* Total Cost */}
          <div className="glass-card rounded-xl p-6 border-2 border-cyan-500/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Estimated Total Cost</div>
                <div className="text-3xl font-bold gradient-text">
                  {gasEstimate.totalCostETH} ETH
                </div>
                <div className="text-lg text-gray-300 mt-2">
                  ≈ ${gasEstimate.totalCostUSD} USD
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Gas Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gas Limit */}
            <div className="glass-card rounded-xl p-6 border-cyan-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                Gas Limit
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {parseInt(gasEstimate.gasLimit).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Units of gas</div>
                </div>
                <button
                  onClick={() => handleCopy(gasEstimate.gasLimit)}
                  className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                  title="Copy gas limit"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Gas Price */}
            <div className="glass-card rounded-xl p-6 border-cyan-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Gas Price
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {formatGwei(gasEstimate.gasPriceGwei)} Gwei
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Per gas unit</div>
                </div>
                <button
                  onClick={() => handleCopy(gasEstimate.gasPrice)}
                  className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                  title="Copy gas price"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* EIP-1559 Details (if available) */}
          {gasEstimate.maxFeePerGas && (
            <div className="glass-card rounded-xl p-6 border-pink-500/20">
              <h3 className="text-lg font-semibold mb-4">EIP-1559 Fee Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Max Fee Per Gas</div>
                  <div className="text-lg font-semibold text-pink-400">
                    {formatGwei(ethers.formatUnits(gasEstimate.maxFeePerGas, 'gwei'))} Gwei
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Max Priority Fee</div>
                  <div className="text-lg font-semibold text-pink-400">
                    {formatGwei(ethers.formatUnits(gasEstimate.maxPriorityFeePerGas, 'gwei'))} Gwei
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Breakdown */}
          <div className="glass-card rounded-xl p-6 border-gray-500/20">
            <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Gas Limit</span>
                <span className="font-mono text-cyan-300">
                  {parseInt(gasEstimate.gasLimit).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Gas Price</span>
                <span className="font-mono text-yellow-300">
                  {formatGwei(gasEstimate.gasPriceGwei)} Gwei
                </span>
              </div>
              <div className="border-t border-gray-700/50 pt-3 flex justify-between items-center">
                <span className="text-gray-300 font-semibold">Total Cost</span>
                <span className="font-mono text-lg font-bold text-cyan-400">
                  {gasEstimate.totalCostETH} ETH
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">ETH Price</span>
                <span className="font-mono text-gray-300">
                  ${gasEstimate.ethPriceUSD.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="glass-card rounded-xl p-4 bg-blue-500/10 border-blue-500/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="mb-2">
                  <strong className="text-blue-400">Note:</strong> This is an estimate. Actual gas fees may vary based on network congestion at the time of transaction.
                </p>
                <p>
                  For faster confirmation, consider using the recommended gas price shown above.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GasFeePredictor
