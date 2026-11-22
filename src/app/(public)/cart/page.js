'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageIntro, Empty } from '@/components/ui';
import { CartItems, PublicSummary } from '@/components/CartParts';
import { useTitle } from '@/lib/useTitle';

export default function CartPage() {
  useTitle('Your shopping bag');
  const { s, shop, food } = useApp();
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
  return (
    <>
      <PageIntro title="A bag full of good choices." sub="Review your food, quantities and collection details before moving on." eyebrow="YOUR SHOPPING BAG" />
      <div className="container two-column">
        <div>
          <section className="panel">
            <h2>{sh.name}</h2>
            <CartItems />
          </section>
          <div className="collection-box">
            <Icon name="clock" />
            <div>
              <strong>Collection from {sh.area}, {sh.city}</strong>
              <p>{sh.address}<br />Check your collection window at checkout.</p>
            </div>
          </div>
        </div>
        <aside className="panel summary"><PublicSummary /></aside>
      </div>
    </>
  );
}
