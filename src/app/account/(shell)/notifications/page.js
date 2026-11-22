'use client';

import React from 'react';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, Btn } from '@/components/account/AccountUI';
import { useTitle } from '@/lib/useTitle';

export default function NotificationsPage() {
  useTitle('Notifications');
  const { s, updateS, toast, showOrder, showFood, goAccount } = useApp();
  const markAll = () => {
    updateS((next) => next.notifications.forEach((n) => { n.read = true; }));
    toast('All notifications marked as read.');
  };
  const open = (n) => {
    updateS((next) => {
      const found = next.notifications.find((x) => x.id === n.id);
      if (found) found.read = true;
    });
    if (n.orderId) return showOrder(n.orderId);
    if (n.foodId) return showFood(n.foodId);
    return goAccount(n.route);
  };
  return (
    <>
      <PageHeading
        title="Notifications"
        sub="Order updates and good food in your preferred area."
        actions={<Btn icon="check" onClick={markAll}>Mark all as read</Btn>}
      />
      <section className="panel">
        {s.notifications.map((n) => (
          <article className={`notification-item ${n.read ? '' : 'unread'}`} key={n.id}>
            <div className="circle"><Icon name={n.kind === 'offer' ? 'tag' : n.kind === 'refund' ? 'wallet' : 'bag'} /></div>
            <div>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              <button onClick={() => open(n)} type="button">View details {n.read ? '' : '· Mark as read'}</button>
            </div>
            <span className="meta">{n.time}{n.read ? null : <div className="orange" style={{ marginTop: 4 }}>● Unread</div>}</span>
          </article>
        ))}
        {!s.notifications.length ? (
          <div className="empty"><p>You’re all caught up. Your next account and order updates will appear here.</p></div>
        ) : null}
      </section>
    </>
  );
}
