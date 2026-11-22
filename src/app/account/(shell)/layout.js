'use client';

import React from 'react';
import AccountShell from '@/components/account/AccountShell';

export default function ShellLayout({ children }) {
  return <AccountShell>{children}</AccountShell>;
}
