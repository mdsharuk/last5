'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Icon from '@/lib/icons';
import { PageIntro, Breadcrumbs } from '@/components/ui';
import { StoryCard } from '@/components/AboutView';
import { STORIES } from '@/lib/data';
import { pic } from '@/lib/format';
import { useTitle } from '@/lib/useTitle';

export default function JournalPage() {
  useTitle('The good food journal');
  return (
    <>
      <PageIntro
        title="The good food journal."
        sub="Little ideas, useful tips and a fresh way to think about the food around us."
        eyebrow="A LITTLE FOOD FOR THOUGHT"
      />
      <section className="section">
        <div className="container journal-grid">
          {STORIES.map((a) => <StoryCard a={a} key={a.id} />)}
        </div>
      </section>
    </>
  );
}

export function ArticleView({ id }) {
  const a = STORIES.find((x) => x.id === id);
  useTitle(a ? a.title : 'Journal');
  if (!a) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty">
            <Icon name="book" />
            <h2>This little corner is missing.</h2>
            <p>The page or sample record could not be found. Let’s find you something good.</p>
            <Link className="button" href="/">Back to the homepage</Link>
          </div>
        </div>
      </section>
    );
  }
  return (
    <>
      <Breadcrumbs items={[['Journal', '/journal'], [a.title]]} />
      <div className="container">
        <article className="prose">
          <div className="eyebrow">{a.tag} · LAST5 JOURNAL</div>
          <h1>{a.title}</h1>
          <p>{a.summary}</p>
          <img src={pic(a.photo)} alt={a.title} fetchPriority="high" />
          {a.parts.map(([h, p]) => (
            <React.Fragment key={h}>
              <h2>{h}</h2>
              <p>{p}</p>
            </React.Fragment>
          ))}
          <div className="divider" />
          <Link className="button" href="/explore">Find your next good bite <Icon name="arrow" /></Link>
        </article>
      </div>
    </>
  );
}
