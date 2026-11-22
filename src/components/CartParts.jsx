'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { CheckLabel } from '@/components/ui';
import { money, pic } from '@/lib/format';

export function CartItems({ edit = true }) {
  const { s, food, changeCart } = useApp();
  return s.cart.map((l) => {
    const f = food(l.foodId);
    return (
      <div className="cart-item" key={f.id}>
        <img src={pic(f.image)} alt={f.name} />
        <div>
          <h3><Link href={`/food/${f.id}`}>{f.name}</Link></h3>
          <p>{f.description}</p>
          {edit ? (
            <div className="cart-actions">
              <div className="quantity">
                <button onClick={() => changeCart(f.id, l.qty - 1)} aria-label={`Decrease ${f.name} quantity`} type="button"><Icon name="minus" /></button>
                <b>{l.qty}</b>
                <button onClick={() => changeCart(f.id, l.qty + 1)} aria-label={`Increase ${f.name} quantity`} disabled={l.qty >= f.stock} type="button"><Icon name="plus" /></button>
              </div>
              <button className="remove" onClick={() => changeCart(f.id, 0)} type="button">Remove</button>
            </div>
          ) : <p>{l.qty} × {money(f.sale)}</p>}
        </div>
        <strong>{money(f.sale * l.qty)}</strong>
      </div>
    );
  });
}

export function PublicSummary({ checkout = false, onSubmit }) {
  const { s, food } = useApp();
  const subtotal = s.cart.reduce((n, l) => n + food(l.foodId).sale * l.qty, 0);
  const fee = subtotal ? 2000 : 0;
  const saving = s.cart.reduce((n, l) => {
    const f = food(l.foodId);
    return n + (f.original - f.sale) * l.qty;
  }, 0);
  return (
    <>
      <h2>All the good details</h2>
      <div className="summary-line"><span>Food subtotal</span><strong>{money(subtotal)}</strong></div>
      <div className="summary-line"><span>Service fee</span><strong>{money(fee)}</strong></div>
      <div className="summary-line total"><span>Total</span><strong>{money(subtotal + fee)}</strong></div>
      <div className="savings"><Icon name="leaf" />A little win. You’re saving {money(saving)}.</div>
      {checkout ? (
        <>
          <CheckLabel required>
            I’ve checked the food, allergens and collection window. This is a sample checkout.
          </CheckLabel>
          <button type="submit" className="button full" onSubmit={onSubmit}>
            Preview online payment <Icon name="arrow" />
          </button>
        </>
      ) : (
        <Link className="button full" href="/checkout">Continue to checkout <Icon name="arrow" /></Link>
      )}
      <p className="form-note" style={{ textAlign: 'center' }}>Online payment · Collection from the shop</p>
    </>
  );
}
