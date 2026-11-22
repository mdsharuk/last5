'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, AccountFoodCard, MiniOrder, PickupCard, AccountEmpty, Metric, Btn } from '@/components/account/AccountUI';
import { accountMoney } from '@/lib/format';
import { accountSummary, canShowPass, foodAvailable } from '@/lib/model';
import { useTitle } from '@/lib/useTitle';

export default function OverviewPage() {
  useTitle('My Account');
  const { s, shop, goAccount, showAreaPicker } = useApp();
  const a = accountSummary(s);
  const owned = s.orders.filter((o) => o.customerId === s.profile.id);
  const next = owned.find((o) => canShowPass(s, o)) || owned.find((o) => o.state === 'Accepted');
  const preferred = s.locations.find((l) => l.preferred);
  const recommendations = s.foods.filter((f) => foodAvailable(f) && shop(f.shopId).area === s.selectedArea).slice(0, 3);

  return (
    <>
      <PageHeading
        title={`Hi, ${s.profile.name.split(' ')[0]}.`}
        sub="Your food finds, collections and account. All in one place."
        actions={<Btn icon="search" onClick={() => goAccount('explore')}>Explore food</Btn>}
      />
      {s.profile.pendingContact ? (
        <div className="profile-pending">
          <strong>A contact change is waiting for verification.</strong> Your current verified contact stays active. <Link className="inline-link" href="/account/profile">View profile</Link>
        </div>
      ) : null}
      <section className="account-hero">
        <div className="account-hero-copy">
          <div className="eyebrow">A FRESH CHANCE FOR GOOD FOOD</div>
          <h2>Something delicious.<br />A little less waste.</h2>
          <p>Discover food from neighbourhood shops, at prices you’ll feel good about.</p>
          <Btn className="primary" icon="arrow" onClick={() => goAccount('explore')}>Find food near you</Btn>
        </div>
        <img src="/assets/croissant.jpg" alt="Freshly baked croissants" />
      </section>
      <div className="metrics account-metrics">
        <Metric icon="bag" value={a.collected} label="Completed collections" />
        <Metric icon="leaf" value={accountMoney(a.savings)} label="Saved on collected food" />
        <Metric icon="heart" value={a.units} label="Portions collected" />
      </div>
      <div className="account-columns">
        {next ? <PickupCard o={next} /> : (
          <section className="panel"><AccountEmpty title="Your next food find is waiting" text="No active collection right now. Find something delicious near you." /></section>
        )}
        <section className="panel account-glance">
          <h2>Your account at a glance</h2>
          <div className="glance-row">
            <Icon name="location" />
            <div><small>PREFERRED AREA</small><strong>{preferred ? `${preferred.area}, ${preferred.city}` : 'Choose your area'}</strong></div>
            <Link href="/account/locations">Change</Link>
          </div>
          <div className="glance-row">
            <Icon name="shield" />
            <div><small>ACCOUNT CONTACTS</small><strong>{s.profile.emailVerified && s.profile.phoneVerified ? 'Phone & email verified' : 'Verification pending'}</strong></div>
            <Link href="/account/profile">View</Link>
          </div>
          <div className="glance-row">
            <Icon name="heart" />
            <div><small>SAVED FOR LATER</small><strong>{s.favourites.length} favourite food finds</strong></div>
            <Link href="/account/favourites">Explore</Link>
          </div>
          <div className="glance-row">
            <Icon name="support" />
            <div><small>A LITTLE HELP</small><strong>Questions about your order?</strong></div>
            <Link href="/account/support">Get help</Link>
          </div>
        </section>
      </div>
      <section className="panel table-panel">
        <div className="panel-head">
          <div><h2>Recent orders</h2><p>Your latest food moments.</p></div>
          <Link className="btn link" href="/account/orders">View all orders <Icon name="arrow" className="sm" /></Link>
        </div>
        <div className="mini-orders">
          {owned.slice(0, 3).map((o) => <MiniOrder o={o} key={o.id} />) || null}
          {!owned.length ? <AccountEmpty title="No orders yet" text="Your first food find will appear here." action={null} /> : null}
        </div>
      </section>
      <div className="section-row">
        <div><h2>A few finds near you</h2><p>Freshly listed around {s.selectedArea || 'your area'}.</p></div>
        <Link className="btn link" href="/account/explore">Explore all <Icon name="arrow" className="sm" /></Link>
      </div>
      <div className="food-grid">
        {recommendations.map((f) => <AccountFoodCard f={f} key={f.id} />)}
        {!recommendations.length ? <AccountEmpty title="No food in this area right now" text="Try another area or check back later." label="Change area" onAction={showAreaPicker} /> : null}
      </div>
    </>
  );
}
