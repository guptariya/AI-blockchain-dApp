import React from 'react'
import { AlertTriangle } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-400">Something went wrong</h2>
                <p className="text-gray-400">An unexpected error occurred</p>
              </div>
            </div>
            
            {this.state.error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-200 font-mono text-sm">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg font-semibold hover:from-cyan-400 hover:to-pink-400 transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
