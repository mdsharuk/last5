'use client';

import React from 'react';
import { useApp } from '@/components/AppProvider';
import AccountModals from '@/components/account/AccountModals';

export default function AccountLayout({ children }) {
  const { toasts } = useApp();
  const last = toasts[toasts.length - 1];
  return (
    <div className="account-app">
      {children}
      <AccountModals />
      <div id="toast" role="status" aria-live="polite" className={last ? `show${last.error ? ' error' : ''}` : ''}>
        {last?.message || ''}
      </div>
    </div>
  );
}
