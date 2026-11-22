'use client';

import React from 'react';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, Badge, Btn, AccountEmpty } from '@/components/account/AccountUI';
import { setPreferred } from '@/lib/model';
import { useTitle } from '@/lib/useTitle';

export default function LocationsPage() {
  useTitle('Saved locations');
  const { s, setS, toast, showLocation, goAccount, openModal } = useApp();
  const makePreferred = (id) => {
    const next = structuredClone(s);
    setPreferred(next, id);
    setS(next);
    toast('Preferred area updated. Existing orders keep their collection location.');
  };
  return (
    <>
      <PageHeading
        title="Saved locations"
        sub="Find food around the places that matter to you."
        actions={<Btn className="primary" icon="plus" onClick={() => showLocation()}>Add saved area</Btn>}
      />
      <div className="info-bar success">
        <Icon name="location" className="sm" />
        <div>Your preferred area is used for discovery and new-offer alerts. These are collection areas, not delivery addresses.</div>
      </div>
      <div className="area-grid">
        {s.locations.map((l) => (
          <article className={`area-card ${l.preferred ? 'preferred' : ''}`} key={l.id}>
            <div className="area-card-head">
              <span className="area-icon"><Icon name="location" /></span>
              {l.preferred ? <Badge value="Preferred" /> : null}
            </div>
            <h2>{l.label}</h2>
            <p>{l.area}, {l.city}</p>
            <div className="filter-group">
              {l.preferred
                ? <Btn className="soft" icon="search" onClick={() => goAccount('explore')}>Explore food here</Btn>
                : <Btn icon="check" onClick={() => makePreferred(l.id)}>Make preferred</Btn>}
              <Btn icon="edit" onClick={() => showLocation(l.id)}>Edit</Btn>
              <button className="row-btn" onClick={() => openModal({ type: 'remove-location', id: l.id })} type="button">Remove</button>
            </div>
          </article>
        ))}
        {!s.locations.length ? (
          <section className="panel"><AccountEmpty title="Where would you like to explore?" text="Save a collection area to discover food nearby." label="Add an area" onAction={() => showLocation()} /></section>
        ) : null}
      </div>
      <div className="notice" style={{ marginTop: 22 }}>
        <Icon name="info" className="sm" />Changing your area doesn’t move the shop or collection window of an existing order. Always check your order’s collection address.
      </div>
    </>
  );
}
