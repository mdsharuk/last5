"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Icon from "@/lib/icons";
import { useApp } from "@/components/AppProvider";
import {
  SectionHead,
  FoodGrid,
  ShopCard,
  Steps,
  PartnerBanner,
  FaqList,
} from "@/components/ui";
import { CATEGORIES, FAQS } from "@/lib/data";
import { useTitle } from "@/lib/useTitle";
import HeroCarousel from "@/components/HeroCarousel";

export default function HomePage() {
  useTitle("Good food, another chance");
  const { s, site, setSite, go, localFoods, SHOPS } = useApp();
  const railRef = useRef(null);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  const local = localFoods();
  const pick = ["F9", "F1", "F7", "F10", "F3", "F2", "F5", "F8"]
    .map((id) => local.find((f) => f.id === id))
    .filter(Boolean);
  const rows = [...pick, ...local.filter((f) => !pick.includes(f))].slice(0, 8);
  const localShops = SHOPS.filter(
    (sh) =>
      sh.city === s.siteSettings.city &&
      (!s.siteSettings.area || sh.area === s.siteSettings.area),
  ).slice(0, 5);

  useEffect(() => {
    if (site.paused) return;
    const timer = setInterval(() => {
      setSite((prev) => ({
        featured: (prev.featured + 1) % Math.max(1, localShops.length),
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, [site.paused, localShops.length, setSite]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const nodes = rail.querySelectorAll(".shop-tile");
    nodes.forEach((n, i) => n.classList.toggle("active", i === site.featured));
    if (rail.scrollWidth > rail.clientWidth && nodes[site.featured]) {
      rail.scrollTo({
        left: nodes[site.featured].offsetLeft - rail.offsetLeft,
        behavior: "smooth",
      });
    }
  }, [site.featured]);

  const cycle = (delta) => {
    setSite((prev) => ({
      featured:
        (prev.featured + delta + localShops.length) %
        Math.max(1, localShops.length),
    }));
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <Icon name="leaf" />
                Surplus Food Marketplace • Dhaka (Uttara & Dhanmondi)
              </div>
              <h1>
                Good food.
                <br />
                <em>Better Tomorrow</em>
              </h1>
              <p>
                Discover great food at discounted prices from local bakeries,
                restaurants and shops in Uttara and Dhanmondi. Know exactly what
                you're rescuing before you collect.
              </p>
              <div className="hero-actions">
                <button
                  className="button"
                  type="button"
                  onClick={() => scrollToSection("food-finds")}
                >
                  Explore Food Near You <Icon name="arrow" />
                </button>
                <button
                  className="button outline"
                  type="button"
                  onClick={() => scrollToSection("become-a-partner")}
                >
                  <Icon name="store" /> Become a Food Partner
                </button>
              </div>
            </div>
            <HeroCarousel />
          </div>
          <div className="hero-bottom">
            <div>
              <span>
                <Icon name="check" />
                See exactly what you get
              </span>
              <span>
                <Icon name="card" />
                Pay online with ease
              </span>
              <span>
                <Icon name="store" />
                Collect from your local shop
              </span>
            </div>
            <small>Good food. Your neighbourhood. A new chance.</small>
          </div>
        </div>
      </section>

      <div className="categories" id="food-finds">
        <div className="container category-row">
          {CATEGORIES.map(([n, i]) => (
            <button
              key={n}
              className={`category-btn ${site.category === n ? "active" : ""}`}
              onClick={() => {
                setSite({ category: n, q: "", limit: 9 });
                go("/explore");
              }}
              type="button"
            >
              <span>
                <Icon name={i} />
              </span>
              {n}
            </button>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <SectionHead
            title="Your next delicious find."
            sub={`Explore sample offers in ${s.siteSettings.area || s.siteSettings.city}. A good bite is closer than you think.`}
            action={
              <Link className="text-link" href="/explore">
                Explore all food <Icon name="arrow" />
              </Link>
            }
            eyebrow="FRESH FINDS, SMALLER PRICES"
          />
          {rows.length ? (
            <FoodGrid rows={rows} />
          ) : (
            <div className="empty">
              <Icon name="bag" />
              <h2>A little quiet around here.</h2>
              <p>
                No sample offers in this area right now. Try another
                neighbourhood.
              </p>
            </div>
          )}
          <div className="more-row">
            <Link className="button outline" href="/explore">
              Find more good food <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section compact cream">
        <div className="container">
          <SectionHead
            title="Local favourites. New possibilities."
            sub="Meet the neighbourhood shops giving their surplus food a second chance."
            action={
              <>
                <button
                  className="rail-btn"
                  onClick={() => cycle(-1)}
                  aria-label="Previous featured shop"
                  type="button"
                >
                  <Icon name="arrow" style={{ transform: "rotate(180deg)" }} />
                </button>
                <button
                  className="rail-btn"
                  onClick={() => setSite({ paused: !site.paused })}
                  aria-label={`${site.paused ? "Play" : "Pause"} featured shops`}
                  type="button"
                >
                  <Icon name={site.paused ? "play" : "pause"} />
                </button>
                <button
                  className="rail-btn"
                  onClick={() => cycle(1)}
                  aria-label="Next featured shop"
                  type="button"
                >
                  <Icon name="arrow" />
                </button>
              </>
            }
          />
          <div className="shop-rail" id="featured" ref={railRef}>
            {localShops.map((sh, i) => (
              <ShopCard sh={sh} active={i === site.featured} key={sh.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="story-panel">
            <img
              src="/assets/hero.jpg"
              alt="A table of colourful food"
              loading="lazy"
            />
            <div className="story-copy">
              <div className="eyebrow">THE LITTLE IDEA BEHIND LAST5</div>
              <h2>
                Too good to waste.
                <br />
                <em>Too delicious to miss.</em>
              </h2>
              <p>
                A few extra croissants. One more portion from the kitchen. Food
                can be perfectly worth enjoying and still be left over. We
                connect those extra portions with people who’ll love them.
              </p>
              <Link className="text-link" href="/about">
                Get to know Last5 Deal <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section compact cream">
        <div className="container">
          <SectionHead
            title="Three little steps. One good feeling."
            sub="From your first find to your last delicious bite."
            action={
              <Link className="text-link" href="/how-it-works">
                How it works <Icon name="arrow" />
              </Link>
            }
            eyebrow="EASY TO FIND. EASY TO LOVE."
          />
          <Steps />
        </div>
      </section>

      <section className="section">
        <div className="container" id="become-a-partner">
          <PartnerBanner />
        </div>
      </section>

      <section className="section compact">
        <div className="container faq-layout">
          <div>
            <div className="eyebrow" style={{ marginBottom: 17 }}>
              A FEW THINGS YOU MIGHT WONDER
            </div>
            <h2>
              A little clarity
              <br />
              before your first bite.
            </h2>
            <p>New to surplus food? Here’s how it all comes together.</p>
            <Link className="text-link" href="/help">
              Visit the help centre <Icon name="arrow" />
            </Link>
          </div>
          <div>
            <FaqList items={FAQS.filter((_, i) => [0, 2, 3, 5].includes(i))} />
          </div>
        </div>
      </section>
    </>
  );
}
