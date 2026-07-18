'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResourcesEstimatorRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/build-time-estimator');
  }, [router]);

  return null;
}
