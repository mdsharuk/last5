'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { SectionHead, FaqList, PartnerBanner } from '@/components/ui';
import { STORIES } from '@/lib/data';
import { pic } from '@/lib/format';

export function StoryCard({ a }) {
  return (
    <article className="article-card">
      <img src={pic(a.photo)} alt={a.title} loading="lazy" />
      <div>
        <div className="eyebrow" style={{ fontSize: 8 }}>{a.tag}</div>
        <h3>{a.title}</h3>
        <p>{a.summary}</p>
        <Link className="text-link" href={`/journal/${a.id}`}>A little more <Icon name="arrow" /></Link>
      </div>
    </article>
  );
}

export function AboutView({ partner = false }) {
  const values = partner
    ? [
      ['store', 'Tell us about your shop.', 'Complete the shop application and provide the required verification details. The application is reviewed before selling.'],
      ['food', 'Give every offer a little clarity.', 'Use reusable food items, approved photos, clear contents, discounted prices, quantities and collection windows.'],
      ['scan', 'Welcome your customers.', 'Manage paid orders, get food ready, then verify the customer’s collection pass before confirming handover.'],
    ]
    : [
      ['box', 'Clarity in every offer.', 'You should know what’s in your order. Food details, quantities, prices and collection windows belong up front.'],
      ['store', 'Neighbourhood connections.', 'Discover local shops and collect directly from the people preparing your offer.'],
      ['leaf', 'A thoughtful second chance.', 'Surplus food can find another place at the table. We make that next connection a little easier.'],
    ];
  return (
    <>
      <section className={`section ${partner ? '' : 'cream'}`} style={partner ? { background: '#e8f4f8' } : undefined}>
        <div className="container about-grid">
          <div>
            <div className="eyebrow">{partner ? 'FOR GOOD NEIGHBOURHOOD SHOPS' : 'THE IDEA BEHIND LAST5 DEAL'}</div>
            <h1>{partner ? <>Your extra food.<br />Its next good chance.</> : <>Good food deserves<br />another chance.</>}</h1>
            <p>
              {partner
                ? 'Connect your surplus food with local customers. List what’s included, choose a collection window, and make those extra portions count.'
                : 'Sometimes a bakery makes a few extra loaves. Sometimes a kitchen has more portions than it needs. Last5 brings those clearly described offers together with people in the same neighbourhood.'}
            </p>
            {partner ? (
              <Link className="button" href="/partners/apply">Bring your shop to Last5 <Icon name="arrow" /></Link>
            ) : (
              <p>A little less to spend. A little more food enjoyed. A small choice that fits into an ordinary day.</p>
            )}
          </div>
          <img src={pic(partner ? 'bread' : 'hero')} alt={partner ? 'Bread from a neighbourhood bakery' : 'A shared table of colourful food'} fetchPriority="high" />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead
            title={partner ? 'A simple routine for your shop.' : 'A few things we believe in.'}
            sub={partner ? 'From your menu to the collection counter.' : 'Simple ideas, at the heart of every good find.'}
          />
          <div className="values-grid">
            {values.map(([i, h, p]) => (
              <article className="value-card" key={h}>
                <Icon name={i} />
                <h3>{h}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      {partner ? (
        <section className="section cream">
          <div className="container faq-layout">
            <div>
              <h2>The practical little details.</h2>
              <p>Clear offers and local collection, as part of your normal routine.</p>
              <Link className="text-link" href="/partners/apply">Preview the application <Icon name="arrow" /></Link>
            </div>
            <div>
              <FaqList
                items={[
                  ['', 'Which shops can join?', 'Bakeries, cafés, restaurants and grocery shops can apply. A real merchant needs its application and required evidence reviewed before selling.'],
                  ['', 'Do I need to arrange delivery?', 'This version is for collection from the shop. Your offer and order show the date, time, address and collection instructions.'],
                  ['', 'When are earnings eligible?', 'The working project design uses verified collection for merchant earnings. The 15% working commission assumption and final payout terms require confirmation before real merchant onboarding.'],
                ]}
              />
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="section cream">
            <div className="container">
              <SectionHead
                title="A little reading. A fresh perspective."
                sub="Get to know the idea and everyday details."
                action={<Link className="text-link" href="/journal">Visit the journal <Icon name="arrow" /></Link>}
              />
              <div className="journal-grid">{STORIES.map((a) => <StoryCard a={a} key={a.id} />)}</div>
            </div>
          </section>
          <section className="section">
            <div className="container"><PartnerBanner /></div>
          </section>
        </>
      )}
    </>
  );
}
