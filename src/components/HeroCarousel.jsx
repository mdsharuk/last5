'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { money, pic } from '@/lib/format';
import { foodAvailable } from '@/lib/model';

const PREFERRED = ['F9', 'F1', 'F7', 'F4', 'F15'];
const MAX_SLIDES = 5;

export default function HeroCarousel() {
  const { s, food, shop } = useApp();

  const slides = useMemo(() => {
    const preferred = PREFERRED.map((id) => food(id)).filter((f) => f && foodAvailable(f));
    const extra = s.foods
      .filter((f) => foodAvailable(f) && !preferred.some((p) => p.id === f.id))
      .slice(0, Math.max(0, MAX_SLIDES - preferred.length));
    return [...preferred, ...extra].slice(0, MAX_SLIDES);
  }, [s.foods, food]);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (event) => setReducedMotion(event.matches);
    setReducedMotion(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    setActive((current) => (current >= slides.length ? 0 : current));
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length || paused || hovered || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slides.length, paused, hovered, reducedMotion]);

  if (!slides.length) return null;

  const step = (delta) => {
    setActive((current) => (current + delta + slides.length) % slides.length);
  };

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Featured surplus offers"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div className="hero-carousel-track">
        {slides.map((f, index) => {
          const sh = shop(f.shopId);
          const discount = Math.round((1 - f.sale / f.original) * 100);
          const isActive = index === active;
          return (
            <article className={`hero-slide ${isActive ? 'active' : ''}`} key={f.id} aria-hidden={!isActive}>
              <img
                src={pic(f.image)}
                alt={f.name}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
              />
              <div className="hero-slide-content">
                <div className="hero-slide-location">
                  <span className="hero-location-dot" />
                  {sh.area}, {sh.city}
                </div>
                <h2 className="hero-slide-title">
                  <Link href={`/food/${f.id}`} tabIndex={isActive ? 0 : -1}>
                    {f.name}
                  </Link>
                </h2>
                <p className="hero-slide-shop">{sh.name}</p>
                <div className="hero-slide-bottom">
                  <div className="hero-slide-price">
                    <strong>{money(f.sale)}</strong>
                    <del>{money(f.original)}</del>
                    <span className="hero-slide-discount">{discount}% OFF</span>
                  </div>
                  <span className="hero-slide-stock">{f.stock} units left</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="live-pill">
        <span className="live-dot" />
        Live surplus spotlight
      </div>

      <div className="hero-carousel-controls">
        <button
          className="hero-carousel-arrow"
          onClick={() => step(-1)}
          aria-label="Previous featured offer"
          type="button"
        >
          <Icon name="arrow" style={{ transform: 'rotate(180deg)' }} />
        </button>

        <div className="hero-carousel-center">
          <div className="hero-carousel-dots">
            {slides.map((f, index) => (
              <button
                key={f.id}
                className={index === active ? 'active' : ''}
                onClick={() => setActive(index)}
                aria-label={`Show ${f.name}`}
                aria-current={index === active ? 'true' : undefined}
                type="button"
              />
            ))}
          </div>
          <button
            className="hero-carousel-play"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? 'Play featured offers' : 'Pause featured offers'}
            aria-pressed={paused}
            type="button"
          >
            <Icon name={paused ? 'play' : 'pause'} />
          </button>
        </div>

        <button
          className="hero-carousel-arrow"
          onClick={() => step(1)}
          aria-label="Next featured offer"
          type="button"
        >
          <Icon name="arrow" />
        </button>
      </div>
    </section>
  );
}
