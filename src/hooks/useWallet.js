import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

/**
 * Custom hook for Web3 wallet connection
 */
export const useWallet = () => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection()
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const checkWalletConnection = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed')
      return
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        await connectWallet()
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to connect your wallet')
      return false
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const balance = await provider.getBalance(address)
      const network = await provider.getNetwork()

      setProvider(provider)
      setSigner(signer)
      setAccount(address)
      setBalance(ethers.formatEther(balance))
      setChainId(network.chainId.toString())

      return true
    } catch (err) {
      const errorMessage = err.code === 4001 
        ? 'Please connect to MetaMask' 
        : err.message || 'Failed to connect wallet'
      setError(errorMessage)
      return false
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setBalance(null)
    setChainId(null)
    setProvider(null)
    setSigner(null)
    setError(null)
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      connectWallet()
    }
  }

  const handleChainChanged = () => {
    // Reload page on chain change
    window.location.reload()
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return {
    account,
    balance,
    chainId,
    provider,
    signer,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isConnected: !!account,
  }
}
