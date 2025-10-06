'use client';

import React from 'react';
import { logger } from '@/lib/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    logger.error('Error boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.handleReset} />;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Please try refreshing the page.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-input bg-background rounded-md hover:bg-accent transition-colors"
              >
                Refresh page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-muted p-4 rounded-lg">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 text-sm text-muted-foreground overflow-auto">
                  {this.state.error.message}
                  {this.state.error.stack && `\n\n${this.state.error.stack}`}
                  {this.state.errorInfo?.componentStack && `\n\nComponent Stack:\n${this.state.errorInfo.componentStack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    logger.error('Unhandled error in component', error, {
      componentStack: errorInfo?.componentStack,
    });
  };
}
