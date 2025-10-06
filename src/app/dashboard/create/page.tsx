'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoading } from '@/app/loading';

const DashboardBuilder = dynamic(
  () => import('@/components/DashboardBuilder/DashboardBuilder'),
  {
    ssr: false,
    loading: () => <PageLoading />
  }
);

export default function CreateDashboardPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <DashboardBuilder />
      </Suspense>
    </ErrorBoundary>
  );
}

