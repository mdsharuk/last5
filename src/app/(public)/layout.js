'use client';

import React from 'react';
import { PublicHeader, PublicFooter, PublicModals, Toasts } from '@/components/PublicChrome';

export default function PublicLayout({ children }) {
  return (
    <div className="public-app">
      <a className="skip" href="#main">Skip to content</a>
      <PublicHeader />
      <main id="main" tabIndex={-1}>{children}</main>
      <PublicFooter />
      <PublicModals />
      <Toasts />
    </div>
  );
}
