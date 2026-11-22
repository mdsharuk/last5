'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/AppProvider';
import { PageIntro, Empty } from '@/components/ui';
import { ApplicationStatus } from '../apply/page';
import { useTitle } from '@/lib/useTitle';

export default function ApplicationStatusPage() {
  useTitle('Application status');
  const { s } = useApp();
  if (!s.partnerApplication) {
    return (
      <>
        <PageIntro title="A new chance for your shop." sub="Preview the merchant application in three small steps. No real application or document is submitted." eyebrow="BECOME A LAST5 PARTNER" />
        <section className="section">
          <div className="container">
            <Empty title="No sample application yet." text="Preview the merchant application to see how the review status works." href="/partners/apply" label="Open the application" />
          </div>
        </section>
      </>
    );
  }
  return (
    <>
      <PageIntro title="Application status" sub="Your sample merchant application and its review state." eyebrow="BECOME A LAST5 PARTNER" />
      <ApplicationStatus app={s.partnerApplication} />
    </>
  );
}
