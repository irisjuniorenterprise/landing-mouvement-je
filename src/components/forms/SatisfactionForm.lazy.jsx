'use client';

import dynamic from 'next/dynamic';
import { FormSkeleton } from '@/components/ui/Skeleton';

const SatisfactionForm = dynamic(() => import('./SatisfactionForm'), {
  ssr: false,
  loading: () => (
    <section id="satisfaction" className="section-padding bg-surface">
      <FormSkeleton fields={2} />
    </section>
  ),
});

export default SatisfactionForm;