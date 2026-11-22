'use client';

import React from 'react';
import Icon from '@/lib/icons';
import Link from 'next/link';
import { SectionHead, Steps, FaqList } from '@/components/ui';
import { AboutView } from '@/components/AboutView';
import { FAQS } from '@/lib/data';
import { pic } from '@/lib/format';
import { useTitle } from '@/lib/useTitle';

export default function AboutPage() {
  useTitle('Our story');
  return <AboutView />;
}
