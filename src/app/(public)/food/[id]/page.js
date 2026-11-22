'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Icon from '@/lib/icons';
import ShopLogo from '@/components/ShopLogo';
import { useApp } from '@/components/AppProvider';
import { Breadcrumbs, SectionHead, FoodGrid, Chip } from '@/components/ui';
import { money, shortDate, clock, pic } from '@/lib/format';
import { foodAvailable } from '@/lib/model';
import { useTitle } from '@/lib/useTitle';

export default function FoodPage() {
  const params = useParams();
  const { s, site, setSite, shop, food, add } = useApp();
  const f = food(params.id);
  useTitle(f ? f.name : 'Food not found');
  if (!f) {
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
  const sh = shop(f.shopId);
  const qty = Math.min(Math.max(1, site.qty), Math.max(1, f.stock));
  const related = s.foods.filter((x) => x.shopId === sh.id && x.id !== f.id && foodAvailable(x));
  return (
    <>
      <Breadcrumbs items={[['Explore food', '/explore'], [f.name]]} />
      <div className="container">
        <div className="detail-grid">
          <div className="detail-photo">
            <img src={pic(f.image)} alt={f.name} fetchPriority="high" decoding="async" />
            <p className="image-note">Illustrative photo · Read the listed contents for this sample offer.</p>
          </div>
          <section className="food-details">
            <div className="eyebrow">{f.category} · SMALLER PRICE, SAME GOOD FOOD</div>
            <h1>{f.name}</h1>
            <Link className="merchant-link" href={`/shops/${sh.id}`}>
              <ShopLogo shop={sh} className="avatar" />
              <span><strong>{sh.name}</strong><small>{sh.area}, {sh.city}</small></span>
              <Icon name="arrow" />
            </Link>
            <p className="food-description">{f.description}</p>
            <div className="detail-price">
              <strong>{money(f.sale)}</strong>
              <del>{money(f.original)}</del>
              <Chip>Save {money(f.original - f.sale)}</Chip>
            </div>
            <div className="detail-block">
              <h3><Icon name="box" />Here’s exactly what’s included</h3>
              <p>{f.description}</p>
            </div>
            <div className="detail-block">
              <h3><Icon name="info" />Ingredients & allergens</h3>
              <p>{f.allergens} Information is provided by the sample shop. Ask the shop about ingredients and cross-contact before ordering.</p>
            </div>
            <div className="collection-box">
              <Icon name="clock" />
              <div>
                <strong>Collect {shortDate(f.date)} · {clock(f.start)} – {clock(f.end)}</strong>
                <p>{sh.address}<br />{sh.instructions}</p>
              </div>
            </div>
            <div className="add-row">
              <div className="quantity">
                <button onClick={() => setSite({ qty: Math.max(1, qty - 1) })} aria-label="Decrease quantity" disabled={qty <= 1} type="button"><Icon name="minus" /></button>
                <b>{qty}</b>
                <button onClick={() => setSite({ qty: Math.min(f.stock, qty + 1) })} aria-label="Increase quantity" disabled={qty >= f.stock} type="button"><Icon name="plus" /></button>
              </div>
              <button className="button" onClick={() => add(f.id, qty)} disabled={!foodAvailable(f)} type="button">
                <Icon name="bag" />Add to bag · {money(f.sale * qty)}
              </button>
            </div>
            <div className="detail-foot">
              <span>{f.stock} offers available · Checked again at checkout</span>
              <span>Collection only</span>
            </div>
          </section>
        </div>
        <section className="section">
          <SectionHead
            title={`A little more from ${sh.name}`}
            sub="Sample offers from the same shop."
            action={<Link className="text-link" href={`/shops/${sh.id}`}>Visit shop <Icon name="arrow" /></Link>}
          />
          {related.length ? <FoodGrid rows={related} /> : <p className="small muted">That’s this shop’s only available offer for now.</p>}
        </section>
      </div>
    </>
  );
}
