'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageIntro, Field } from '@/components/ui';
import { TODAY } from '@/lib/model';
import { uid } from '@/lib/format';
import { useTitle } from '@/lib/useTitle';

export default function ContactPage() {
  useTitle('Contact us');
  const { s, updateS, toast } = useApp();

  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const v = Object.fromEntries(new FormData(form));
    if (!String(v.subject).trim() || !String(v.message).trim()) {
      toast('Enter a subject and useful details.', true);
      return;
    }
    updateS((next) => {
      next.cases.unshift({
        id: uid('ENQ'),
        type: v.type,
        subject: String(v.subject).trim(),
        orderId: '',
        state: 'Open',
        date: TODAY,
        messages: [{ by: 'You', text: String(v.message).trim() }],
      });
    });
    form.reset();
    toast('Sample enquiry saved in this browser. No message was sent.');
  };

  return (
    <>
      <PageIntro
        title="Let’s clear things up."
        sub="Have a question about the marketplace or a sample order? Find the right next step."
        eyebrow="CONTACT LAST5 DEAL"
      />
      <div className="container contact-grid">
        <div>
          <h2>A little conversation.<br />A clearer next step.</h2>
          <p>For a question about a specific order, start from your order page so collection and payment details stay together.</p>
          <div className="contact-method">
            <Icon name="bag" />
            <div>
              <h3>Need help with an order?</h3>
              <p>Open the order and choose “Get help”.</p>
              <Link className="text-link" href="/account/orders">Open my orders <Icon name="arrow" /></Link>
            </div>
          </div>
          <div className="contact-method">
            <Icon name="help" />
            <div>
              <h3>A quick question?</h3>
              <p>The help centre covers food details, payment and collection.</p>
              <Link className="text-link" href="/help">Visit the help centre <Icon name="arrow" /></Link>
            </div>
          </div>
          <div className="contact-method">
            <Icon name="store" />
            <div>
              <h3>Have a neighbourhood shop?</h3>
              <p>Explore the partner journey and sample application.</p>
              <Link className="text-link" href="/partners">Become a partner <Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
        <section className="panel">
          <h2>Leave a little note.</h2>
          <p>This form saves a sample enquiry in this browser. No email or message is sent to a real support team.</p>
          <form onSubmit={submit}>
            <div className="form-grid">
              <Field label="Your name · sample" name="name" value={s.signedIn ? s.profile.name : ''} required />
              <Field label="Email · sample" name="email" type="email" value={s.signedIn ? s.profile.email : ''} required />
              <Field
                label="What is it about?"
                name="type"
                type="select"
                value="General question"
                options={['General question', 'Food listing', 'Collection', 'Payment', 'Merchant partnership']}
                wide
              />
              <Field label="Subject" name="subject" required wide />
              <Field label="Your message" name="message" type="textarea" required wide />
            </div>
            <button type="submit" className="button">Save sample enquiry <Icon name="arrow" /></button>
          </form>
        </section>
      </div>
    </>
  );
}
