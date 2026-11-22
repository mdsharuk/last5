'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageIntro, Empty, Field } from '@/components/ui';
import { CartItems, PublicSummary } from '@/components/CartParts';
import { startCheckout } from '@/lib/model';
import { initials, shortDate, clock, money } from '@/lib/format';
import { useTitle } from '@/lib/useTitle';

const clone = (v) => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

export default function CheckoutPage() {
  useTitle('Checkout');
  const { s, site, setSite, setS, openModal, shop, food, toast } = useApp();

  if (!s.signedIn) {
    return (
      <>
        <PageIntro title="Your next good bite is close." sub="Open the sample account to continue with your bag." />
        <section className="section">
          <div className="container">
            <Empty title="Your own little corner awaits." text="Sign in to the sample account before checkout." href="/sign-in?returnTo=/checkout" label="Open sample sign in" />
          </div>
        </section>
      </>
    );
  }
  if (!s.cart.length) {
    return (
      <>
        <PageIntro title="Your good food bag." sub="A few good finds, all in one place." />
        <section className="section">
          <div className="container">
            <Empty title="Your bag has a little room." text="Find something you’ll love and give good food another chance." />
          </div>
        </section>
      </>
    );
  }
  const sh = shop(food(s.cart[0].foodId).shopId);
  const f = food(s.cart[0].foodId);

  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const v = Object.fromEntries(new FormData(form));
    if (!['bKash', 'Nagad', 'Card'].includes(v.method)) {
      toast('Choose an available online payment method.', true);
      return;
    }
    const next = clone(s);
    const key = site.checkoutKey || `CHECKOUT-${Date.now().toString(36)}`;
    try {
      const o = startCheckout(next, key);
      o.customerName = String(v.name).trim();
      o.phone = String(v.phone).trim();
      o.channel = 'SSLCOMMERZ · ' + v.method;
      setS(next);
      setSite({ checkoutKey: key });
      openModal({ type: 'gateway', id: o.id });
    } catch (err) {
      toast(err.message, true);
    }
  };

  return (
    <>
      <PageIntro title="One last little check." sub="Your food, collection details, and online payment — all in one place." eyebrow="CHECKOUT" />
      <form className="container two-column" onSubmit={submit}>
        <div>
          <section className="panel">
            <h2>1 · Your details</h2>
            <div className="form-grid">
              <Field label="Full name" name="name" value={s.profile.name} required />
              <Field label="Contact phone · sample" name="phone" value={s.profile.phone} required />
            </div>
          </section>
          <section className="panel">
            <h2>2 · Your collection stop</h2>
            <Link className="merchant-link" href={`/shops/${sh.id}`}>
              <span className="avatar">{initials(sh.name)}</span>
              <span><strong>{sh.name}</strong><small>{sh.address}</small></span>
              <Icon name="arrow" />
            </Link>
            <div className="collection-box">
              <Icon name="clock" />
              <div>
                <strong>{shortDate(f.date)} · {clock(f.start)} – {clock(f.end)}</strong>
                <p>{sh.instructions}</p>
              </div>
            </div>
          </section>
          <section className="panel">
            <h2>3 · Pay online</h2>
            <div className="payment-options">
              {['bKash', 'Nagad', 'Card'].map((m, i) => (
                <label className="payment-option" key={m}>
                  <input type="radio" name="method" value={m} defaultChecked={!i} />{m}
                </label>
              ))}
            </div>
            <p className="form-note">Sample checkout only. No payment credentials are requested and no real money moves.</p>
          </section>
        </div>
        <aside className="panel summary">
          <h2>Your good finds</h2>
          <CartItems edit={false} />
          <div className="divider" />
          <PublicSummary checkout />
        </aside>
      </form>
    </>
  );
}
