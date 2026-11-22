'use client';

import React from 'react';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, AccountField, Badge, Btn } from '@/components/account/AccountUI';
import { saveProfile, accountSummary } from '@/lib/model';
import { date } from '@/lib/format';
import { useTitle } from '@/lib/useTitle';

export default function ProfilePage() {
  useTitle('My profile');
  const { s, setS, toast, updateS } = useApp();
  const p = s.profile;
  const a = accountSummary(s);
  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const next = structuredClone(s);
      saveProfile(next, data);
      setS(next);
      toast(next.profile.pendingContact ? 'Profile saved. New contact details are pending verification.' : 'Profile saved.');
    } catch (err) {
      toast(err.message, true);
    }
  };
  return (
    <>
      <PageHeading title="My profile" sub="Your personal details, kept up to date." />
      <div className="two-col">
        <form className="panel form-panel" onSubmit={submit}>
          <h2>Personal information</h2>
          <p>Update your name or request a verified contact change.</p>
          {p.pendingContact ? (
            <div className="profile-pending">
              <strong>Verification pending</strong>
              <p style={{ marginTop: 6 }}>
                {p.pendingContact.email ? <>Email: {p.pendingContact.email}<br /></> : null}
                {p.pendingContact.phone ? <>Phone: {p.pendingContact.phone}</> : null}
              </p>
              <p style={{ marginTop: 6 }}>Your current verified contacts remain active. No verification message is sent in this preview.</p>
              <button
                className="btn link"
                type="button"
                style={{ marginTop: 8 }}
                onClick={() => { updateS((next) => { next.profile.pendingContact = null; }); toast('Contact change request cancelled.'); }}
              >
                Cancel change request
              </button>
            </div>
          ) : null}
          <div className="form-grid">
            <AccountField label="Full name" name="name" value={p.name} attrs={{ required: true, maxLength: 80 }} full />
            <AccountField label="Email address" name="email" type="email" value={p.email} attrs={{ required: true, maxLength: 254 }} full />
            <div className="field full">
              <div className="profile-contact"><span>Current email verification</span><Badge value={p.emailVerified ? 'Verified' : 'Pending'} /></div>
            </div>
            <AccountField label="Phone number" name="phone" type="tel" value={p.phone} attrs={{ required: true, maxLength: 25 }} full />
            <div className="field full">
              <div className="profile-contact"><span>Current phone verification</span><Badge value={p.phoneVerified ? 'Verified' : 'Pending'} /></div>
            </div>
            <div className="field full">
              <small>A changed phone or email needs verification before it replaces your current contact. Existing order details remain unchanged.</small>
            </div>
            <div className="form-actions">
              <button type="reset" className="btn">Discard changes</button>
              <button type="submit" className="btn primary">Save profile</button>
            </div>
          </div>
        </form>
        <aside>
          <section className="panel account-card">
            <div className="avatar">{p.name.split(' ').slice(0, 2).map((x) => x[0]).join('')}</div>
            <h2>{p.name}</h2>
            <p>Member since {date(p.joined, { month: 'long', year: 'numeric' })}</p>
            <Badge value={p.emailVerified && p.phoneVerified ? 'Verified' : 'Pending'} />
            <div className="stat-pair">
              <div><strong>{a.collected}</strong><small>collections enjoyed</small></div>
              <div><strong>{s.favourites.length}</strong><small>favourite finds</small></div>
            </div>
          </section>
          <div className="notice" style={{ marginTop: 18 }}>
            <Icon name="lock" className="sm" />Your profile is private. Your order retains the contact details confirmed at checkout.
          </div>
        </aside>
      </div>
    </>
  );
}
