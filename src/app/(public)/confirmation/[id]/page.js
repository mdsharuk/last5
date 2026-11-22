'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { Info, InfoGrid } from '@/components/ui';
import { money, shortDate, clock } from '@/lib/format';
import { useTitle } from '@/lib/useTitle';

export default function ConfirmationPage() {
  const { id } = useParams();
  const { s, showGateway } = useApp();
  const o = s.orders.find((x) => x.id === id && x.customerId === s.profile.id);
  useTitle('Order confirmation');
  if (!o) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty">
            <Icon name="bag" />
            <h2>This little corner is missing.</h2>
            <p>The page or sample record could not be found. Let’s find you something good.</p>
            <Link className="button" href="/">Back to the homepage</Link>
          </div>
        </div>
      </section>
    );
  }
  const paid = o.payment === 'Paid';
  const pending = o.payment === 'Pending';
  return (
    <div className="container">
      <section className="success">
        <span className="success-mark"><Icon name={paid ? 'check' : pending ? 'clock' : 'info'} /></span>
        <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 16 }}>
          SAMPLE ORDER {paid ? 'CONFIRMED' : pending ? 'PENDING' : 'UPDATE'}
        </div>
        <h1>{paid ? 'A good find is on its way.' : pending ? 'We’re checking your payment.' : 'Your payment was not completed.'}</h1>
        <p>
          {paid ? 'Your sample payment is verified. The shop will accept the order and prepare it for collection.'
            : pending ? 'Keep this reference and check the existing attempt before trying another charge.'
              : 'The sample reservation was released. Review your bag before starting a new attempt.'}
        </p>
        <div className="panel">
          <h2>{o.id}</h2>
          <InfoGrid
            rows={[
              ['SHOP', o.shopName],
              ['PAYMENT', `${o.payment} · ${money(o.subtotal + o.fee)}`],
              ['COLLECTION', `${shortDate(o.date)} · ${clock(o.start)} – ${clock(o.end)}`],
              ['ADDRESS', o.address],
            ]}
          />
          <div className="divider" />
          <Info>Your collection pass is available when a paid order is marked ready by the shop. Customers do not confirm the handover themselves.</Info>
        </div>
        <div className="button-row" style={{ justifyContent: 'center' }}>
          <Link className="button" href={`/account/orders?order=${o.id}`}>View my order <Icon name="arrow" /></Link>
          <Link className="button light" href="/explore">Continue exploring</Link>
          {pending ? (
            <button className="button outline" onClick={() => showGateway(o.id)} type="button">Check sample payment</button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
