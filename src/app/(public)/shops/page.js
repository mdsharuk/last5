'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageIntro, SectionHead, ShopCard, Breadcrumbs, FoodGrid, Info } from '@/components/ui';
import { initials, pic } from '@/lib/format';
import { foodAvailable } from '@/lib/model';
import { useTitle } from '@/lib/useTitle';

export default function ShopsPage() {
  const { s, SHOPS, showLocationPublic } = useApp();
  useTitle('Our neighbourhood shops');
  const rows = SHOPS.filter((sh) => sh.city === s.siteSettings.city && (!s.siteSettings.area || sh.area === s.siteSettings.area));
  return (
    <>
      <PageIntro title="Good neighbours. Great food." sub="Meet the sample neighbourhood shops in your selected area." eyebrow="NEIGHBOURHOOD FAVOURITES" />
      <section className="section">
        <div className="container">
          <SectionHead
            title={`Shops in ${s.siteSettings.area || s.siteSettings.city}`}
            sub={`${rows.length} sample shops to explore.`}
            action={<button className="button light small" onClick={showLocationPublic} type="button"><Icon name="pin" />Change area</button>}
          />
          <div className="shop-rail">{rows.map((sh) => <ShopCard sh={sh} key={sh.id} />)}</div>
        </div>
      </section>
    </>
  );
}

export function ShopDetail({ id }) {
  const { s, shop, saveShop } = useApp();
  const sh = shop(id);
  useTitle(sh ? sh.name : 'Shop not found');
  if (!sh) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty">
            <Icon name="store" />
            <h2>This little corner is missing.</h2>
            <p>The page or sample record could not be found. Let’s find you something good.</p>
            <Link className="button" href="/">Back to the homepage</Link>
          </div>
        </div>
      </section>
    );
  }
  const rows = s.foods.filter((f) => f.shopId === id && foodAvailable(f));
  const saved = s.favouriteShops.includes(id);
  return (
    <>
      <Breadcrumbs items={[['Shops', '/shops'], [sh.name]]} />
      <div className="container">
        <div className="shop-hero">
          <img src={pic(sh.image)} alt={`${sh.name} illustrative food`} fetchPriority="high" decoding="async" />
          <div>
            <span className="shop-big-logo">{initials(sh.name)}</span>
            <div className="shop-head">
              <div>
                <div className="eyebrow">{sh.category} · ILLUSTRATIVE SHOP</div>
                <h1>{sh.name}</h1>
                <p><Icon name="pin" /> {sh.address}</p>
              </div>
              <button className="button light" onClick={() => saveShop(id)} type="button">
                <Icon name="heart" />{saved ? 'Shop saved' : 'Save this shop'}
              </button>
            </div>
          </div>
        </div>
        <div className="shop-layout">
          <div>
            <SectionHead title="Available food" sub="Clearly described surplus offers from this sample shop." />
            {rows.length ? <FoodGrid rows={rows} /> : (
              <div className="empty">
                <Icon name="bag" />
                <h2>No offers at the moment.</h2>
                <p>Check another shop for your next good find.</p>
                <Link className="button" href="/explore">Explore food</Link>
              </div>
            )}
          </div>
          <aside className="panel">
            <h2>Your collection stop</h2>
            <p>A neighbourhood shop giving its extra food another chance to be enjoyed.</p>
            <div className="info-pair"><small>FIND THE SHOP</small>{sh.address}</div>
            <div className="info-pair"><small>COLLECTION INSTRUCTIONS</small>{sh.instructions}</div>
            <Info>Follow the collection window on your order. Opening a pass does not complete the handover.</Info>
          </aside>
        </div>
      </div>
    </>
  );
}
