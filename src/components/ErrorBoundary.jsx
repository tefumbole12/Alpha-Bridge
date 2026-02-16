import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We encountered an unexpected error while loading this section. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
               <Button 
                onClick={() => window.location.reload()} 
                className="bg-[#003D82] hover:bg-[#002855] text-white"
               >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
               </Button>
               <Button 
                onClick={() => window.location.href = '/'} 
                variant="outline"
                className="border-[#003D82] text-[#003D82] hover:bg-blue-50"
               >
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
               </Button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-8 text-left bg-gray-100 p-4 rounded overflow-auto text-xs font-mono max-h-40">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;