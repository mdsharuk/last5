'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ShopDetail } from '../page';

export default function ShopPage() {
  const { id } = useParams();
  return <ShopDetail id={id} />;
}
