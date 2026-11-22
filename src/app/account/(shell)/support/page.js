'use client';

import React from 'react';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, Badge, Btn, AccountEmpty } from '@/components/account/AccountUI';
import { date } from '@/lib/format';
import { useTitle } from '@/lib/useTitle';

const FAQ = [
  ['How do I collect my food?', 'Visit the shop within the collection window. Open your ready order’s collection pass and show the code or QR to the merchant. The shop verifies the handover.'],
  ['Can I pay at the shop?', 'Customer orders use the configured online gateway. Cash on collection is not part of this Last5 MVP.'],
  ['Why is my refund still pending?', 'Pending means the request is being reviewed or processed. Your account shows Completed only after a verified refund result.'],
  ['Does adding food to my cart reserve it?', 'No. Stock is checked again and reserved when checkout starts. Available portions and prices may change before checkout.'],
];

export default function SupportPage() {
  useTitle('Help & support');
  const { s, showCase, showCaseForm, goAccount, needSignin } = useApp();
  return (
    <>
      <PageHeading
        title="A little help, whenever you need it."
        sub="Questions about an order, collection, payment or your account."
        actions={<Btn className="primary" icon="plus" onClick={() => (s.signedIn ? showCaseForm() : needSignin())}>New support case</Btn>}
      />
      <div className="two-col">
        <div>
          {s.signedIn ? (
            <section className="panel table-panel">
              <div className="panel-head">
                <div><h2>Your support cases</h2><p>Conversations about your own orders and account.</p></div>
              </div>
              {s.cases.map((c) => (
                <button className="case-row" onClick={() => showCase(c.id)} type="button" key={c.id}>
                  <Icon name="file" />
                  <div><h3>{c.subject}</h3><p>{c.id} · {c.type} · {date(c.date)}</p></div>
                  <Badge value={c.state} />
                  <Icon name="chevron" className="sm" />
                </button>
              ))}
              {!s.cases.length ? <AccountEmpty title="No support cases yet" text="When you need a hand, your conversations will appear here." label="Create a case" onAction={() => showCaseForm()} /> : null}
            </section>
          ) : null}
          <section className="panel form-panel">
            <h2>A few quick answers</h2>
            <p>Before you reach out, these may help.</p>
            {FAQ.map(([q, a]) => (
              <details className="faq" key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </section>
        </div>
        <aside className="panel form-panel" style={{ alignSelf: 'start' }}>
          <div className="empty-icon" style={{ margin: '0 0 15px' }}><Icon name="support" className="lg" /></div>
          <h2>At the shop right now?</h2>
          <p>Open your order and check its collection window. Your pass becomes available for an eligible Ready order.</p>
          <Btn className="full" icon="bag" onClick={() => goAccount('orders')}>Open my orders</Btn>
          <div className="divided privacy-note">For payment issues, check the existing attempt before making another payment. Include the order reference when you ask for help.</div>
        </aside>
      </div>
    </>
  );
}
