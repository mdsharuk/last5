"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Modal, Drawer } from "antd";
import Icon from "@/lib/icons";
import { useApp } from "@/components/AppProvider";
import { Brand, Field, Empty, Info } from "@/components/ui";
import { money, initials, pic } from "@/lib/format";

export function Toasts() {
  const { toasts } = useApp();
  return (
    <div id="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div
          className={`toast ${t.error ? "error" : ""}`}
          role="status"
          key={t.id}
        >
          <Icon name={t.error ? "info" : "check"} />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export function PublicHeader() {
  const { s, site, setSite, go, showLocationPublic, showBag, needSignin } =
    useApp();
  const pathname = usePathname();
  const area = s.siteSettings.area || s.siteSettings.city;
  const cartCount = s.cart.reduce((n, l) => n + l.qty, 0);
  const links = [
    ["Home", "/"],
    ["Explore food", "/explore"],
    ["How it works", "/how-it-works"],
    ["Our story", "/about"],
  ];
  return (
    <>
      <div className="announcement">
        <Icon name="leaf" />
        Good food deserves another chance.
        <span>Website preview · Sample offers & checkout</span>
      </div>
      <header className="header">
        <div className="container header-row">
          <button
            className="icon-btn menu-toggle"
            onClick={() => setSite({ menu: !site.menu })}
            aria-label={`${site.menu ? "Close" : "Open"} menu`}
            aria-expanded={site.menu}
            type="button"
          >
            <Icon name={site.menu ? "close" : "hamburger"} />
          </button>
          <Link className="logo" href="/">
            <Brand />
          </Link>
          <button
            className="location-btn"
            onClick={showLocationPublic}
            aria-label="Change discovery location"
            type="button"
          >
            <Icon name="pin" />
            <span>
              <strong>{area}</strong>
              {s.siteSettings.area
                ? s.siteSettings.city
                : "All neighbourhoods"}
            </span>
            <Icon name="down" />
          </button>
          <nav className="nav" aria-label="Main navigation">
            {links.map(([n, p]) => (
              <Link key={p} href={p} className={pathname === p ? "active" : ""}>
                {n}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-btn favourites-header"
              onClick={() => {
                if (s.signedIn) go("/account/favourites");
                else needSignin(null, { returnTo: "/account/favourites" });
              }}
              aria-label="My favourites"
              type="button"
            >
              <Icon name="heart" />
            </button>
            <button
              className="icon-btn"
              onClick={showBag}
              aria-label="Open shopping bag"
              type="button"
            >
              <Icon name="bag" />
              {cartCount ? <span className="counter">{cartCount}</span> : null}
            </button>
            {s.signedIn ? (
              <Link
                className="account-link"
                href="/account/overview"
                aria-label="My account"
              >
                <span className="avatar">{initials(s.profile.name)}</span>
                <span className="account-name">My account</span>
              </Link>
            ) : (
              <Link className="account-link" href="/sign-in">
                <Icon name="user" />
                Sign in
              </Link>
            )}
          </div>
        </div>
        <nav
          className={`mobile-nav ${site.menu ? "open" : ""}`}
          aria-label="Mobile navigation"
        >
          {[
            ...links,
            ["Become a partner", "/partners"],
            ["Help & support", "/help"],
          ].map(([n, p]) => (
            <Link key={p} href={p} onClick={() => setSite({ menu: false })}>
              {n}
            </Link>
          ))}
          <button
            className="location-btn"
            onClick={showLocationPublic}
            type="button"
          >
            <Icon name="pin" />
            {s.siteSettings.city} · {s.siteSettings.area || "All areas"}
            <Icon name="down" />
          </button>
        </nav>
      </header>
    </>
  );
}

export function PublicFooter() {
  const { showCredits } = useApp();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="logo" href="/">
              <Brand />
            </Link>
            <p>
              Delicious food. Thoughtful savings.
              <br />A little less waste in your neighbourhood.
            </p>
            <div className="payment-marks" aria-label="Accepted payment methods">
              <img src="/assets/payments/bkash.svg" alt="bKash" width="92" height="30" />
              <img src="/assets/payments/nagad.svg" alt="Nagad" width="92" height="30" />
              <img src="/assets/payments/card.svg" alt="Debit and credit card" width="92" height="30" />
            </div>
          </div>
          <div>
            <h4>Discover</h4>
            <ul>
              <li>
                <Link href="/explore">Explore food</Link>
              </li>
              <li>
                <Link href="/shops">Our neighbourhood shops</Link>
              </li>
              <li>
                <Link href="/how-it-works">How it works</Link>
              </li>
              <li>
                <Link href="/journal">Good food journal</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Last5 Deal</h4>
            <ul>
              <li>
                <Link href="/about">Our story</Link>
              </li>
              <li>
                <Link href="/partners">Become a partner</Link>
              </li>
              <li>
                <Link href="/help">Help centre</Link>
              </li>
              <li>
                <Link href="/contact">Contact us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Your little corner</h4>
            <ul>
              <li>
                <Link href="/account/orders">My orders</Link>
              </li>
              <li>
                <Link href="/account/favourites">My favourites</Link>
              </li>
              <li>
                <Link href="/account/profile">My profile</Link>
              </li>
              <li>
                <Link href="/account/notifications">Notifications</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-line">
          <span>© 2026 Last5 Deal. Good food, another chance.</span>
          <div>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <p>
              Developed by :{" "}
              <a
                href="https://www.m4yours.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                M4YOURS IT
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Ant Design modal shells                                             */
/* ------------------------------------------------------------------ */
export function L5Modal({
  open,
  onClose,
  children,
  drawer = false,
  wide = false,
  kind = "public",
}) {
  if (drawer) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        placement="right"
        width={525}
        closable={false}
        getContainer={false}
        rootClassName="l5-drawer-root"
        className="l5-drawer"
        styles={{
          body: { padding: 0, display: "flex", flexDirection: "column" },
          mask: { background: "#20293442", backdropFilter: "blur(3px)" },
        }}
      >
        <div className="bag-drawer" style={{ height: "100%" }}>
          {children}
        </div>
      </Drawer>
    );
  }
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={wide ? 760 : 550}
      centered
      getContainer={false}
      className={`l5-modal ${kind === "account" ? "l5-modal-account" : ""}`}
      styles={{
        content: {
          padding: 0,
          borderRadius: kind === "account" ? 16 : 19,
          overflow: "hidden",
          background: "#fff",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
        mask: { background: "#16332270", backdropFilter: "blur(5px)" },
      }}
      destroyOnHidden
    >
      {children}
    </Modal>
  );
}

function ModalHead({ title, sub, onClose }) {
  return (
    <div className="modal-head">
      <div>
        <h2>{title}</h2>
        {sub ? <p>{sub}</p> : null}
      </div>
      <button
        className="icon-btn"
        onClick={onClose}
        aria-label="Close dialog"
        type="button"
      >
        <Icon name="close" />
      </button>
    </div>
  );
}

function BagItems() {
  const { s, food, changeCart } = useApp();
  return s.cart.map((l) => {
    const f = food(l.foodId);
    return (
      <div className="cart-item" key={f.id}>
        <img src={pic(f.image)} alt={f.name} />
        <div>
          <h3>
            <Link href={`/food/${f.id}`}>{f.name}</Link>
          </h3>
          <p>{f.description}</p>
          <div className="cart-actions">
            <div className="quantity">
              <button
                onClick={() => changeCart(f.id, l.qty - 1, "bag")}
                aria-label={`Decrease ${f.name} quantity`}
                type="button"
              >
                <Icon name="minus" />
              </button>
              <b>{l.qty}</b>
              <button
                onClick={() => changeCart(f.id, l.qty + 1, "bag")}
                aria-label={`Increase ${f.name} quantity`}
                disabled={l.qty >= f.stock}
                type="button"
              >
                <Icon name="plus" />
              </button>
            </div>
            <button
              className="remove"
              onClick={() => changeCart(f.id, 0, "bag")}
              type="button"
            >
              Remove
            </button>
          </div>
        </div>
        <strong>{money(f.sale * l.qty)}</strong>
      </div>
    );
  });
}

function PublicLocationModalWrapper() {
  const { s, closeModal, setS, toast } = useApp();
  const [city, setCity] = useState(s.siteSettings.city);
  const [area, setArea] = useState(s.siteSettings.area);
  const { LOCATIONS } = useApp();
  const areas = LOCATIONS.find((x) => x.city === city)?.areas || [];
  return (
    <L5Modal open onClose={closeModal}>
      <ModalHead title="Find good food near you." onClose={closeModal} />
      <div className="modal-body">
        <p>
          Choose a city and neighbourhood. You can browse before signing in.
        </p>
        <Field
          label="City"
          name="city"
          value={city}
          type="select"
          options={LOCATIONS.map((x) => x.city)}
          onChange={(e) => {
            setCity(e.target.value);
            setArea("");
          }}
        />
        <div className="small muted">Choose your neighbourhood</div>
        <div className="areas">
          {["All areas", ...areas].map((a) => (
            <button
              className={`area ${(a === "All areas" ? "" : a) === area ? "active" : ""}`}
              onClick={() => setArea(a === "All areas" ? "" : a)}
              type="button"
              key={a}
            >
              {a}
            </button>
          ))}
        </div>
        <button
          className="button full"
          type="button"
          onClick={() => {
            setS((prev) => ({ ...prev, siteSettings: { city, area } }));
            closeModal();
            toast(`Exploring ${area || city}.`);
          }}
        >
          Explore this area <Icon name="arrow" />
        </button>
      </div>
    </L5Modal>
  );
}

export function PublicModals() {
  const {
    modal,
    closeModal,
    s,
    food,
    shop,
    go,
    toast,
    replaceBag,
    finishPayment,
    setS,
  } = useApp();
  const { LOCATIONS } = useApp();
  if (!modal) return null;

  if (modal.type === "location-public") {
    return <PublicLocationModalWrapper />;
  }

  if (modal.type === "bag") {
    const t = { subtotal: 0, fee: 0, total: 0, ...{} };
    const subtotal = s.cart.reduce(
      (n, l) => n + food(l.foodId).sale * l.qty,
      0,
    );
    const fee = subtotal ? 2000 : 0;
    const sh = s.cart.length ? shop(food(s.cart[0].foodId).shopId) : null;
    return (
      <L5Modal open onClose={closeModal} drawer>
        <ModalHead title="Your good food bag." onClose={closeModal} />
        <div className="modal-body">
          {!s.cart.length ? (
            <Empty
              title="A little room for good food."
              text="Find your next favourite and add it to your bag."
            />
          ) : (
            <>
              <p>
                <Icon name="store" /> {sh.name} · {sh.area}
              </p>
              <div className="cart-items">
                <BagItems />
              </div>
              <div className="divider" />
              <div className="summary-line total">
                <span>Total</span>
                <strong>{money(subtotal + fee)}</strong>
              </div>
              <Link className="button full" href="/cart" onClick={closeModal}>
                Review bag & checkout <Icon name="arrow" />
              </Link>
              <p className="form-note" style={{ textAlign: "center" }}>
                One shop. One clear collection stop.
              </p>
            </>
          )}
        </div>
      </L5Modal>
    );
  }

  if (modal.type === "signin-required") {
    return (
      <L5Modal open onClose={closeModal}>
        <ModalHead title="Your next good bite is close." onClose={closeModal} />
        <div className="modal-body">
          <p>
            Create a free sample account or sign in to save favourites and add
            food to your bag.
          </p>
          <div className="button-row">
            <Link className="button" href="/sign-in" onClick={closeModal}>
              Sign in
            </Link>
            <Link className="button light" href="/sign-up" onClick={closeModal}>
              Create account
            </Link>
          </div>
          <div style={{ marginTop: 23 }}>
            <button
              className="button light small"
              onClick={closeModal}
              type="button"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </L5Modal>
    );
  }

  if (modal.type === "different-shop") {
    const current = shop(food(s.cart[0].foodId).shopId);
    const next = shop(food(modal.id).shopId);
    return (
      <L5Modal open onClose={closeModal}>
        <ModalHead
          title="One shop, one collection stop."
          onClose={closeModal}
        />
        <div className="modal-body">
          <p>
            Your bag already has food from <strong>{current.name}</strong>. Keep
            it, or start a new bag with <strong>{next.name}</strong>.
          </p>
          <div className="button-row">
            <button className="button light" onClick={closeModal} type="button">
              Keep my current bag
            </button>
            <button
              className="button"
              onClick={() => replaceBag(modal.id, modal.qty)}
              type="button"
            >
              Start a new bag
            </button>
          </div>
        </div>
      </L5Modal>
    );
  }

  if (modal.type === "gateway") {
    const o = s.orders.find((x) => x.id === modal.id);
    if (!o) return null;
    return (
      <L5Modal open onClose={closeModal}>
        <ModalHead title="Preview online payment" onClose={closeModal} />
        <div className="modal-body">
          <div
            className="eyebrow"
            style={{ justifyContent: "center", marginBottom: 20 }}
          >
            LAST5 DEAL × SAMPLE GATEWAY
          </div>
          <div className="gateway-amount">
            <p className="small muted">
              {o.shopName} · {o.channel}
            </p>
            <strong>{money(o.subtotal + o.fee)}</strong>
            <p className="tiny muted">{o.id}</p>
          </div>
          <Info amber>
            Choose a sample result. No credentials are requested and you will
            not be charged.
          </Info>
          <div className="gateway-results">
            {[
              [
                "success",
                "check",
                "Successful payment",
                "Payment verified; order awaits the shop.",
              ],
              [
                "pending",
                "clock",
                "Payment pending",
                "Keep the outcome uncertain and check before retrying.",
              ],
              [
                "failed",
                "info",
                "Payment failed",
                "Release the sample reservation and allow another attempt.",
              ],
            ].map(([v, i, h, p]) => (
              <button
                key={v}
                onClick={() => finishPayment(o.id, v, { confirmation: true })}
                type="button"
              >
                <Icon name={i} />
                <span>
                  <strong>{h}</strong>
                  <small>{p}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </L5Modal>
    );
  }

  if (modal.type === "credits") {
    return (
      <L5Modal open onClose={closeModal}>
        <ModalHead title="A little credit for the food." onClose={closeModal} />
        <div className="modal-body">
          <p>
            Food photography is sourced from Unsplash and is used illustratively
            in this fictional marketplace. Photos do not represent real offers
            from the sample shops.
          </p>
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Explore Unsplash <Icon name="arrow" />
          </a>
        </div>
      </L5Modal>
    );
  }

  return null;
}
