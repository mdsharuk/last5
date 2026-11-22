'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { Steps, FaqList } from '@/components/ui';
import { FAQS } from '@/lib/data';
import { useTitle } from '@/lib/useTitle';

export default function HowItWorksPage() {
  useTitle('How it works');
  return (
    <>
      <section className="hero-centered">
        <div className="eyebrow">A SMALL HABIT. A GOOD DIFFERENCE.</div>
        <h1>Good food is just<br />three little steps away.</h1>
        <p>Find food you’ll enjoy, pay a little less, and collect it from a neighbourhood shop. Clear details from the first click to the last bite.</p>
        <div className="more-row"><Link className="button" href="/explore">Find your first good bite <Icon name="arrow" /></Link></div>
      </section>
      <section className="section">
        <div className="container"><Steps /></div>
      </section>
      <section className="section cream">
        <div className="container">
          <div className="story-panel">
            <img src="/assets/sandwich.jpg" alt="A toasted sandwich ready to enjoy" loading="lazy" />
            <div className="story-copy">
              <div className="eyebrow">NO GUESSWORK IN YOUR BAG</div>
              <h2>Know your food.<br /><em>Love your find.</em></h2>
              <p>The included items, price, available quantity and collection window are visible before you buy. Ingredients and allergen information are supplied by the shop.</p>
              <Link className="text-link" href="/explore">Explore available food <Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container faq-layout">
          <div>
            <h2>A few good questions.</h2>
            <p>From online payment to the collection counter, a little clarity helps.</p>
            <Link className="text-link" href="/help">More in our help centre <Icon name="arrow" /></Link>
          </div>
          <div><FaqList items={FAQS.filter((_, i) => [3, 4, 5, 8].includes(i))} /></div>
        </div>
      </section>
    </>
  );
}
