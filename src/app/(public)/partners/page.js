'use client';

import React from 'react';
import { AboutView } from '@/components/AboutView';
import { useTitle } from '@/lib/useTitle';

export default function PartnersPage() {
  useTitle('Become a partner');
  return <AboutView partner />;
}
