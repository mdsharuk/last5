'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { L5Modal } from '@/components/PublicChrome';
import { AccountField, Badge, AccountEmpty, Btn } from '@/components/account/AccountUI';
import { accountMoney, clock, date, pic, uid } from '@/lib/format';
import {
  LOCATIONS, TODAY, foodAvailable, cartTotals, startCheckout, cancelOrder, addToCart,
  setPreferred, removeLocation, canShowPass, canCancel, owns,
} from '@/lib/model';
import { downloadFile, exportPaymentsCsv } from '@/lib/download';

const clone = (v) => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

function Head({ title, sub, onClose }) {
  return (
    <div className="modal-head">
      <div>
        <h2>{title}</h2>
        {sub ? <p>{sub}</p> : null}
      </div>
      <button className="icon-btn" onClick={onClose} aria-label="Close dialog" type="button"><Icon name="close" /></button>
    </div>
  );
}

function Foot({ children }) {
  return <div className="modal-footer">{children}</div>;
}

/* ------------------------------------------------------------------ */

function SigninRequired() {
  const { closeModal } = useApp();
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="One step closer to good food." sub="Create an account or sign in to continue." onClose={closeModal} />
      <div className="modal-body">
        <p className="muted small">You can keep browsing food without an account. Sign in when you are ready to save favourites or place an order.</p>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Keep browsing</Btn>
        <Link className="btn primary" href="/account/auth" onClick={closeModal}><Icon name="users" className="sm" />Sign in</Link>
      </Foot>
    </L5Modal>
  );
}

function FoodModal({ id }) {
  const { s, shop, food, closeModal, accountFavourite, accountAdd } = useApp();
  const f = food(id);
  const [qty, setQty] = useState(1);
  if (!f) return null;
  const sh = shop(f.shopId);
  const saved = s.favourites.includes(id);
  const available = foodAvailable(f);
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title={f.name} sub={`${sh.name} · ${sh.area}`} onClose={closeModal} />
      <div className="modal-body">
        <img className="food-detail-img" src={pic(f.image)} alt={f.name} />
        <div className="food-detail-head">
          <div>
            <h3>{f.name}</h3>
            <p className="muted tiny" style={{ marginTop: 5 }}>{f.category} · {['F5', 'F8'].includes(f.id) ? 'Disclosed box' : 'Single item'}</p>
          </div>
          <div className="price">{accountMoney(f.sale)}<del>{accountMoney(f.original)}</del></div>
        </div>
        <p className="food-description">{f.description}</p>
        <div className="allergen-note"><strong>Allergen information</strong><br />{f.allergens}</div>
        <div className="food-detail-meta">
          <div><Icon name="clock" /><span>{date(f.date)} · {clock(f.start, true)} – {clock(f.end, true)}</span></div>
          <div><Icon name="bag" /><span>{f.stock} portions currently available</span></div>
        </div>
        <div className="checkout-shop">
          <h3>{sh.name}</h3>
          <p>{sh.address}</p>
          <p>{sh.instructions}</p>
        </div>
        <div className="field">
          <label htmlFor="food-quantity">How many portions?</label>
          <input id="food-quantity" type="number" min="1" step="1" max={f.stock} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(f.stock, Number(e.target.value) || 1)))} disabled={!available} />
        </div>
      </div>
      <Foot>
        <Btn icon="heart" onClick={() => accountFavourite(id)}>{saved ? 'Saved to favourites' : 'Save for later'}</Btn>
        <Btn className="primary" icon="plus" disabled={!available} onClick={() => accountAdd(id, qty)}>
          {available ? `Add to cart · ${accountMoney(f.sale)}` : 'Unavailable'}
        </Btn>
      </Foot>
    </L5Modal>
  );
}

function CartDrawer() {
  const { s, shop, food, closeModal, changeCart, goAccount, setModal } = useApp();
  const total = cartTotals(s);
  const sh = s.cart.length ? shop(food(s.cart[0].foodId).shopId) : null;
  return (
    <L5Modal open onClose={closeModal} drawer kind="account">
      <Head title="Your good food bag" sub={sh ? `${sh.name} · ${sh.area}` : 'Something delicious could go here.'} onClose={closeModal} />
      <div className="modal-body">
        {s.cart.length ? (
          <>
            {s.cart.map((l) => {
              const f = food(l.foodId);
              return (
                <div className="cart-line" key={f.id}>
                  <img src={pic(f.image)} alt="" />
                  <div>
                    <h3>{f.name}</h3>
                    <p>{accountMoney(f.sale)} each</p>
                    <div className="quantity-control" style={{ marginTop: 9 }}>
                      <button onClick={() => changeCart(f.id, l.qty - 1, true)} aria-label={`Decrease ${f.name} quantity`} type="button">−</button>
                      <strong>{l.qty}</strong>
                      <button onClick={() => changeCart(f.id, l.qty + 1, true)} aria-label={`Increase ${f.name} quantity`} type="button">+</button>
                    </div>
                  </div>
                  <div className="line-end">
                    <strong>{accountMoney(f.sale * l.qty)}</strong>
                    <button className="row-btn" onClick={() => changeCart(f.id, 0, true)} type="button">Remove</button>
                  </div>
                </div>
              );
            })}
            <div className="checkout-shop">
              <h3>Collection from {sh.name}</h3>
              <p>{sh.address}</p>
              <p>Today · 6 PM – 9 PM</p>
            </div>
            <div className="summary-list">
              <div><span>Food subtotal</span><strong>{accountMoney(total.subtotal, true)}</strong></div>
              <div><span>Customer service fee</span><strong>{accountMoney(total.fee, true)}</strong></div>
              <div className="total"><span>Total</span><strong>{accountMoney(total.total, true)}</strong></div>
            </div>
            <div className="notice" style={{ marginTop: 20, marginBottom: 0 }}>
              <Icon name="info" className="sm" />Adding food to a cart does not reserve it. We check the current stock and total again at checkout.
            </div>
          </>
        ) : (
          <AccountEmpty title="Your food bag is empty" text="Find something delicious to add to your collection." action={null} />
        )}
      </div>
      <Foot>
        <Btn onClick={() => goAccount('explore')}>Keep exploring</Btn>
        {s.cart.length ? <Btn className="primary" icon="arrow" onClick={() => setModal({ type: 'checkout' })}>Review checkout</Btn> : null}
      </Foot>
    </L5Modal>
  );
}

function CheckoutModal() {
  const { s, site, setSite, setS, shop, food, closeModal, setModal, goAccount, toast } = useApp();
  const sh = shop(food(s.cart[0].foodId).shopId);
  const totals = cartTotals(s);
  const [method, setMethod] = useState('Card');
  if (!s.cart.length) return <CartDrawer />;
  const submit = (e) => {
    e.preventDefault();
    try {
      const next = clone(s);
      const key = site.checkoutKey || `checkout-${Date.now()}`;
      const o = startCheckout(next, key);
      o.channel = 'SSLCOMMERZ · ' + method;
      setS(next);
      setSite({ checkoutKey: key });
      setModal({ type: 'gateway', id: o.id });
    } catch (err) {
      toast(err.message, true);
    }
  };
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="Review your collection" sub="Confirm the food, shop, time and full total." onClose={closeModal} />
      <div className="modal-body">
        <form id="checkout-form" onSubmit={submit}>
          <div className="detail-grid">
            <div><p>Collection name</p><strong>{s.profile.name}</strong></div>
            <div><p>Contact</p><strong>{s.profile.phone}</strong></div>
          </div>
          <div className="checkout-shop">
            <h3>{sh.name}</h3>
            <p>{sh.address}</p>
            <p><strong>{date(TODAY)} · 6 PM – 9 PM</strong></p>
            <p>{sh.instructions}</p>
          </div>
          {s.cart.map((l) => {
            const f = food(l.foodId);
            return (
              <div className="cart-line" key={f.id}>
                <img src={pic(f.image)} alt="" />
                <div>
                  <h3>{f.name}</h3>
                  <p>{l.qty} × {accountMoney(f.sale)}</p>
                  <p className="tiny">{f.allergens}</p>
                </div>
                <strong style={{ marginLeft: 'auto' }}>{accountMoney(f.sale * l.qty)}</strong>
              </div>
            );
          })}
          <div className="summary-list" style={{ margin: '20px 0' }}>
            <div><span>Food subtotal</span><strong>{accountMoney(totals.subtotal, true)}</strong></div>
            <div><span>Customer service fee</span><strong>{accountMoney(totals.fee, true)}</strong></div>
            <div className="total"><span>Total payable</span><strong>{accountMoney(totals.total, true)}</strong></div>
          </div>
          <div className="field full">
            <label htmlFor="checkout-method">Preferred online payment method</label>
            <select id="checkout-method" value={method} onChange={(e) => setMethod(e.target.value)}>
              {['Card', 'bKash', 'Nagad'].map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <label className="checkbox-label" style={{ margin: '18px 0 0' }}>
            <input type="checkbox" required />I have checked the shop, collection window and allergen information.
          </label>
          <div className="demo-code" style={{ textAlign: 'left' }}>Demonstration checkout. No real payment is initiated or collected.</div>
        </form>
      </div>
      <Foot>
        <Btn onClick={() => setModal({ type: 'cart' })}>Back to cart</Btn>
        <button type="submit" form="checkout-form" className="btn primary"><Icon name="lock" className="sm" /> Continue to demo payment</button>
      </Foot>
    </L5Modal>
  );
}

function GatewayModal({ id }) {
  const { s, closeModal, finishPayment } = useApp();
  const o = s.orders.find((x) => x.id === id);
  if (!o) return null;
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="Online payment preview" sub={`${o.id} · ${accountMoney(o.subtotal + o.fee, true)}`} onClose={closeModal} />
      <div className="modal-body">
        <div className="gateway-demo">
          <div className="empty-icon"><Icon name="shield" className="lg" /></div>
          <h3>SSLCOMMERZ flow preview</h3>
          <p>The connected product redirects to its approved payment flow. This UI demonstrates the outcomes using sample data only.</p>
          <div className="gateway-methods"><span>Card</span><span>bKash</span><span>Nagad</span></div>
          <p><strong>{accountMoney(o.subtotal + o.fee, true)}</strong> · {o.shopName}</p>
          <div className="filter-group">
            <Btn className="green" icon="check" onClick={() => finishPayment(id, 'success')}>Verified success</Btn>
            <Btn className="danger" icon="close" onClick={() => finishPayment(id, 'failed')}>Known failure</Btn>
            <Btn icon="clock" onClick={() => finishPayment(id, 'pending')}>Still checking</Btn>
          </div>
        </div>
        <p className="preview-notice">These buttons simulate gateway verification for review. They do not send money or store payment credentials.</p>
      </div>
      <Foot><Btn onClick={closeModal}>Close</Btn></Foot>
    </L5Modal>
  );
}

function PaymentResult({ id }) {
  const { s, closeModal, showOrder } = useApp();
  const o = s.orders.find((x) => x.id === id);
  if (!o) return null;
  const success = o.payment === 'Paid';
  const pending = o.payment === 'Pending';
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title={success ? 'Payment verified' : pending ? 'We’re checking your payment' : 'Payment was not completed'} sub={o.id} onClose={closeModal} />
      <div className="modal-body">
        <div className="success-state">
          <div className="success-mark"><Icon name={success ? 'check' : pending ? 'clock' : 'info'} className="lg" /></div>
          <h2>{success ? 'Your food find is on its way.' : pending ? 'Keep this order reference.' : 'You can try again after reviewing your cart.'}</h2>
          <p>{success ? 'Your sample payment is verified. The order is awaiting the shop’s acceptance.' : pending ? 'The existing payment attempt is unresolved. Do not create another payment until its result is known.' : 'No verified charge is recorded for this failed demo attempt. Its stock reservation has been released.'}</p>
          <div className="receipt"><strong>{o.id}</strong><br />{o.shopName}<br />{accountMoney(o.subtotal + o.fee, true)} · Payment {o.payment}</div>
        </div>
      </div>
      <Foot><Btn className="primary" icon="arrow" onClick={() => showOrder(o.id)}>View order</Btn></Foot>
    </L5Modal>
  );
}

function OrderDrawer({ id }) {
  const { s, closeModal, showPass, showCaseForm, showCancel, showReceipt, setModal } = useApp();
  const o = s.orders.find((x) => x.id === id);
  if (!o) return null;
  return (
    <L5Modal open onClose={closeModal} drawer kind="account">
      <Head title={o.id} sub={`${o.shopName} · ${date(o.date)}`} onClose={closeModal} />
      <div className="modal-body">
        <div className="order-status-row">
          <Badge value={o.state} /><Badge value={o.payment} />{o.refund !== 'None' ? <Badge value={`Refund ${o.refund}`} /> : null}
        </div>
        {o.items.map((l) => (
          <div className="order-food" key={l.foodId}>
            <img src={pic(l.image)} alt={l.name} />
            <div><h3>{l.name}</h3><p>{l.qty} × {accountMoney(l.unit)}</p></div>
            <strong>{accountMoney(l.qty * l.unit)}</strong>
          </div>
        ))}
        <div className="detail-grid">
          <div><p>Collection name</p><strong>{o.customerName}</strong></div>
          <div><p>Collection window</p><strong>{date(o.date)} · {clock(o.start, true)} – {clock(o.end, true)}</strong></div>
          <div style={{ gridColumn: '1/-1' }}><p>Shop address</p><strong>{o.address}</strong></div>
        </div>
        <div className="checkout-shop"><p>{o.instructions}</p></div>
        <h3 style={{ fontSize: 12, marginBottom: 15 }}>Payment details</h3>
        <div className="summary-list">
          <div><span>Food subtotal</span><strong>{accountMoney(o.subtotal, true)}</strong></div>
          <div><span>Customer service fee</span><strong>{accountMoney(o.fee, true)}</strong></div>
          <div className="total"><span>Total {o.payment === 'Paid' ? 'paid' : 'payable'}</span><strong>{accountMoney(o.subtotal + o.fee, true)}</strong></div>
          <div><span>Payment status</span><Badge value={o.payment} /></div>
          <div><span>Payment reference</span><strong>{o.transaction}</strong></div>
          {o.refund !== 'None' ? (
            <>
              <div><span>Refund status</span><Badge value={o.refund} /></div>
              <div><span>{o.refund === 'Completed' ? 'Confirmed refund' : 'Refund requested'}</span><strong>{accountMoney(o.refund === 'Completed' ? o.refundAmount : o.requestedRefund, true)}</strong></div>
            </>
          ) : null}
        </div>
        {o.uncertain ? <div className="notice" style={{ marginTop: 17 }}><Icon name="clock" className="sm" />We are checking this payment. Review the existing attempt before paying again.</div> : null}
        {o.reason ? <div className="notice" style={{ marginTop: 17 }}><Icon name="info" className="sm" />{o.reason}</div> : null}
        <h3 className="divided" style={{ fontSize: 12 }}>Order timeline</h3>
        <ol className="timeline">{o.events.map((x) => <li key={x}>{x}</li>)}</ol>
        {canShowPass(s, o) ? (
          <div className="collection-small"><Icon name="scan" className="sm" />Your pass is ready. Show it at the correct shop within the collection window.</div>
        ) : (
          <div className="past-code">{o.state === 'Collected' ? 'Collection verified. This pass has been used.' : 'A collection pass is available only for a paid eligible Ready order.'}</div>
        )}
        <div className="filter-group divided">
          <Btn className="link" icon="support" onClick={() => showCaseForm(id, 'Order')}>Get help</Btn>
          {canCancel(o) ? <Btn className="link" icon="close" onClick={() => showCancel(id)}>Cancel order</Btn> : null}
          {o.payment === 'Paid' ? <Btn className="link" icon="file" onClick={() => showReceipt(id)}>View receipt</Btn> : null}
        </div>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Close</Btn>
        {canShowPass(s, o)
          ? <Btn className="green" icon="scan" onClick={() => showPass(id)}>Show collection pass</Btn>
          : o.payment === 'Pending'
            ? <Btn className="primary" icon="wallet" onClick={() => setModal({ type: 'gateway', id })}>Review demo payment</Btn>
            : null}
      </Foot>
    </L5Modal>
  );
}

function PassDrawer({ id }) {
  const { s, closeModal, showOrder, toast } = useApp();
  const o = s.orders.find((x) => x.id === id);
  if (!o) return null;
  const qty = o.items.reduce((n, l) => n + l.qty, 0);
  return (
    <L5Modal open onClose={closeModal} drawer kind="account">
      <Head title="Your collection pass" sub={o.id} onClose={closeModal} />
      <div className="modal-body">
        <div className="code-pass">
          <Badge value="Ready" />
          <div className="pass-shop">{o.shopName}</div>
          <h3>{o.items[0].name}</h3>
          <p className="muted tiny">{qty} {qty === 1 ? 'portion' : 'portions'} · {date(o.date)}</p>
          <img className="qr" src="/assets/collection-4812.svg" alt={`Sample QR collection code for order ${o.id}`} />
          <p className="muted tiny">YOUR COLLECTION CODE</p>
          <div className="copy-row">
            <div className="pass-code">{o.code}</div>
            <button
              className="icon-btn"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(o.code);
                  toast('Collection code copied. Keep it private.');
                } catch {
                  toast('Copy is unavailable. Show the code displayed on this pass.', true);
                }
              }}
              aria-label="Copy collection code"
              type="button"
            ><Icon name="copy" className="sm" /></button>
          </div>
          <div className="pass-instructions">
            <strong>{date(o.date)} · {clock(o.start, true)} – {clock(o.end, true)}</strong>{o.address}<br />{o.instructions}
          </div>
          <p className="pass-info">Show this private pass to the shop. Only the merchant can verify collection. Opening this pass does not complete the order.</p>
          <div className="demo-code">Sample code and QR for interface review.</div>
        </div>
      </div>
      <Foot>
        <Btn icon="file" onClick={() => showOrder(o.id)}>Order details</Btn>
        <Btn className="primary" icon="check" onClick={closeModal}>Done</Btn>
      </Foot>
    </L5Modal>
  );
}

function LocationModal({ id }) {
  const { s, closeModal, setS, goAccount, toast } = useApp();
  const l = s.locations.find((x) => x.id === id);
  const [city, setCity] = useState(l?.city || 'Dhaka');
  const [area, setArea] = useState(l?.area || LOCATIONS[0].areas[0]);
  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const valid = LOCATIONS.find((x) => x.city === data.city);
      if (!valid?.areas.includes(data.area)) throw Error('Choose an area that belongs to the selected city.');
      if (!String(data.label).trim()) throw Error('Enter a short location label.');
      const next = clone(s);
      let loc = next.locations.find((x) => x.id === id);
      if (loc?.preferred && !data.preferred) throw Error('Choose another saved area as preferred before removing this default.');
      if (loc) Object.assign(loc, { label: String(data.label).trim(), city: data.city, area: data.area });
      else {
        loc = { id: 'LOC-' + Date.now(), label: String(data.label).trim(), city: data.city, area: data.area, preferred: false };
        next.locations.push(loc);
      }
      if (data.preferred || !next.locations.some((x) => x.preferred)) setPreferred(next, loc.id);
      setS(next);
      closeModal();
      goAccount('locations');
      toast('Saved area updated.');
    } catch (err) {
      toast(err.message, true);
    }
  };
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title={l ? 'Edit saved area' : 'Save an area'} sub="Choose a place for food discovery and collection." onClose={closeModal} />
      <div className="modal-body">
        <form id="location-form" onSubmit={submit}>
          <div className="form-grid">
            <AccountField label="Location label" name="label" value={l?.label || ''} attrs={{ required: true, maxLength: 40 }} full />
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
            <div className="field full">
              <label className="checkbox-label">
                <input type="checkbox" name="preferred" defaultChecked={l?.preferred || !s.locations.length} />Use as my preferred discovery and offer-alert area
              </label>
            </div>
          </div>
        </form>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Cancel</Btn>
        <button className="btn primary" type="submit" form="location-form">Save area</button>
      </Foot>
    </L5Modal>
  );
}

function ChooseAreaModal() {
  const { s, closeModal, setS, goAccount, toast } = useApp();
  const [area, setArea] = useState(s.selectedArea);
  const submit = (e) => {
    e.preventDefault();
    if (!LOCATIONS.some((x) => x.areas.includes(area))) return toast('Choose an available area.', true);
    const next = clone(s);
    next.selectedArea = area;
    setS(next);
    closeModal();
    goAccount('explore');
  };
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="Where shall we find food?" sub="Choose a collection area. Your existing orders keep their original shop." onClose={closeModal} />
      <div className="modal-body">
        <form id="browse-area-form" onSubmit={submit}>
          <div className="field full">
            <label htmlFor="browse-area">Discovery area</label>
            <select id="browse-area" value={area} onChange={(e) => setArea(e.target.value)} required>
              {LOCATIONS.flatMap((x) => x.areas).map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
        </form>
        <p className="preview-notice">Food availability depends on the shops and offers in each area.</p>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Cancel</Btn>
        <button className="btn primary" type="submit" form="browse-area-form">Explore this area</button>
      </Foot>
    </L5Modal>
  );
}

function NewCaseModal({ orderId, caseType }) {
  const { s, closeModal, updateS, goAccount, toast } = useApp();
  const orders = s.orders.filter((o) => o.customerId === s.profile.id);
  const [type, setType] = useState(caseType || 'Order');
  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (!String(data.subject).trim() || !String(data.message).trim()) throw Error('Enter a subject and useful details.');
      if (data.orderId && !orders.some((x) => x.id === data.orderId)) throw Error('Choose an order from your account.');
      updateS((next) => {
        next.cases.unshift({
          id: 'SUP-' + Date.now().toString().slice(-6),
          type,
          subject: String(data.subject).trim(),
          orderId: data.orderId,
          state: 'Open',
          date: TODAY,
          messages: [{ by: 'You', text: String(data.message).trim() }],
        });
      });
      closeModal();
      goAccount('support');
      toast('Support case created in your sample account.');
    } catch (err) {
      toast(err.message, true);
    }
  };
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="How can we help?" sub="Include an order reference and useful details. Keep secrets private." onClose={closeModal} />
      <div className="modal-body">
        <form id="case-form" onSubmit={submit}>
          <div className="form-grid">
            <label className="field">
              <span>Issue type</span>
              <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
                {['Order', 'Collection', 'Payment', 'Refund', 'Account', 'Privacy', 'Other'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Related order</span>
              <select name="orderId" defaultValue={orderId || ''}>
                <option value="">No related order</option>
                {orders.map((o) => <option key={o.id} value={o.id}>{o.id}</option>)}
              </select>
            </label>
            <AccountField label="Subject" name="subject" attrs={{ required: true, maxLength: 150 }} full />
            <AccountField label="What happened?" name="message" type="textarea" attrs={{ required: true, maxLength: 2000 }} full />
          </div>
        </form>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Cancel</Btn>
        <button className="btn primary" type="submit" form="case-form">Create support case</button>
      </Foot>
    </L5Modal>
  );
}

function CaseModal({ id }) {
  const { s, closeModal, updateS, toast } = useApp();
  const c = s.cases.find((x) => x.id === id);
  if (!c) return null;
  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!String(data.message).trim()) return toast('Add a message before saving.', true);
    updateS((next) => {
      next.cases.find((x) => x.id === id).messages.push({ by: 'You', text: String(data.message).trim() });
    });
    toast('Your message was added to the sample case.');
  };
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title={c.subject} sub={`${c.id} · ${c.type}`} onClose={closeModal} />
      <div className="modal-body">
        <Badge value={c.state} />
        {c.orderId ? <p className="muted tiny" style={{ marginTop: 12 }}>Order {c.orderId}</p> : null}
        {c.messages.map((m, i) => (
          <div className={`message ${m.by === 'You' ? 'you' : ''}`} key={i}><small>{m.by}</small>{m.text}</div>
        ))}
        <form id="reply-form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="reply-message">Add information</label>
            <textarea id="reply-message" name="message" required maxLength={2000} placeholder="Add details to this case..." />
          </div>
        </form>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Close</Btn>
        <button className="btn primary" type="submit" form="reply-form">Add information</button>
      </Foot>
    </L5Modal>
  );
}

function CancelModal({ id }) {
  const { s, closeModal, setS, setSite, goAccount, toast } = useApp();
  const o = s.orders.find((x) => x.id === id);
  if (!o) return null;
  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const next = clone(s);
      cancelOrder(next, id, data.reason);
      setS(next);
      closeModal();
      setSite({ filtersAccount: { orders: 'Cancelled' } });
      goAccount('orders');
      toast('Order cancelled. Any paid refund is pending review.');
    } catch (err) {
      toast(err.message, true);
    }
  };
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="Cancel this order?" sub="Cancellation follows the working demo policy." onClose={closeModal} />
      <div className="modal-body">
        <form id="cancel-form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="cancel-reason">Cancellation reason</label>
            <select id="cancel-reason" name="reason" required>
              {['My plans changed', 'I selected the wrong food', 'I cannot collect in time', 'Other'].map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </form>
        <div className="notice" style={{ marginTop: 18 }}>
          <Icon name="info" className="sm" />
          {o.payment === 'Paid' ? 'This paid order will enter refund review. A pending refund is not a completed refund.' : 'The unpaid checkout reservation will be released after its payment outcome is known.'}
        </div>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Keep order</Btn>
        <button className="btn danger" type="submit" form="cancel-form">Confirm cancellation</button>
      </Foot>
    </L5Modal>
  );
}

function ReceiptModal({ id }) {
  const { s, closeModal, toast } = useApp();
  const o = s.orders.find((x) => x.id === id);
  if (!o) return null;
  const download = () => {
    if (!owns(s, o) || o.payment !== 'Paid') return toast('Purchase summary unavailable.', true);
    const lines = [
      'LAST5 DEAL · SAMPLE PURCHASE SUMMARY', o.id, o.customerName, o.shopName, o.address,
      'Collection: ' + o.date + ' ' + o.start + '–' + o.end,
      ...o.items.map((l) => l.qty + ' × ' + l.name + ' · ' + accountMoney(l.unit * l.qty)),
      'Food subtotal: ' + accountMoney(o.subtotal, true),
      'Customer service fee: ' + accountMoney(o.fee, true),
      'Total paid: ' + accountMoney(o.subtotal + o.fee, true),
      'Payment: ' + o.payment,
      'Refund: ' + o.refund,
      'Confirmed refund: ' + accountMoney(o.refundAmount, true),
      'Fictional data for interface review.',
    ];
    downloadFile('Last5_Purchase_' + o.id + '.txt', lines.join('\n'), 'text/plain;charset=utf-8');
    toast('Your download is ready.');
  };
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="Purchase summary" sub={o.id} onClose={closeModal} />
      <div className="modal-body">
        <div className="notice"><Icon name="file" className="sm" />Sample purchase record for interface review.</div>
        <h3>{o.shopName}</h3>
        <p className="muted small" style={{ margin: '8px 0 18px' }}>{o.address}<br />{date(o.date)} · {o.customerName}</p>
        <div className="summary-list">
          {o.items.map((l) => (
            <div key={l.foodId}><span>{l.qty} × {l.name}</span><strong>{accountMoney(l.qty * l.unit, true)}</strong></div>
          ))}
          <div><span>Food subtotal</span><strong>{accountMoney(o.subtotal, true)}</strong></div>
          <div><span>Customer service fee</span><strong>{accountMoney(o.fee, true)}</strong></div>
          <div className="total"><span>Total paid</span><strong>{accountMoney(o.subtotal + o.fee, true)}</strong></div>
          {o.refund === 'Completed' ? <div><span>Completed refund</span><strong>{accountMoney(o.refundAmount, true)}</strong></div> : null}
          <div><span>Payment</span><Badge value={o.payment} /></div>
        </div>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Close</Btn>
        <Btn className="primary" icon="download" onClick={download}>Download summary</Btn>
      </Foot>
    </L5Modal>
  );
}

function RecoveryModal() {
  const { s, closeModal, setModal } = useApp();
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="Account recovery preview" sub="No recovery message is sent in this sample UI." onClose={closeModal} />
      <div className="modal-body">
        <form id="recovery-form" onSubmit={(e) => { e.preventDefault(); setModal({ type: 'recovery-result' }); }}>
          <div className="field full">
            <label htmlFor="recovery-email">Account email</label>
            <input id="recovery-email" name="email" type="email" defaultValue={s.profile.email} required maxLength={254} />
          </div>
        </form>
        <p className="preview-notice">The connected product uses an expiring, single-use recovery link. Enter only sample information in this preview.</p>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Cancel</Btn>
        <button className="btn primary" type="submit" form="recovery-form">Preview recovery request</button>
      </Foot>
    </L5Modal>
  );
}

function RecoveryResult() {
  const { closeModal } = useApp();
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="Recovery confirmation preview" sub="No email has been sent." onClose={closeModal} />
      <div className="modal-body">
        <div className="success-state">
          <div className="success-mark"><Icon name="mail" className="lg" /></div>
          <h2>Check your inbox.</h2>
          <p>This is the confirmation screen. In the connected product, an eligible account would receive an expiring recovery link. The response does not reveal whether an account exists.</p>
        </div>
      </div>
      <Foot><Btn className="primary" icon="check" onClick={closeModal}>Done</Btn></Foot>
    </L5Modal>
  );
}

function ClosureModal() {
  const { s, closeModal, updateS, toast } = useApp();
  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (!String(data.reason).trim()) throw Error('Enter a reason for the review.');
      if (s.requests.some((x) => x.type === 'Account closure' && x.state === 'Pending review')) throw Error('An account closure review is already pending.');
      updateS((next) => {
        next.requests.push({ type: 'Account closure', state: 'Pending review', reason: String(data.reason).trim(), date: TODAY });
      });
      closeModal();
      toast('Your sample account closure request is pending review.');
    } catch (err) {
      toast(err.message, true);
    }
  };
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="Request an account review" sub="This request does not immediately erase your records." onClose={closeModal} />
      <div className="modal-body">
        <form id="closure-form" onSubmit={submit}>
          <div className="field full">
            <label htmlFor="closure-reason">Reason for account closure request</label>
            <textarea id="closure-reason" name="reason" required maxLength={1000} />
          </div>
        </form>
        <div className="notice" style={{ marginTop: 18 }}><Icon name="info" className="sm" />Active orders, refunds and required transaction records need review before closure is completed.</div>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Keep account</Btn>
        <button className="btn danger" type="submit" form="closure-form">Submit review request</button>
      </Foot>
    </L5Modal>
  );
}

function ResetModal() {
  const { closeModal, resetAccount } = useApp();
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="Restore the sample customer account?" sub="This resets only local fictional demo changes." onClose={closeModal} />
      <div className="modal-body">
        <p className="muted small">Your local sample orders, cart, profile edits, favourites and support cases will be replaced with the original demonstration data.</p>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Keep my changes</Btn>
        <Btn className="danger" icon="refresh" onClick={resetAccount}>Restore sample data</Btn>
      </Foot>
    </L5Modal>
  );
}

function RemoveLocationModal({ id }) {
  const { s, closeModal, setS, toast } = useApp();
  const l = s.locations.find((x) => x.id === id);
  if (!l) return null;
  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const next = clone(s);
      removeLocation(next, id, data.replacement);
      setS(next);
      closeModal();
      toast('Saved area removed.');
    } catch (err) {
      toast(err.message, true);
    }
  };
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="Remove this saved area?" sub={`${l.label} · ${l.area}`} onClose={closeModal} />
      <div className="modal-body">
        <form id="remove-location-form" onSubmit={submit}>
          {l.preferred && s.locations.length > 1 ? (
            <div className="field full">
              <label htmlFor="replacement">New preferred area</label>
              <select id="replacement" name="replacement" required defaultValue={s.locations.find((x) => x.id !== id).id}>
                {s.locations.filter((x) => x.id !== id).map((x) => <option value={x.id} key={x.id}>{x.label} · {x.area}</option>)}
              </select>
            </div>
          ) : <p className="muted small">Your existing orders keep their original shop address and collection time.</p>}
        </form>
      </div>
      <Foot>
        <Btn onClick={closeModal}>Keep area</Btn>
        <button className="btn danger" type="submit" form="remove-location-form">Remove area</button>
      </Foot>
    </L5Modal>
  );
}

function ReplaceCartModal({ id, qty }) {
  const { closeModal, s, setS, toast, setModal } = useApp();
  const replace = () => {
    const next = clone(s);
    try {
      addToCart(next, id, qty, true);
      setS(next);
      setModal({ type: 'cart' });
    } catch (err) {
      toast(err.message, true);
    }
  };
  return (
    <L5Modal open onClose={closeModal} kind="account">
      <Head title="A different shop in your bag." sub="One shop per order keeps collection simple." onClose={closeModal} />
      <div className="modal-body">
        <p className="muted small">Your current bag contains food from another shop. Keep it and finish that order, or replace it with this food.</p>
      </div>
      <Foot>
        <Btn onClick={() => setModal({ type: 'cart' })}>Keep current cart</Btn>
        <Btn className="primary" icon="bag" onClick={replace}>Replace cart</Btn>
      </Foot>
    </L5Modal>
  );
}

/* ------------------------------------------------------------------ */

export default function AccountModals() {
  const { modal } = useApp();
  if (!modal) return null;
  switch (modal.type) {
    case 'signin-required': return <SigninRequired />;
    case 'food': return <FoodModal id={modal.id} />;
    case 'cart': return <CartDrawer />;
    case 'checkout': return <CheckoutModal />;
    case 'gateway': return <GatewayModal id={modal.id} />;
    case 'payment-result': return <PaymentResult id={modal.id} />;
    case 'order': return <OrderDrawer id={modal.id} />;
    case 'pass': return <PassDrawer id={modal.id} />;
    case 'location': return <LocationModal id={modal.id} />;
    case 'choose-area': return <ChooseAreaModal />;
    case 'new-case': return <NewCaseModal orderId={modal.orderId} caseType={modal.caseType} />;
    case 'case': return <CaseModal id={modal.id} />;
    case 'cancel': return <CancelModal id={modal.id} />;
    case 'receipt': return <ReceiptModal id={modal.id} />;
    case 'recovery': return <RecoveryModal />;
    case 'recovery-result': return <RecoveryResult />;
    case 'closure': return <ClosureModal />;
    case 'reset': return <ResetModal />;
    case 'remove-location': return <RemoveLocationModal id={modal.id} />;
    case 'replace-cart': return <ReplaceCartModal id={modal.id} qty={modal.qty} />;
    default: return null;
  }
}
