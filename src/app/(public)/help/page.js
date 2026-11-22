'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { FaqList } from '@/components/ui';
import { FAQS } from '@/lib/data';
import { useTitle } from '@/lib/useTitle';

export default function HelpPage() {
  useTitle('Help centre');
  const { site, setSite } = useApp();
  const categories = ['All questions', ...new Set(FAQS.map((x) => x[0]))];
  const rows = FAQS.filter(
    ([c, q, a]) =>
      (site.helpCategory === 'All questions' || site.helpCategory === c) &&
      (!site.helpQ || `${q} ${a}`.toLowerCase().includes(site.helpQ.toLowerCase()))
  );
  return (
    <>
      <section className="hero-centered">
        <div className="eyebrow">WE’RE HERE FOR THE LITTLE QUESTIONS</div>
        <h1>A little help goes a long way.</h1>
        <p>From your first food find to collection day, find a clear answer here.</p>
        <label className="search">
          <Icon name="search" />
          <input
            type="search"
            aria-label="Search help questions"
            value={site.helpQ}
            onChange={(e) => setSite({ helpQ: e.target.value })}
            placeholder="What would you like to know?"
          />
        </label>
      </section>
      <div className="container help-layout">
        <nav className="help-topics" aria-label="Help topics">
          {categories.map((c) => (
            <button
              key={c}
              className={site.helpCategory === c ? 'active' : ''}
              onClick={() => setSite({ helpCategory: c })}
              type="button"
            >
              {c}
            </button>
          ))}
        </nav>
        <section>
          {rows.length ? (
            <FaqList items={rows} />
          ) : (
            <div className="empty">
              <Icon name="bag" />
              <h2>No matching questions just yet.</h2>
              <p>Try a shorter search or contact us.</p>
              <Link className="button" href="/contact">Ask a question</Link>
            </div>
          )}
          <div className="panel" style={{ background: 'var(--cream)', marginTop: 32 }}>
            <h2>Still need a little hand?</h2>
            <p>Keep an order question attached to its order, or open a general sample support case.</p>
            <div className="button-row">
              <Link className="button light small" href="/account/orders">My orders</Link>
              <Link className="button small" href="/contact">Contact us <Icon name="arrow" /></Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
