'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, Badge, Btn } from '@/components/account/AccountUI';
import { useTitle } from '@/lib/useTitle';

export default function SecurityPage() {
  useTitle('Security');
  const { s, updateS, toast, showRecovery, signOut } = useApp();
  const endSession = (id) => {
    updateS((next) => { next.sessions = next.sessions.filter((x) => x.id !== id || x.current); });
    toast('Sample session signed out.');
  };
  return (
    <>
      <PageHeading title="Security" sub="Keep access to your account in your hands." />
      <div className="two-col">
        <div>
          <section className="security-card">
            <h2>Account access</h2>
            <p>Secure recovery and verified contact information.</p>
            <div className="settings-row">
              <div><h3>Password recovery</h3><p>Use an expiring recovery link to update your password.</p></div>
              <Btn icon="lock" onClick={showRecovery}>Preview recovery</Btn>
            </div>
            <div className="settings-row">
              <div><h3>Email and phone</h3><p>Change a contact through the verification workflow.</p></div>
              <Link className="btn" href="/account/profile">My profile</Link>
            </div>
            <div className="settings-row">
              <div><h3>Sign out</h3><p>Close this demo session and continue browsing as a guest.</p></div>
              <Btn icon="logout" onClick={signOut}>Sign out</Btn>
            </div>
          </section>
          <section className="security-card">
            <h2>Your sample sessions</h2>
            <p>Demonstration session controls for this UI.</p>
            {s.sessions.map((x) => (
              <div className="session-row" key={x.id}>
                <Icon name="shield" />
                <div><h3>{x.name}</h3><p>{x.last}</p></div>
                {x.current ? <Badge value="Current" dot={false} /> : <Btn icon="logout" onClick={() => endSession(x.id)}>Sign out</Btn>}
              </div>
            ))}
          </section>
        </div>
        <aside className="panel form-panel" style={{ alignSelf: 'start' }}>
          <div className="empty-icon" style={{ margin: '0 0 16px' }}><Icon name="shield" className="lg" /></div>
          <h2>A few good account habits</h2>
          <p>Keep your password and collection pass private. Last5 support does not need your password, card security code or mobile-wallet PIN.</p>
          <div className="divided privacy-note">A collection pass authorizes the food handover. Show it only at the correct shop for your order.</div>
          <Link className="btn full" href="/account/support" style={{ marginTop: 20 }}><Icon name="support" className="sm" /> Get account help</Link>
        </aside>
      </div>
    </>
  );
}
