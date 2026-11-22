'use client';

import React, { useId } from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import ShopLogo from '@/components/ShopLogo';
import { useApp } from '@/components/AppProvider';
import { pic, money, initials, shortDate, clock } from '@/lib/format';
import { foodAvailable } from '@/lib/model';

export function Brand({ width = 533, height = 179 }) {
  return (
    <img
      className="brand-logo"
      src="/assets/last5-logo.svg"
      alt="Last5 Deal — good food. better tomorrow…"
      width={width}
      height={height}
    />
  );
}

export function SectionHead({ title, sub, action, eyebrow }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2>{title}</h2>
        {sub ? <p>{sub}</p> : null}
      </div>
      {action ? <div className="section-actions">{action}</div> : null}
    </div>
  );
}

export function PageIntro({ title, sub, eyebrow }) {
  return (
    <section className="page-intro">
      <div className="container">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
    </section>
  );
}

export function Empty({ title, text, href = '/explore', label = 'Explore food' }) {
  return (
    <div className="empty">
      <Icon name="bag" />
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="button" href={href}>{label}</Link>
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <div className="container">
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        {items.map(([name, path]) => (
          <React.Fragment key={name}>
            <Icon name="arrow" />
            {path ? <Link href={path}>{name}</Link> : <span>{name}</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function FaqList({ items }) {
  return items.map(([, q, a]) => (
    <details className="faq" key={q}>
      <summary>{q}</summary>
      <p>{a}</p>
    </details>
  ));
}

export const STEPS = [
  ['01 · DISCOVER', 'search', 'Find your next good bite.', 'Explore food from shops near you. See what’s included, the price, and when to collect.'],
  ['02 · ORDER', 'bag', 'Make it yours for less.', 'Add your favourites from one shop to your bag and pay online. Every detail stays clear.'],
  ['03 · COLLECT', 'store', 'Pick up. Enjoy. Feel good.', 'Visit the shop during your collection window and show your pass. Good food gets another chance.'],
];

export function Steps() {
  return (
    <div className="steps">
      {STEPS.map(([n, i, h, p]) => (
        <article className="step" key={n}>
          <small>{n}</small>
          <span><Icon name={i} /></span>
          <h3>{h}</h3>
          <p>{p}</p>
        </article>
      ))}
    </div>
  );
}

export function PartnerBanner() {
  return (
    <div className="partner-banner">
      <span><Icon name="store" /></span>
      <div>
        <h2>Good food left at the end of the day?</h2>
        <p>Turn your surplus into a new opportunity. Bring your shop to Last5 Deal.</p>
      </div>
      <Link className="button" href="/partners/apply">Become a partner <Icon name="arrow" /></Link>
    </div>
  );
}

export function FoodCard({ f }) {
  const { s, shop, saveFood, add } = useApp();
  const sh = shop(f.shopId);
  const saved = s.favourites.includes(f.id);
  return (
    <article className="food-card">
      <Link className="food-photo" href={`/food/${f.id}`} aria-label={`View ${f.name}`}>
        <img src={pic(f.image)} alt={f.name} loading="lazy" decoding="async" />
        <span className="discount">{Math.round((1 - f.sale / f.original) * 100)}% off</span>
        <span className="stock"><Icon name="clock" />{f.stock} left to collect</span>
      </Link>
      <button
        className={`save-food ${saved ? 'saved' : ''}`}
        onClick={() => saveFood(f.id)}
        aria-label={`${saved ? 'Unsave' : 'Save'} ${f.name}`}
        aria-pressed={saved}
        type="button"
      >
        <Icon name="heart" />
      </button>
      <div className="food-body">
        <Link className="shop-line" href={`/shops/${sh.id}`}>
          <ShopLogo shop={sh} className="shop-dot" />{sh.name}
        </Link>
        <Link className="food-title" href={`/food/${f.id}`}>{f.name}</Link>
        <div className="food-area"><Icon name="pin" />{sh.area}, {sh.city}</div>
        <div className="food-price">
          <strong>{money(f.sale)}</strong>
          <del>{money(f.original)}</del>
          <small>/ offer</small>
        </div>
        <div className="collection-line">
          <Icon name="clock" />{clock(f.start)} – {clock(f.end)}
          <button className="mini-add" onClick={() => add(f.id)} aria-label={`Add ${f.name} to bag`} type="button">
            <Icon name="plus" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function FoodGrid({ rows }) {
  return <div className="food-grid">{rows.map((f) => <FoodCard f={f} key={f.id} />)}</div>;
}

export function ShopCard({ sh, active = false }) {
  const { s, shop } = useApp();
  return (
    <Link className={`shop-tile ${active ? 'active' : ''}`} href={`/shops/${sh.id}`}>
      <img className="shop-cover" src={pic(sh.image)} alt={`${sh.name} illustrative food`} loading="lazy" decoding="async" />
      <div>
        <ShopLogo shop={sh} className="shop-logo" />
        <h3>{sh.name}</h3>
        <p>{sh.area} · {sh.category}</p>
        <small>{s.foods.filter((f) => f.shopId === sh.id && foodAvailable(f)).length} available offers <Icon name="arrow" /></small>
      </div>
    </Link>
  );
}

export function Field({ label, name, value = '', type = 'text', required = false, options = [], wide = false, placeholder = '', min, max, disabled, step, accept, onChange, inputProps = {} }) {
  const id = useId().replace(/:/g, '');
  return (
    <label className={`field ${wide ? 'wide' : ''}`} htmlFor={id}>
      <span id={`${id}-label`}>{label}{required ? ' *' : ''}</span>
      {type === 'select' ? (
        <select id={id} name={name} defaultValue={value} onChange={onChange} {...inputProps}>
          {options.map((v) => {
            const val = typeof v === 'string' ? v : v.value;
            const text = typeof v === 'string' ? v : v.label;
            return <option value={val} key={val}>{text}</option>;
          })}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} name={name} defaultValue={value} placeholder={placeholder} maxLength={2000} required={required} onChange={onChange} {...inputProps} />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          maxLength={500}
          required={required}
          min={min}
          max={max}
          step={step}
          accept={accept}
          disabled={disabled}
          onChange={onChange}
          {...inputProps}
        />
      )}
    </label>
  );
}

export function CheckLabel({ children, name, defaultChecked = false, required = false }) {
  return (
    <label className="check-label">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} required={required} />
      <span>{children}</span>
    </label>
  );
}

export function Chip({ children, className = '' }) {
  return <span className={`chip ${className}`}>{children}</span>;
}

export function Info({ children, amber = false }) {
  return <div className={`info ${amber ? 'amber' : ''}`}><Icon name={amber ? 'warning' : 'leaf'} /><div>{children}</div></div>;
}

export function InfoGrid({ rows }) {
  return (
    <div className="info-grid">
      {rows.map(([k, v]) => (
        <div key={k}><small>{k}</small><strong>{v}</strong></div>
      ))}
    </div>
  );
}

export { pic, money, initials, shortDate, clock };
