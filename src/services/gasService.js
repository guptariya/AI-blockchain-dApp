// Gas fee estimation service
import { ethers } from 'ethers'

/**
 * Get current gas prices from the network
 */
export const getGasPrices = async (provider) => {
  try {
    const feeData = await provider.getFeeData()
    return {
      gasPrice: feeData.gasPrice,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    }
  } catch (error) {
    console.error('Error fetching gas prices:', error)
    throw error
  }
}

/**
 * Estimate gas for a simple ETH transfer
 */
export const estimateTransferGas = async (provider, to, value, from) => {
  try {
    const gasEstimate = await provider.estimateGas({
      to,
      value: ethers.parseEther(value || '0'),
      from,
    })
    return gasEstimate
  } catch (error) {
    console.error('Error estimating transfer gas:', error)
    throw error
  }
}

/**
 * Estimate gas for a contract interaction
 */
export const estimateContractGas = async (provider, to, data, from, value = '0') => {
  try {
    const gasEstimate = await provider.estimateGas({
      to,
      data,
      value: ethers.parseEther(value),
      from,
    })
    return gasEstimate
  } catch (error) {
    console.error('Error estimating contract gas:', error)
    throw error
  }
}

/**
 * Calculate total gas cost in ETH
 */
export const calculateGasCost = (gasLimit, gasPrice) => {
  if (!gasLimit || !gasPrice) return null
  return gasLimit * gasPrice
}

/**
 * Format gas cost for display
 */
export const formatGasCost = (gasCost, decimals = 6) => {
  if (!gasCost) return '0'
  const ethValue = ethers.formatEther(gasCost)
  return parseFloat(ethValue).toFixed(decimals)
}

/**
 * Get ETH price in USD (using CoinGecko API)
 */
export const getETHPrice = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    const data = await response.json()
    return data.ethereum?.usd || 0
  } catch (error) {
    console.error('Error fetching ETH price:', error)
    return 0
  }
}

/**
 * Estimate gas fee for a transaction
 */
export const estimateGasFee = async (provider, transactionData) => {
  try {
    const { to, value, data, from } = transactionData

    // Get current gas prices
    const feeData = await getGasPrices(provider)
    const gasPrice = feeData.gasPrice || feeData.maxFeePerGas

    // Estimate gas limit
    let gasLimit
    if (data && data !== '0x') {
      // Contract interaction
      gasLimit = await estimateContractGas(provider, to, data, from, value)
    } else {
      // Simple transfer
      gasLimit = await estimateTransferGas(provider, to, value, from)
    }

    // Calculate total cost
    const totalCost = calculateGasCost(gasLimit, gasPrice)

    // Get ETH price for USD conversion
    const ethPrice = await getETHPrice()
    const costInUSD = totalCost ? parseFloat(ethers.formatEther(totalCost)) * ethPrice : 0

    return {
      gasLimit: gasLimit.toString(),
      gasPrice: gasPrice?.toString(),
      totalCostETH: formatGasCost(totalCost),
      totalCostUSD: costInUSD.toFixed(2),
      ethPriceUSD: ethPrice,
      gasPriceGwei: gasPrice ? ethers.formatUnits(gasPrice, 'gwei') : '0',
      maxFeePerGas: feeData.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
    }
  } catch (error) {
    console.error('Error estimating gas fee:', error)
    throw error
  }
}

/**
 * Get recommended gas price based on network congestion
 */
export const getRecommendedGasPrice = async (provider) => {
  try {
    const feeData = await getGasPrices(provider)
    const block = await provider.getBlock('latest')
    
    // Calculate recommended gas price (slightly higher than current for faster confirmation)
    const baseGasPrice = feeData.gasPrice || feeData.maxFeePerGas
    const recommendedGasPrice = baseGasPrice * 110n / 100n // 10% higher

    return {
      current: baseGasPrice?.toString(),
      recommended: recommendedGasPrice.toString(),
      currentGwei: baseGasPrice ? ethers.formatUnits(baseGasPrice, 'gwei') : '0',
      recommendedGwei: ethers.formatUnits(recommendedGasPrice, 'gwei'),
      blockNumber: block.number,
    }
  } catch (error) {
    console.error('Error getting recommended gas price:', error)
    throw error
  }
}
