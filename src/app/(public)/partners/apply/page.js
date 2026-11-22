'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageIntro, Field, Chip, Info } from '@/components/ui';
import { LOCATIONS, TODAY } from '@/lib/model';
import { uid } from '@/lib/format';
import { useTitle } from '@/lib/useTitle';

export function ApplicationStatus({ app }) {
  return (
    <div className="container">
      <section className="success">
        <span className="success-mark"><Icon name="check" /></span>
        <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 17 }}>SAMPLE APPLICATION SAVED</div>
        <h1>A fresh beginning for {app.shop}.</h1>
        <p>Your sample application is saved as “Awaiting review”. No application was sent and this shop is not published for sale.</p>
        <div className="panel">
          <h2>{app.id} <Chip className="amber">Awaiting review</Chip></h2>
          <div className="info-grid">
            {[
              ['SHOP', app.shop],
              ['BUSINESS TYPE', app.type],
              ['LOCATION', `${app.area}, ${app.city}`],
              ['CONTACT', app.owner],
              ['BUSINESS EVIDENCE', 'Sample placeholder · Pending'],
              ['OWNER EVIDENCE', 'Sample placeholder · Pending'],
            ].map(([k, v]) => (
              <div key={k}><small>{k}</small><strong>{v}</strong></div>
            ))}
          </div>
        </div>
        <div className="button-row" style={{ justifyContent: 'center' }}>
          <Link className="button" href="/explore">Explore food</Link>
          <Link className="button light" href="/partners/apply?edit=1">Edit sample application</Link>
        </div>
      </section>
    </div>
  );
}

export default function PartnerApplicationPage() {
  return (
    <Suspense fallback={null}>
      <PartnerApplicationInner />
    </Suspense>
  );
}

function PartnerApplicationInner() {
  useTitle('Become a partner');
  const { s, site, setSite, updateS, go, toast } = useApp();
  const searchParams = useSearchParams();
  const editing = searchParams.get('edit') === '1';
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(editing && s.partnerApplication ? { ...s.partnerApplication } : site.draft || {});
  const [city, setCity] = useState((editing && s.partnerApplication?.city) || site.draft?.city || 'Dhaka');
  const [area, setArea] = useState((editing && s.partnerApplication?.area) || site.draft?.area || LOCATIONS[0].areas[0]);

  if (s.partnerApplication && !editing) {
    return (
      <>
        <PageIntro title="A new chance for your shop." sub="Preview the merchant application in three small steps. No real application or document is submitted." eyebrow="BECOME A LAST5 PARTNER" />
        <ApplicationStatus app={s.partnerApplication} />
      </>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const v = Object.fromEntries(new FormData(form));
    if (step < 3) {
      const merged = { ...draft, ...v, city, area };
      setDraft(merged);
      setSite({ draft: merged, step: step + 1 });
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const file = form.querySelector('[type=file]')?.files?.[0];
    if (!v.sampleDocuments && !file) {
      toast('Choose sample placeholders or an optional sample verification file.', true);
      return;
    }
    if (file && (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) || file.size > 10 * 1024 * 1024)) {
      toast('Choose a PDF, JPG or PNG sample file up to 10 MB.', true);
      return;
    }
    const data = { ...draft };
    delete data.verification;
    const app = {
      ...data,
      id: uid('APP'),
      state: 'Awaiting review',
      date: TODAY,
      file: file ? { name: file.name, size: file.size } : null,
    };
    updateS((next) => { next.partnerApplication = app; });
    setSite({ draft: {}, step: 1 });
    go('/partners/status');
  };

  return (
    <>
      <PageIntro
        title="A new chance for your shop."
        sub="Preview the merchant application in three small steps. No real application or document is submitted."
        eyebrow="BECOME A LAST5 PARTNER"
      />
      <div className="container">
        <div className="application">
          <div className="application-steps">
            {['Your details', 'Shop details', 'Review & save'].map((n, i) => (
              <div className={i + 1 === step ? 'active' : ''} key={n}><span>{i + 1}</span>{n}</div>
            ))}
          </div>
          <form className="panel" key={step} onSubmit={submit}>
            <h2>{step === 1 ? 'First, a little about you.' : step === 2 ? 'Let’s meet your shop.' : 'A quick look before saving.'}</h2>
            {step === 1 ? (
              <div className="form-grid">
                <Field label="Contact name · sample" name="owner" value={draft.owner || ''} required />
                <Field label="Your role" name="role" value={draft.role || 'Owner'} required />
                <Field label="Email · sample" name="email" type="email" value={draft.email || ''} required />
                <Field label="Phone · sample" name="phone" value={draft.phone || ''} required />
              </div>
            ) : step === 2 ? (
              <div className="form-grid">
                <Field label="Shop name · sample" name="shop" value={draft.shop || ''} required />
                <Field label="Business type" name="type" type="select" value={draft.type || 'Bakery'} options={['Bakery', 'Café', 'Restaurant', 'Grocery']} />
                <label className="field">
                  <span>City</span>
                  <select name="city" value={city} onChange={(e) => { setCity(e.target.value); setArea(LOCATIONS.find((x) => x.city === e.target.value).areas[0]); }}>
                    {LOCATIONS.map((x) => <option key={x.city}>{x.city}</option>)}
                  </select>
                </label>
                <label className="field">
                  <span>Area</span>
                  <select name="area" value={area} onChange={(e) => setArea(e.target.value)}>
                    {LOCATIONS.find((x) => x.city === city).areas.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </label>
                <Field label="Collection address · sample" name="address" value={draft.address || ''} required wide />
                <Field label="Collection instructions" name="instructions" type="textarea" value={draft.instructions || ''} required wide />
              </div>
            ) : (
              <>
                <div className="info">
                  <div>
                    <strong>{draft.shop}</strong>
                    <br />{draft.type} · {draft.area}, {draft.city}<br />{draft.address}<br />{draft.owner} · {draft.email}
                  </div>
                </div>
                <div className="divider" />
                <h3>Verification information</h3>
                <p className="small muted">Real applications need the required business and owner evidence reviewed. Finish this preview using sample placeholders.</p>
                <label className="check-label">
                  <input type="checkbox" name="sampleDocuments" defaultChecked />
                  <span>Use sample business and owner verification placeholders.</span>
                </label>
                <label className="field">
                  <span>Optional sample verification file</span>
                  <div className="upload">
                    <Icon name="upload" />
                    <p>PDF, JPG or PNG · Up to 10 MB · Sample files only</p>
                    <input type="file" name="verification" accept="application/pdf,image/jpeg,image/png" aria-label="Optional sample verification file" />
                  </div>
                </label>
                <label className="check-label">
                  <input type="checkbox" required />
                  <span>I understand this saves an illustrative application in this browser and does not submit it to a real team.</span>
                </label>
              </>
            )}
            <div className="form-actions">
              {step > 1 ? (
                <button className="button light" type="button" onClick={() => setStep(step - 1)}>Back</button>
              ) : (
                <Link className="button light" href="/partners">Back to partners</Link>
              )}
              <button type="submit" className="button">{step === 3 ? 'Save sample application' : 'Continue'}<Icon name="arrow" /></button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
