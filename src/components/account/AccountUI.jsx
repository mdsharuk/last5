'use client';

import React, { useId } from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { accountMoney, clock, date, initials, pic } from '@/lib/format';
import { foodAvailable } from '@/lib/model';

export function Badge({ value, dot = true }) {
  const green = ['Ready', 'Paid', 'Collected', 'Completed', 'Verified', 'Preferred'].includes(value);
  const orange = ['Pending', 'Pending payment', 'Verification pending', 'Open'].includes(value);
  const blue = ['Accepted', 'In progress'].includes(value);
  const red = ['Cancelled', 'Rejected', 'Failed', 'Expired'].includes(value);
  const color = green ? 'green' : orange ? 'orange' : blue ? 'blue' : red ? 'red' : '';
  return <span className={`badge ${color}`}>{dot ? <i /> : null}{value}</span>;
}

export function Btn({ children, onClick, className = '', icon, type = 'button', ...rest }) {
  return (
    <button className={`btn ${className}`} onClick={onClick} type={type} {...rest}>
      {icon ? <Icon name={icon} className="sm" /> : null}{children}
    </button>
  );
}

export function PageHeading({ title, sub, actions }) {
  return (
    <div className="page-heading">
      <div><h1>{title}</h1><p>{sub}</p></div>
      <div className="heading-actions">{actions}</div>
    </div>
  );
}

export function AccountEmpty({ title, text, action = 'explore', label = 'Explore food', onAction }) {
  const { goAccount } = useApp();
  return (
    <div className="empty">
      <div className="empty-icon"><Icon name="bag" className="lg" /></div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action || onAction ? (
        <button
          className="btn primary"
          type="button"
          onClick={() => (onAction ? onAction() : goAccount(action))}
        >
          {label}<Icon name="arrow" className="sm" />
        </button>
      ) : null}
    </div>
  );
}

export function AccountField({ label, name, value = '', type = 'text', attrs = {}, options = [], full = false, onChange }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={`field ${full ? 'full' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {type === 'select' ? (
        <select id={id} name={name} defaultValue={value} onChange={onChange} {...attrs}>
          {options.map((x) => {
            const val = typeof x === 'string' ? x : x.value;
            const text = typeof x === 'string' ? x : x.label;
            return <option value={val} key={val}>{text}</option>;
          })}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} name={name} defaultValue={value} {...attrs} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={value} {...attrs} />
      )}
    </div>
  );
}

export function SearchBox({ name, placeholder }) {
  const { site, setSite } = useApp();
  return (
    <label className="search">
      <Icon name="search" />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={site.terms[name] || ''}
        onChange={(e) => setSite({ terms: { ...site.terms, [name]: e.target.value } })}
      />
    </label>
  );
}

export function AccountFoodCard({ f }) {
  const { s, shop, accountFavourite, showFood } = useApp();
  const sh = shop(f.shopId);
  const saved = s.favourites.includes(f.id);
  const available = foodAvailable(f);
  return (
    <article className={`food-card ${available ? '' : 'not-available'}`}>
      <div className="food-photo">
        <img src={pic(f.image)} alt={f.name} loading="lazy" />
        <span className="discount">{Math.round((1 - f.sale / f.original) * 100)}% OFF</span>
        <button
          className={`heart-btn ${saved ? 'saved' : ''}`}
          onClick={() => accountFavourite(f.id)}
          aria-label={`${saved ? 'Remove' : 'Save'} ${f.name} ${saved ? 'from' : 'to'} favourites`}
          aria-pressed={saved}
          type="button"
        >
          <Icon name="heart" />
        </button>
      </div>
      <div className="food-body">
        <div className="shop-name"><Icon name="store" className="sm" />{sh.name}</div>
        <h3>{f.name}</h3>
        <div className="price">{accountMoney(f.sale)}<del>{accountMoney(f.original)}</del></div>
        <div className="listing-time"><Icon name="clock" className="sm" />{clock(f.start, true)} – {clock(f.end, true)} · {sh.area}</div>
        <div className="food-bottom">
          <span>{available ? `${f.stock} portions left` : 'Currently unavailable'}</span>
          <Btn className="soft" icon="arrow" onClick={() => showFood(f.id)}>View food</Btn>
        </div>
      </div>
    </article>
  );
}

export function MiniOrder({ o }) {
  const { showOrder } = useApp();
  const qty = o.items.reduce((n, l) => n + l.qty, 0);
  return (
    <div className="mini-order">
      <img src={pic(o.items[0].image)} alt="" />
      <div>
        <button className="row-btn" onClick={() => showOrder(o.id)} type="button">{o.id}</button>
        <h3>{o.shopName}</h3>
        <p>{date(o.date)} · {qty} {qty === 1 ? 'item' : 'items'}</p>
      </div>
      <div className="meta">
        <div><strong>{accountMoney(o.subtotal + o.fee)}</strong><Badge value={o.state} /></div>
        <button className="row-action" onClick={() => showOrder(o.id)} aria-label={`View order ${o.id}`} type="button"><Icon name="chevron" className="sm" /></button>
      </div>
    </div>
  );
}

export function PickupCard({ o }) {
  const { showOrder, showPass } = useApp();
  const canPass = o.payment === 'Paid' && o.state === 'Ready' && o.refund === 'None';
  return (
    <section className="pickup-card">
      <div className="pickup-heading">
        <h2>Your next collection</h2><Badge value={o.state === 'Ready' ? 'Ready' : 'Accepted'} />
      </div>
      <div className="pickup-food">
        <img src={pic(o.items[0].image)} alt={o.items[0].name} />
        <div>
          <div className="shop">{o.shopName}</div>
          <h3>{o.items[0].name}</h3>
          <p>{o.items[0].qty} {o.items[0].qty === 1 ? 'portion' : 'portions'} · Order {o.id}</p>
        </div>
      </div>
      <div className="pickup-info">
        <div>
          <small>COLLECTION WINDOW</small>
          <strong><Icon name="clock" className="sm" />{clock(o.start, true)} – {clock(o.end, true)}</strong>
        </div>
        <div>
          <small>COLLECTION AREA</small>
          <strong><Icon name="location" className="sm" />{o.area}, Dhaka</strong>
        </div>
      </div>
      <div className="pickup-actions">
        {canPass
          ? <Btn className="primary" icon="scan" onClick={() => showPass(o.id)}>Show collection pass</Btn>
          : <Btn className="primary" icon="bag" onClick={() => showOrder(o.id)}>Track your order</Btn>}
        <Btn icon="chevron" onClick={() => showOrder(o.id)}>Order details</Btn>
      </div>
    </section>
  );
}

export function AccountOrderCard({ o }) {
  const { showOrder, showPass } = useApp();
  const canPass = o.payment === 'Paid' && o.state === 'Ready' && o.refund === 'None';
  const qty = o.items.reduce((n, l) => n + l.qty, 0);
  return (
    <article className="account-order">
      <div className="account-order-head">
        <button onClick={() => showOrder(o.id)} type="button">{o.id}</button>
        <span className="muted">{date(o.date)}</span><Badge value={o.state} />
      </div>
      <div className="account-order-food">
        <img src={pic(o.items[0].image)} alt="" />
        <div>
          <h3>{o.shopName}</h3>
          <p>{o.items[0].name}{o.items.length > 1 ? ` + ${o.items.length - 1} more` : ''}</p>
          <p>{qty} {qty === 1 ? 'portion' : 'portions'} · {clock(o.start, true)} – {clock(o.end, true)}</p>
        </div>
      </div>
      {o.refund !== 'None' ? (
        <div className="refund-line">Refund {o.refund.toLowerCase()} · {accountMoney(o.refund === 'Completed' ? o.refundAmount : o.requestedRefund)}</div>
      ) : null}
      <div className="account-order-footer">
        <div className="total">{accountMoney(o.subtotal + o.fee)}<small>Payment: {o.payment}</small></div>
        <div className="filter-group">
          {canPass ? <Btn className="green" icon="scan" onClick={() => showPass(o.id)}>Collection pass</Btn> : null}
          <Btn icon="chevron" onClick={() => showOrder(o.id)}>View order</Btn>
        </div>
      </div>
    </article>
  );
}

export function Metric({ icon, value, label }) {
  return (
    <div className="metric">
      <span className="metric-icon"><Icon name={icon} className="sm" /></span>
      <div><div className="metric-value">{value}</div><div className="metric-top">{label}</div></div>
    </div>
  );
}
