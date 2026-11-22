'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArticleView } from '../page';

export default function JournalArticlePage() {
  const { id } = useParams();
  return <ArticleView id={id} />;
}
