'use client';

import React from 'react';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, AccountFoodCard, AccountEmpty, Btn } from '@/components/account/AccountUI';
import { useTitle } from '@/lib/useTitle';

export default function FavouritesPage() {
  useTitle('Favourites');
  const { s, goAccount } = useApp();
  const list = s.foods.filter((f) => s.favourites.includes(f.id));
  return (
    <>
      <PageHeading
        title="Favourites"
        sub="The food finds you’d like to come back to."
        actions={<Btn icon="search" onClick={() => goAccount('explore')}>Explore food</Btn>}
      />
      <div className="notice"><Icon name="heart" className="sm" />Saving food doesn’t reserve it. Check the latest price, available portions and collection time before ordering.</div>
      {list.length ? (
        <div className="food-grid explore-grid">{list.map((f) => <AccountFoodCard f={f} key={f.id} />)}</div>
      ) : (
        <section className="panel favourite-empty">
          <AccountEmpty title="A little love for your favourite food" text="Tap the heart on a food find to keep it here for later." />
        </section>
      )}
    </>
  );
}
