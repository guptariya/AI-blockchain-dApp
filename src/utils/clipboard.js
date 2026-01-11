/**
 * Utility functions for clipboard operations
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackErr) {
      console.error('Failed to copy to clipboard:', fallbackErr)
      return false
    }
  }
}

export const isValidEthereumAddress = (address) => {
  if (!address) return false
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const isValidEthereumTxHash = (hash) => {
  if (!hash) return false
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

export const formatEthereumAddress = (address) => {
  if (!address || !isValidEthereumAddress(address)) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
