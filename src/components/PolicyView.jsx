'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { Info } from '@/components/ui';
import { useTitle } from '@/lib/useTitle';

const TERMS = [
  ['Food and collection', 'Sample offers list contents, quantities, discounted prices and collection windows. Shops and transactions are fictional, and food photos are illustrative. This version is for collection from the shop.'],
  ['One shop per order', 'Food in one order comes from one shop. Check the address and collection window before choosing.'],
  ['Payments and refunds', 'Payment, fulfilment and refund status stay separate. The frontend simulates online payment. It does not process real payments or refunds. Pending payments need checking before another attempt.'],
  ['Food information', 'Read merchant-provided contents and allergen information. Ask the shop about ingredients and cross-contact before ordering if you need clarification. A photo does not confirm those details.'],
  ['Support', 'Use an order’s help action to keep the question with its reference. Sample cases are stored locally and are not sent to a real team.'],
];

const PRIVACY = [
  ['Your sample data', 'This frontend stores sample profile details, favourites, cart, orders, cases, application metadata and preferences in this browser. The sample sign-in does not authenticate an identity.'],
  ['Payments and files', 'Payment outcomes are simulated. This UI does not request payment credentials or charge you. The merchant form keeps only the selected sample file’s name and size; no verification file is submitted to a review team.'],
  ['Contact changes', 'The account interface shows a pending contact change. Real identity and verification services are required before production contact updates can be completed.'],
  ['Your choices', 'Manage optional offer updates, sign out of the sample account or request a sample account-closure review from the account pages.'],
];

export default function PolicyPage({ privacy = false }) {
  useTitle(privacy ? 'Privacy' : 'Terms');
  const sections = privacy ? PRIVACY : TERMS;
  return (
    <div className="container">
      <article className="prose">
        <div className="eyebrow">WEBSITE PREVIEW INFORMATION</div>
        <h1>{privacy ? 'Your privacy, clearly.' : 'A few clear terms.'}</h1>
        <Info amber>Draft UI copy. Final operating terms, privacy disclosures and commercial policies require confirmation before a real service launches.</Info>
        {sections.map(([h, p]) => (
          <React.Fragment key={h}>
            <h2>{h}</h2>
            <p>{p}</p>
          </React.Fragment>
        ))}
        <div className="divider" />
        <Link className="button small" href="/explore">Back to exploring <Icon name="arrow" /></Link>
      </article>
    </div>
  );
}
