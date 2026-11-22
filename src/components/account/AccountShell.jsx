'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { Brand } from '@/components/ui';
import { initials } from '@/lib/format';
import { TODAY } from '@/lib/model';
import AuthScreen from '@/components/account/AuthScreen';

const NAV = [
  ['overview', 'Overview', 'grid'],
  ['orders', 'My orders', 'bag'],
  ['favourites', 'Favourites', 'heart'],
  ['locations', 'Saved locations', 'location'],
  ['payments', 'Payments & refunds', 'wallet'],
  ['notifications', 'Notifications', 'bell'],
  ['profile', 'My profile', 'users'],
  ['security', 'Security', 'shield'],
  ['support', 'Help & support', 'support'],
  ['settings', 'Settings', 'settings'],
];

const TITLES = Object.fromEntries([...NAV, ['explore', 'Explore food']].map((x) => [x[0], x[1]]));

export default function AccountShell({ children }) {
  const { s, site, setSite, signOut, showCart, showAreaPicker, goAccount, showCaseForm } = useApp();
  const pathname = usePathname();
  const name = pathname.split('/')[2] || 'overview';
  const mobileOpen = site.mobileOpen;
  const ownedOrders = s.orders.filter((o) => o.customerId === s.profile.id);
  const cartCount = s.cart.reduce((n, l) => n + l.qty, 0);
  const unread = s.notifications.filter((n) => !n.read).length;

  if (!s.signedIn && !['explore', 'support'].includes(name)) {
    return <AuthScreen />;
  }

  const count = (n) => (n === 'notifications' ? unread : n === 'orders' ? ownedOrders.filter((o) => o.state === 'Ready').length : 0);

  return (
    <div className="layout customer-main">
      <div className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`} onClick={() => setSite({ mobileOpen: false })} />
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} aria-label="Customer navigation">
        <Link className="brand" href="/"><Brand /></Link>
        <div className="merchant-label">GOOD FOOD FINDS YOU</div>
        {s.signedIn ? (
          <Link className="customer-switch" href="/account/profile">
            <div className="avatar">{initials(s.profile.name)}</div>
            <div><strong>{s.profile.name}</strong><small>Your personal account</small></div>
          </Link>
        ) : (
          <div className="customer-switch">
            <div className="avatar"><Icon name="users" className="sm" /></div>
            <div><strong>Welcome, food lover</strong><small>Browse before you sign in</small></div>
          </div>
        )}
        <nav>
          <Link className={`nav-link ${name === 'explore' ? 'active' : ''}`} href="/account/explore">
            <Icon name="search" /><span>Explore food</span><Icon name="arrow" className="sm" />
          </Link>
          {s.signedIn ? (
            <>
              <div className="nav-section">MY ACCOUNT</div>
              {NAV.slice(0, 6).map(([n, label, ic]) => (
                <Link key={n} href={`/account/${n}`} className={`nav-link ${name === n ? 'active' : ''}`} aria-current={name === n ? 'page' : undefined}>
                  <Icon name={ic} /><span>{label}</span>
                  {count(n) ? <span className={`nav-count ${n === 'notifications' ? 'gray' : ''}`}>{count(n)}</span> : null}
                </Link>
              ))}
              <div className="nav-section">ACCOUNT & HELP</div>
              {NAV.slice(6).map(([n, label, ic]) => (
                <Link key={n} href={`/account/${n}`} className={`nav-link ${name === n ? 'active' : ''}`} aria-current={name === n ? 'page' : undefined}>
                  <Icon name={ic} /><span>{label}</span>
                </Link>
              ))}
              <button className="nav-link account-menu-signout" style={{ width: '100%' }} onClick={signOut} type="button">
                <Icon name="logout" /><span>Sign out</span>
              </button>
            </>
          ) : (
            <>
              <div className="nav-section">WELCOME</div>
              <Link className="nav-link" href="/account/support"><Icon name="support" /><span>Help & support</span></Link>
              <Link className="nav-link" href="/account/auth"><Icon name="users" />Sign in or create account</Link>
            </>
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><Icon name="leaf" className="sm" /></div>
            <h3>Good food. A little less waste.</h3>
            <p>Your next favourite find is close by.</p>
            <button onClick={() => goAccount('explore')} type="button">Find something delicious <Icon name="arrow" className="sm" /></button>
          </div>
        </div>
      </aside>
      <div className="main-wrap">
        <header className="topbar">
          <div className="breadcrumb">
            <button className="icon-btn mobile-menu" onClick={() => setSite({ mobileOpen: true })} aria-label="Open navigation" type="button"><Icon name="hamburger" /></button>
            <span>My account</span>
            <span className="crumb-arrow">/</span>
            <strong>{TITLES[name] || 'Overview'}</strong>
          </div>
          <div className="top-actions">
            <button className="customer-top-location" onClick={showAreaPicker} type="button">
              <Icon name="location" className="sm" /><strong>{s.selectedArea || 'Choose area'}</strong><Icon name="down" className="sm" />
            </button>
            <span className="demo-label">SAMPLE ACCOUNT</span>
            <button className="icon-btn header-cart" onClick={showCart} aria-label="Open cart" type="button">
              <Icon name="bag" />{cartCount ? <span className="nav-count">{cartCount}</span> : null}
            </button>
            {s.signedIn ? (
              <>
                <Link className="icon-btn" href="/account/notifications" aria-label="View notifications">
                  <Icon name="bell" />{unread ? <i className="notification-dot" /> : null}
                </Link>
                <span className="top-separator" />
                <Link className="avatar" href="/account/profile" aria-label="My profile">{initials(s.profile.name)}</Link>
              </>
            ) : (
              <Link className="btn soft" href="/account/auth">Sign in</Link>
            )}
          </div>
        </header>
        <main id="main" className="page" tabIndex={-1}>
          {children}
          <footer className="page-foot">
            <span>© {TODAY.slice(0, 4)} Last5 Deal. Good food deserves another chance.</span>
            <span className="demo-note"><Icon name="info" className="sm" />Interactive preview · Fictional data</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
