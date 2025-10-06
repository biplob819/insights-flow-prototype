import { Suspense } from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export function PageLoading() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
        </div>
      </div>
    </Suspense>
  );
}
