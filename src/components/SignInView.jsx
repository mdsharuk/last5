'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { Field } from '@/components/ui';
import { useTitle } from '@/lib/useTitle';

export default function SignInPage({ signup = false }) {
  useTitle(signup ? 'Create an account' : 'Sign in');
  const { site, signIn, toast } = useApp();

  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const v = Object.fromEntries(new FormData(form));
    const returnTo = new URLSearchParams(window.location.search).get('returnTo') || site.returnTo || '/';
    if (signup) {
      if (!String(v.name).trim()) return toast('Enter your name.', true);
      if (String(v.password) !== String(v.confirm)) return toast('The demo passwords do not match.', true);
    }
    signIn({ name: v.name, email: v.email, phone: v.phone }, signup, { returnTo });
  };

  return (
    <div className="auth-layout">
      <div className="auth-image">
        <img src="/assets/croissant.jpg" alt="Golden bakery pastries" />
        <div>
          <h2>Good food.<br />A little closer to you.</h2>
          <p>Find your favourites, save on every bite, and give delicious food another chance.</p>
        </div>
      </div>
      <section className="auth-content">
        <div className="eyebrow">YOUR NEXT GOOD FIND STARTS HERE</div>
        <h1>{signup ? 'A fresh little beginning.' : 'Welcome back.'}</h1>
        <p>{signup ? 'Create a browser-local sample account to explore the full shopping journey.' : 'Step into the sample customer account. Your good food finds are waiting.'}</p>
        <form onSubmit={submit}>
          {signup ? <Field label="Full name · sample" name="name" value="Tanvir Hasan" required /> : null}
          <Field label="Email · sample" name="email" type="email" value="customer@example.com" required />
          {signup ? <Field label="Phone · sample" name="phone" value="+880 1700 000000" required /> : null}
          <label className="field">
            <span>Password</span>
            <input type="password" disabled placeholder="No password needed in demo mode" />
            <small>This preview does not authenticate a real account.</small>
          </label>
          {signup ? (
            <label className="check-label">
              <input type="checkbox" required />
              <span>I understand this creates a browser-local sample account for this UI preview.</span>
            </label>
          ) : null}
          <button type="submit" className="button full">
            {signup ? 'Create sample account' : 'Continue with demo account'}<Icon name="arrow" />
          </button>
        </form>
        <div className="auth-switch">
          {signup ? <>Already have an account? <Link href="/sign-in">Sign in</Link></> : <>New to Last5 Deal? <Link href="/sign-up">Create an account</Link></>}
        </div>
        <p className="form-note" style={{ textAlign: 'center' }}>No real account, password, email or SMS is created.</p>
      </section>
    </div>
  );
}
