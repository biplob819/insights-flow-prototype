'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong!</h1>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Go to Home
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left bg-muted p-4 rounded-lg">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 text-sm text-muted-foreground overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
