'use client';

import dynamic from 'next/dynamic';
import { FormSkeleton } from '@/components/ui/Skeleton';

const CandidatureForm = dynamic(() => import('./CandidatureForm'), {
  ssr: false,
  loading: () => (
    <section id="apply" className="section-padding bg-surface">
      <FormSkeleton fields={5} />
    </section>
  ),
});

export default CandidatureForm;