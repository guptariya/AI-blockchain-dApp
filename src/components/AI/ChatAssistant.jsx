import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Bot, User, Loader, Trash2, Cloud, CloudOff } from 'lucide-react'
import { chatWithAI, explainBlockchain } from '../../services/aiService'
import { saveChatMessage, getChatHistory } from '../../services/firebaseService'
import { isFirebaseConfigured } from '../../config/firebase'
import { useWallet } from '../../hooks/useWallet'

const ChatAssistant = () => {
  const STORAGE_KEY = 'ai-chat-history'
  const { account } = useWallet()
  const userId = account || 'anonymous'
  const firebaseEnabled = isFirebaseConfigured()
  
  // Load chat history from Firebase or localStorage
  const loadHistory = async () => {
    const defaultMessage = [
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI blockchain assistant. I can help you understand blockchain concepts, analyze contracts, and answer your Web3 questions. How can I help you today?',
      },
    ]

    if (firebaseEnabled && account) {
      try {
        const firebaseHistory = await getChatHistory(userId)
        if (firebaseHistory && firebaseHistory.length > 0) {
          return firebaseHistory.map(msg => ({
            role: msg.role,
            content: msg.content,
          }))
        }
      } catch (err) {
        console.error('Failed to load from Firebase:', err)
      }
    }

    // Fallback to localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (err) {
      console.error('Failed to load from localStorage:', err)
    }

    return defaultMessage
  }

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const messagesEndRef = useRef(null)

  // Load history on mount
  useEffect(() => {
    const load = async () => {
      setIsLoadingHistory(true)
      const history = await loadHistory()
      setMessages(history)
      setIsLoadingHistory(false)
    }
    load()
  }, [account, firebaseEnabled])

  // Save chat history to Firebase or localStorage
  useEffect(() => {
    if (messages.length === 0 || isLoadingHistory) return

    const saveMessage = async () => {
      const lastMessage = messages[messages.length - 1]
      
      if (firebaseEnabled && account && lastMessage) {
        try {
          await saveChatMessage(userId, lastMessage)
        } catch (err) {
          console.error('Failed to save to Firebase:', err)
          // Fallback to localStorage
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
          } catch (localErr) {
            console.error('Failed to save to localStorage:', localErr)
          }
        }
      } else {
        // Use localStorage as fallback
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
        } catch (err) {
          console.error('Failed to save to localStorage:', err)
        }
      }
    }

    saveMessage()
  }, [messages, account, firebaseEnabled, userId, isLoadingHistory])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await explainBlockchain(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: error.message || 'Sorry, I encountered an error. Please make sure your OpenAI API key is configured.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-6 h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">AI Blockchain Assistant</h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400">Ask me anything about blockchain and Web3</p>
                {firebaseEnabled ? (
                  <Cloud className="w-4 h-4 text-green-400" title="Firebase enabled - data synced to cloud" />
                ) : (
                  <CloudOff className="w-4 h-4 text-gray-500" title="Firebase not configured - using local storage" />
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm('Clear chat history?')) {
                setMessages([
                  {
                    role: 'assistant',
                    content: 'Hello! I\'m your AI blockchain assistant. I can help you understand blockchain concepts, analyze contracts, and answer your Web3 questions. How can I help you today?',
                  },
                ])
                // Clear localStorage
                try {
                  localStorage.removeItem(STORAGE_KEY)
                } catch (err) {
                  console.error('Failed to clear localStorage:', err)
                }
              }
            }}
            className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-6 h-6 animate-spin text-cyan-400" />
            </div>
          ) : (
            messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30'
                    : 'bg-gray-800/50 text-gray-200 border border-gray-700/50'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-pink-400" />
                </div>
              )}
            </div>
          ))
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <Loader className="w-5 h-5 animate-spin text-cyan-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 pt-4 border-t border-cyan-500/20">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about blockchain, DeFi, smart contracts..."
            className="flex-1 px-4 py-3 bg-black/20 border border-cyan-500/20 rounded-lg focus:outline-none focus:border-cyan-500/40 text-white placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg font-semibold hover:from-cyan-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="glass-card rounded-xl p-4 mt-4">
        <p className="text-sm text-gray-400 text-center">
          💡 <strong>Tip:</strong> Ask about smart contracts, DeFi protocols, gas optimization, or any blockchain concept!
        </p>
      </div>
    </div>
  )
}

export default ChatAssistant
