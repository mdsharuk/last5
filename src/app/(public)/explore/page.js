'use client';

import React from 'react';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { FoodGrid } from '@/components/ui';
import { CATEGORIES } from '@/lib/data';
import { vegetarian, vegan } from '@/lib/format';
import { useTitle } from '@/lib/useTitle';

export default function ExplorePage() {
  useTitle('Explore food');
  const { s, site, setSite, shop, localFoods, showLocationPublic } = useApp();

  const rows = localFoods()
    .filter(
      (f) =>
        (site.category === 'All food' ||
          (site.category === 'Meals' ? ['Meals', 'Pizza', 'Sandwiches'].includes(f.category) : f.category === site.category)) &&
        (!site.q || `${f.name} ${shop(f.shopId).name} ${f.description}`.toLowerCase().includes(site.q.toLowerCase())) &&
        (!site.price || f.sale <= Number(site.price) * 100) &&
        (!site.diet || (site.diet === 'Vegetarian' ? vegetarian(f) : vegan(f)))
    )
    .sort((a, b) =>
      site.sort === 'low' ? a.sale - b.sale
        : site.sort === 'high' ? b.sale - a.sale
          : site.sort === 'newest' ? Number(b.id.slice(1)) - Number(a.id.slice(1))
            : b.stock - a.stock
    );

  const reset = () => setSite({ category: 'All food', q: '', diet: '', price: '', sort: 'recommended', limit: 9 });

  return (
    <>
      <section className="page-intro">
        <div className="container">
          <div className="eyebrow">FIND SOMETHING GOOD</div>
          <h1>Great food. A little less.</h1>
          <p>Browse surplus food from your local shops. Choose your favourites, then collect them in person.</p>
          <div className="browse-controls">
            <label className="search">
              <Icon name="search" />
              <input
                type="search"
                aria-label="Search available food"
                value={site.q}
                onChange={(e) => setSite({ q: e.target.value, limit: 9 })}
                placeholder="Search food, shops or ingredients…"
              />
            </label>
            <button className="button light" onClick={showLocationPublic} type="button">
              <Icon name="pin" />{s.siteSettings.area || 'All areas'}, {s.siteSettings.city}<Icon name="down" />
            </button>
            <button className="button outline mobile-filters" onClick={() => setSite({ filters: !site.filters })} aria-expanded={site.filters} type="button">
              <Icon name="settings" />Filters
            </button>
          </div>
        </div>
      </section>

      <div className="container browse-body">
        <aside className={`filters ${site.filters ? 'open' : ''}`} aria-label="Food search filters">
          <div className="filter-head">
            <h3>Filters</h3>
            <button className="text-link tiny" onClick={reset} type="button">Reset</button>
          </div>
          <div className="filter-group">
            <h4>WHAT SOUNDS GOOD?</h4>
            {CATEGORIES.map(([n]) => (
              <label className="filter-option" key={n}>
                <input
                  type="radio"
                  name="category"
                  value={n}
                  checked={site.category === n}
                  onChange={() => setSite({ category: n, limit: 9 })}
                />
                {n}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h4>YOUR FOOD PREFERENCES</h4>
            {['', 'Vegetarian', 'Vegan'].map((d) => (
              <label className="filter-option" key={d || 'any'}>
                <input
                  type="radio"
                  name="diet"
                  value={d}
                  checked={site.diet === d}
                  onChange={() => setSite({ diet: d, limit: 9 })}
                />
                {d || 'Any preference'}
              </label>
            ))}
            <p className="tiny muted" style={{ marginTop: 10 }}>Read the shop’s ingredient and allergen notes before choosing.</p>
          </div>
          <div className="filter-group">
            <h4>BUDGET PER OFFER</h4>
            <select
              aria-label="Maximum food price"
              value={site.price}
              onChange={(e) => setSite({ price: e.target.value, limit: 9 })}
            >
              <option value="">Any price</option>
              {[150, 200, 300].map((n) => <option value={n} key={n}>Up to ৳{n}</option>)}
            </select>
          </div>
          <div className="filter-tip">
            <Icon name="leaf" />
            <p>Every offer lists its food, price, quantity and collection time. A little clarity goes a long way.</p>
          </div>
        </aside>

        <section className="results">
          <div className="result-head">
            <p><strong>{rows.length}</strong> sample offers in {s.siteSettings.area || s.siteSettings.city}</p>
            <select
              className="sort"
              aria-label="Sort food"
              value={site.sort}
              onChange={(e) => setSite({ sort: e.target.value })}
            >
              {[['recommended', 'Recommended'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['newest', 'Recently listed']].map(([v, n]) => (
                <option value={v} key={v}>{n}</option>
              ))}
            </select>
          </div>
          {rows.length ? (
            <FoodGrid rows={rows.slice(0, site.limit)} />
          ) : (
            <div className="empty">
              <Icon name="bag" />
              <h2>No good finds this time.</h2>
              <p>Try another search, category or neighbourhood.</p>
              <button className="button" onClick={reset} type="button">Reset your search</button>
            </div>
          )}
          {rows.length > site.limit ? (
            <div className="more-row">
              <button className="button outline" onClick={() => setSite({ limit: site.limit + 9 })} type="button">
                Show more food <Icon name="down" />
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
