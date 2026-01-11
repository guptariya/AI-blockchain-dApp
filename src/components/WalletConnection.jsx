import { Wallet, LogOut, Copy, Check } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { useState } from 'react'

const WalletConnection = () => {
  const { account, balance, isConnecting, error, connectWallet, disconnectWallet, formatAddress, isConnected } = useWallet()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!account) return
    try {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <Wallet className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Connected</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-cyan-300">{formatAddress(account)}</span>
              <button
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                title="Copy address"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {balance && (
            <div className="text-xs text-gray-400 ml-2">
              {parseFloat(balance).toFixed(4)} ETH
            </div>
          )}
        </div>
        <button
          onClick={disconnectWallet}
          className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Disconnect</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span className="text-xs text-red-400 mr-2">{error}</span>
      )}
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg font-semibold hover:from-cyan-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  )
}

export default WalletConnection
