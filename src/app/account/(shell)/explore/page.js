'use client';

import React from 'react';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, AccountFoodCard, AccountEmpty, SearchBox, Btn } from '@/components/account/AccountUI';
import { useTitle } from '@/lib/useTitle';

export default function AccountExplorePage() {
  useTitle('Explore food');
  const { s, site, setSite, shop, showAreaPicker } = useApp();
  const filters = site.filtersAccount;
  const term = (site.terms.explore || '').toLowerCase();
  const cat = filters.category || 'All food';
  let foods = s.foods.filter((f) => shop(f.shopId).area === s.selectedArea && f.name.toLowerCase().includes(term) && (cat === 'All food' || f.category === cat));
  if (filters.sort === 'low') foods = [...foods].sort((a, b) => a.sale - b.sale);
  if (filters.sort === 'high') foods = [...foods].sort((a, b) => b.sale - a.sale);

  const setFilter = (patch) => setSite({ filtersAccount: { ...filters, ...patch } });

  return (
    <>
      <PageHeading
        title="Good food, close to you."
        sub="See what your neighbourhood has saved for today."
        actions={<Btn icon="location" onClick={showAreaPicker}>{s.selectedArea || 'Choose area'}</Btn>}
      />
      {!s.signedIn ? (
        <div className="guest-info">
          <span>Browse freely. Sign in when you’re ready to save food or place an order.</span>
          <a className="btn soft" href="/account/auth"><Icon name="users" className="sm" />Sign in</a>
        </div>
      ) : null}
      <div className="content-filter">
        <div className="pills">
          {['All food', 'Bakery', 'Sandwiches', 'Desserts', 'Pizza', 'Meals'].map((x) => (
            <button className={`pill ${cat === x ? 'active' : ''}`} onClick={() => setFilter({ category: x })} type="button" key={x}>{x}</button>
          ))}
        </div>
        <SearchBox name="explore" placeholder="Search food near you" />
      </div>
      <div className="section-row">
        <p className="muted small">{foods.length} food finds in {s.selectedArea || 'your selected area'}</p>
        <select className="toolbar-select" aria-label="Sort food" value={filters.sort || 'recent'} onChange={(e) => setFilter({ sort: e.target.value })}>
          <option value="recent">Recently listed</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
      {foods.length ? (
        <div className="food-grid explore-grid">{foods.map((f) => <AccountFoodCard f={f} key={f.id} />)}</div>
      ) : (
        <section className="panel">
          <AccountEmpty title="No food finds here right now" text="Change the category, search term or area to see what is available." label="Change area" onAction={showAreaPicker} />
        </section>
      )}
    </>
  );
}
