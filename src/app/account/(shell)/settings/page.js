'use client';

import React from 'react';
import Link from 'next/link';
import { Switch } from 'antd';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, Btn } from '@/components/account/AccountUI';
import { safeExport } from '@/lib/model';
import { date } from '@/lib/format';
import { TODAY } from '@/lib/model';
import { downloadFile } from '@/lib/download';
import { useTitle } from '@/lib/useTitle';

export default function SettingsPage() {
  useTitle('Settings');
  const { s, updateS, toast, showClosure, showReset } = useApp();
  const preferred = s.locations.find((l) => l.preferred);
  const toggleAlerts = (checked) => {
    updateS((next) => { next.preferences.offerAlerts = checked; });
    toast(checked ? 'Optional offer alerts enabled.' : 'Optional offer alerts disabled. Essential updates stay available.');
  };
  return (
    <>
      <PageHeading title="Settings" sub="Your preferences and account controls." />
      <div className="two-col">
        <div className="settings-stack">
          <section className="panel form-panel">
            <h2>Preferences</h2>
            <p>Make your account work for you.</p>
            <div className="settings-row">
              <div><h3>Preferred area</h3><p>{preferred?.area || 'Choose an area'} · New-offer alerts follow this area.</p></div>
              <Link className="btn" href="/account/locations">Change area</Link>
            </div>
            <div className="settings-row">
              <div><h3>New food offer alerts</h3><p>Optional dashboard alerts for your preferred area.</p></div>
              <Switch checked={s.preferences.offerAlerts} onChange={toggleAlerts} aria-label="New food offer alerts" />
            </div>
            <div className="settings-row">
              <div><h3>Order and account updates</h3><p>Essential payment, collection and security updates stay available.</p></div>
              <span className="badge green" style={{ marginLeft: 'auto' }}>Always available</span>
            </div>
            <div className="settings-row">
              <div><h3>Display language</h3><p>Current interface language.</p></div>
              <select className="toolbar-select customer-settings-select" aria-label="Display language" defaultValue="English">
                <option>English</option>
              </select>
            </div>
          </section>
          <section className="panel form-panel">
            <h2>Your data and account</h2>
            <p>View your own information or request an account review.</p>
            <div className="settings-row">
              <div><h3>Download account summary</h3><p>Includes your profile, orders and saved choices. Collection secrets are excluded.</p></div>
              <Btn icon="download" onClick={() => { downloadFile('Last5_Account_Summary_' + TODAY + '.json', JSON.stringify(safeExport(s), null, 2), 'application/json'); toast('Your download is ready.'); }}>Download</Btn>
            </div>
            <div className="settings-row">
              <div><h3>Request account closure</h3><p>Outstanding orders, refunds and records need review before closure.</p></div>
              <Btn className="danger" icon="file" onClick={showClosure}>Request review</Btn>
            </div>
            {s.requests.map((r, i) => (
              <div className="request-state" key={i}>{r.type} · {r.state} · {date(r.date)}</div>
            ))}
          </section>
        </div>
        <aside>
          <section className="panel form-panel">
            <h2>About this preview</h2>
            <p>This is a working UI with fictional customer, shop and payment data. It does not charge money or send verification messages.</p>
            <div className="settings-row">
              <div><h3>Account access screens</h3><p>Explore the sign-in and registration flow.</p></div>
              <Link className="btn" href="/account/auth"><Icon name="eye" className="sm" />Preview</Link>
            </div>
            <div className="settings-row">
              <div><h3>Restore sample data</h3><p>Reset local demo changes and sample order activity.</p></div>
              <Btn className="danger" icon="refresh" onClick={showReset}>Reset</Btn>
            </div>
          </section>
          <div className="notice" style={{ marginTop: 18 }}>
            <Icon name="info" className="sm" />Customer and merchant prototypes have independent sample data. A customer action here does not update the separate merchant preview.
          </div>
        </aside>
      </div>
    </>
  );
}
