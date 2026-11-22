'use client';

import React, { useEffect } from 'react';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, AccountOrderCard, AccountEmpty, SearchBox, Btn } from '@/components/account/AccountUI';
import { isActive } from '@/lib/model';
import { useTitle } from '@/lib/useTitle';

export default function OrdersPage() {
  useTitle('My orders');
  const { s, site, setSite, showOrder } = useApp();
  const tab = site.filtersAccount.orders || 'Active';
  const term = (site.terms.orders || '').toLowerCase();
  const orders = s.orders.filter((o) => o.customerId === s.profile.id);
  const list = orders.filter(
    (o) =>
      (tab === 'All orders' || (tab === 'Active' && isActive(o)) || (tab === 'Completed' && o.state === 'Collected') || (tab === 'Cancelled' && ['Cancelled', 'Rejected'].includes(o.state))) &&
      `${o.id} ${o.shopName} ${o.items.map((i) => i.name).join(' ')}`.toLowerCase().includes(term)
  );

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('order');
    if (param) showOrder(param);
  }, [showOrder]);

  return (
    <>
      <PageHeading title="My orders" sub="Every food find, from payment to collection." />
      <div className="content-filter">
        <div className="pills">
          {['Active', 'Completed', 'Cancelled', 'All orders'].map((x) => (
            <button className={`pill ${tab === x ? 'active' : ''}`} onClick={() => setSite({ filtersAccount: { ...site.filtersAccount, orders: x } })} type="button" key={x}>{x}</button>
          ))}
        </div>
        <SearchBox name="orders" placeholder="Search order or shop" />
      </div>
      {list.length ? (
        <div className="order-grid">{list.map((o) => <AccountOrderCard o={o} key={o.id} />)}</div>
      ) : (
        <section className="panel">
          <AccountEmpty title="No orders to show" text="Try a different filter, or explore your next food find." />
        </section>
      )}
      <div className="notice" style={{ marginTop: 22 }}>
        <Icon name="info" className="sm" />Payment, order and refund statuses are tracked separately. A refund request does not mean that funds have already been returned.
      </div>
    </>
  );
}
