'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { Brand } from '@/components/ui';
import { seed, TODAY } from '@/lib/model';
import { useTitle } from '@/lib/useTitle';

export default function AuthScreen() {
  useTitle('My Account');
  const { s, setS, signIn, openModal, goAccount, toast } = useApp();
  const [mode, setMode] = useState('signin');
  const reg = mode === 'register';
  const recover = mode === 'recover';

  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const v = Object.fromEntries(new FormData(form));
    if (recover) {
      openModal({ type: 'recovery-result' });
      return;
    }
    if (reg) {
      if (v.password !== v.confirm) return toast('The demo passwords do not match.', true);
      const next = seed();
      next.signedIn = true;
      next.profile = {
        ...next.profile,
        id: 'CU-' + Date.now(),
        name: String(v.name).trim(),
        email: String(v.email).trim(),
        phone: String(v.phone).trim(),
        emailVerified: false,
        phoneVerified: false,
        joined: TODAY,
      };
      next.orders = [];
      next.favourites = [];
      next.cases = [];
      next.notifications = [];
      next.locations = [];
      next.selectedArea = s.selectedArea || 'Banani';
      setS(next);
      goAccount('overview');
      toast('Sample account created. Verify your contacts in the connected product.');
      return;
    }
    signIn({}, false, { account: true });
  };

  return (
    <div className="auth-wrap">
      <section className="auth-story">
        <Link className="brand" href="/explore"><Brand /></Link>
        <div className="story-copy">
          <h1>Good food deserves another chance.</h1>
          <p>Find something delicious in your neighbourhood. A little less waste, a little more to enjoy.</p>
        </div>
      </section>
      <main className="auth-form-wrap">
        <form className="auth-form" key={mode} onSubmit={submit}>
          <h1>{reg ? 'Your next food find starts here.' : recover ? 'Let’s get you back in.' : 'Welcome back, food lover.'}</h1>
          <p>{reg ? 'Create a sample customer account to explore this flow.' : recover ? 'Preview the recovery request. No message will be sent.' : 'Sign in to the sample account or keep exploring as a guest.'}</p>
          <div className="info-bar" style={{ fontSize: 10, padding: 10 }}>UI demonstration · Do not enter a real password.</div>
          {reg ? (
            <div className="field"><label htmlFor="auth-name">Full name</label><input id="auth-name" name="name" required maxLength={80} /></div>
          ) : null}
          <div className="field"><label htmlFor="auth-email">Email address</label><input id="auth-email" name="email" type="email" defaultValue="tanvir@example.com" required maxLength={254} /></div>
          {reg ? (
            <div className="field"><label htmlFor="auth-phone">Phone number</label><input id="auth-phone" name="phone" type="tel" required maxLength={25} /></div>
          ) : null}
          {!recover ? (
            <div className="field">
              <label htmlFor="auth-password">Demo password</label>
              <input id="auth-password" name="password" type="password" placeholder="No password needed in the UI preview" disabled />
            </div>
          ) : null}
          {reg ? (
            <>
              <div className="field">
                <label htmlFor="auth-confirm">Confirm demo password</label>
                <input id="auth-confirm" name="confirm" type="password" placeholder="No password needed in the UI preview" disabled />
              </div>
              <label className="checkbox-label"><input type="checkbox" required />I accept the sample terms and privacy notice for this demonstration.</label>
            </>
          ) : null}
          <button className="btn primary full" type="submit">
            {reg ? 'Create demo account' : recover ? 'Preview recovery request' : 'Enter sample account'} <Icon name="arrow" className="sm" />
          </button>
          <div className="below">
            {reg ? 'Already have an account?' : 'New to Last5 Deal?'}{' '}
            <button type="button" onClick={() => setMode(reg ? 'signin' : 'register')}>{reg ? 'Sign in' : 'Create account'}</button>
          </div>
          <div className="below">
            <button type="button" onClick={() => setMode('recover')}>Forgot password?</button> · <Link className="orange" href="/explore">Continue browsing</Link>
          </div>
          <div className="auth-foot">Fictional account data. No credentials are transmitted or stored.</div>
        </form>
      </main>
    </div>
  );
}
