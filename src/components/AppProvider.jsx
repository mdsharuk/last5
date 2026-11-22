'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  seed, TODAY, LOCATIONS, SHOPS,
  addToCart, updateCart, startCheckout, resolvePayment, cancelOrder,
  setPreferred, removeLocation, saveProfile, foodAvailable, cartTotals, owns, canShowPass, canCancel,
} from '@/lib/model';

const KEY = 'last5.website.customer.v2';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

const clone = (value) =>
  typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));

function withSiteDefaults(state) {
  state.siteSettings ??= { city: 'Dhaka', area: '' };
  state.favouriteShops ??= [];
  state.partnerApplication ??= null;
  return state;
}

export function AppProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [s, setS] = useState(() => withSiteDefaults(seed()));
  const [mounted, setMounted] = useState(false);
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [authReturn, setAuthReturn] = useState(null);
  const toastTimers = useRef(new Map());

  const [site, setSiteState] = useState({
    menu: false,
    category: 'All food',
    q: '',
    diet: '',
    price: '',
    sort: 'recommended',
    limit: 9,
    filters: false,
    qty: 1,
    helpQ: '',
    helpCategory: 'All questions',
    step: 1,
    draft: {},
    featured: 0,
    paused: false,
    pending: null,
    returnTo: null,
    checkoutKey: null,
    filtersAccount: {},
    terms: {},
    mobileOpen: false,
    authMode: 'signin',
  });

  const setSite = useCallback((patch) => {
    setSiteState((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  const updateS = useCallback((mutator) => {
    setS((prev) => {
      const next = clone(prev);
      mutator(next);
      return next;
    });
  }, []);

  /* ---------- persistence ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.version === 1) setS(withSiteDefaults(parsed));
      }
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* session-only */
    }
  }, [s, mounted]);

  /* ---------- toast ---------- */
  const toast = useCallback((message, error = false) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list, { id, message, error }]);
    const timer = setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 5000);
    toastTimers.current.set(id, timer);
  }, []);

  useEffect(() => () => toastTimers.current.forEach((t) => clearTimeout(t)), []);

  /* ---------- modal ---------- */
  const openModal = useCallback((next) => setModal(next), []);
  const closeModal = useCallback(() => setModal(null), []);

  /* ---------- navigation ---------- */
  const go = useCallback(
    (path) => {
      setModal(null);
      setSite({ menu: false, qty: 1, ...(path === '/' ? { category: 'All food', q: '' } : {}) });
      router.push(path);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [router, setSite]
  );

  const goAccount = useCallback(
    (name, query = '') => {
      setModal(null);
      setSite({ mobileOpen: false });
      router.push(`/account/${name}${query ? `?${query}` : ''}`);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
    },
    [router, setSite]
  );

  const explorePublic = useCallback(() => go('/explore'), [go]);

  /* ---------- derived ---------- */
  const shop = useCallback((id) => SHOPS.find((x) => x.id === id), []);
  const food = useCallback((id) => s.foods.find((x) => x.id === id), [s.foods]);
  const localFoods = useCallback(
    () =>
      s.foods.filter(
        (f) =>
          foodAvailable(f) &&
          shop(f.shopId).city === s.siteSettings.city &&
          (!s.siteSettings.area || shop(f.shopId).area === s.siteSettings.area)
      ),
    [s.foods, s.siteSettings, shop]
  );

  /* ---------- sign in / out ---------- */
  const signIn = useCallback(
    ({ name, email, phone } = {}, signup = false, opts = {}) => {
      const next = clone(s);
      next.signedIn = true;
      if (signup) {
        next.profile.name = name.trim();
        next.profile.email = email.trim();
        next.profile.phone = phone.trim();
      }
      const pending = opts.pending ?? site.pending;
      const target = opts.returnTo ?? site.returnTo ?? (signup ? '/account/overview' : '/');
      let nextModal = null;
      if (pending?.type === 'add') {
        try {
          addToCart(next, pending.id, pending.qty || 1);
          nextModal = { type: 'bag' };
        } catch (err) {
          if (err.message === 'DIFFERENT_SHOP') nextModal = { type: 'different-shop', id: pending.id, qty: pending.qty || 1 };
        }
      } else if (pending?.type === 'save-food' || pending?.type === 'save-shop') {
        const arr = pending.type === 'save-food' ? next.favourites : next.favouriteShops;
        if (!arr.includes(pending.id)) arr.push(pending.id);
      }
      setS(next);
      setSite({ pending: null, returnTo: null });
      if (opts.account) {
        goAccount('overview');
      } else {
        go(target);
      }
      setModal(nextModal);
      toast(signup ? 'Sample account created. Verify your contacts in the connected product.' : 'Welcome to the sample account.');
    },
    [s, site.pending, site.returnTo, setSite, go, goAccount, toast]
  );

  const signOut = useCallback(() => {
    updateS((next) => {
      next.signedIn = false;
    });
    setModal(null);
    setSite({ mobileOpen: false });
    router.push('/account/explore');
    toast('Signed out of the demo account. You can keep browsing.');
  }, [router, updateS, toast, setSite]);

  /* ---------- favourites ---------- */
  const needSignin = useCallback(
    (pending = null, opts = {}) => {
      if (s.signedIn) return true;
      setSite({ pending, returnTo: opts.returnTo ?? pathname });
      openModal({ type: 'signin-required' });
      return false;
    },
    [s.signedIn, pathname, setSite, openModal]
  );

  const saveFood = useCallback(
    (id, kind = 'save-food') => {
      if (!needSignin({ type: kind, id })) return;
      const arr = kind === 'save-food' ? s.favourites : s.favouriteShops;
      const wasSaved = arr.includes(id);
      updateS((next) => {
        const list = kind === 'save-food' ? next.favourites : next.favouriteShops;
        const i = list.indexOf(id);
        if (i < 0) list.push(id);
        else list.splice(i, 1);
      });
      toast(wasSaved ? 'Removed from your favourites.' : 'Saved to your favourites.');
    },
    [needSignin, updateS, toast, s.signedIn, s.favourites, s.favouriteShops]
  );

  const saveShop = useCallback((id) => saveFood(id, 'save-shop'), [saveFood]);

  /* ---------- cart ---------- */
  const add = useCallback(
    (id, qty = 1) => {
      if (!needSignin({ type: 'add', id, qty })) return;
      const next = clone(s);
      try {
        addToCart(next, id, qty);
        setS(next);
        setModal({ type: 'bag' });
      } catch (err) {
        if (err.message === 'DIFFERENT_SHOP') {
          setModal({ type: 'different-shop', id, qty });
        } else toast(err.message, true);
      }
    },
    [needSignin, s, toast]
  );

  const replaceBag = useCallback(
    (id, qty = 1) => {
      const next = clone(s);
      try {
        addToCart(next, id, qty, true);
        setS(next);
        setModal({ type: 'bag' });
      } catch (err) {
        toast(err.message, true);
      }
    },
    [s, toast]
  );

  const changeCart = useCallback(
    (id, qty, reopen = false) => {
      const next = clone(s);
      try {
        updateCart(next, id, qty);
        setS(next);
        if (reopen) setModal({ type: reopen === 'bag' ? 'bag' : 'cart' });
        else setModal(null);
      } catch (err) {
        toast(err.message, true);
      }
    },
    [s, toast]
  );

  /* ---------- payment ---------- */
  const finishPayment = useCallback(
    (id, outcome, { confirmation = false } = {}) => {
      const next = clone(s);
      try {
        const o = resolvePayment(next, id, outcome);
        if (outcome === 'failed') setSite({ checkoutKey: null });
        setS(next);
        if (confirmation) {
          go('/confirmation/' + o.id);
        } else {
          setModal({ type: 'payment-result', id: o.id });
        }
        toast(
          o.payment === 'Paid'
            ? 'Sample payment verified.'
            : o.payment === 'Pending'
              ? 'Sample payment remains pending. Check this attempt before retrying.'
              : 'Sample payment failed. Reserved stock was released.'
        );
      } catch (err) {
        toast(err.message, true);
      }
    },
    [s, setSite, setS, go, toast]
  );

  /* ---------- account modals ---------- */
  const showFood = useCallback((id) => setModal({ type: 'food', id }), []);
  const showCart = useCallback(() => setModal({ type: 'cart' }), []);
  const showCheckout = useCallback(() => setModal({ type: 'checkout' }), []);
  const showGateway = useCallback((id) => setModal({ type: 'gateway', id }), []);
  const showOrder = useCallback((id) => setModal({ type: 'order', id }), []);
  const showPass = useCallback((id) => setModal({ type: 'pass', id }), []);
  const showLocation = useCallback((id = null) => setModal({ type: 'location', id }), []);
  const showAreaPicker = useCallback(() => setModal({ type: 'choose-area' }), []);
  const showCaseForm = useCallback((orderId = '', type = 'Order') => setModal({ type: 'new-case', orderId, caseType: type }), []);
  const showCase = useCallback((id) => setModal({ type: 'case', id }), []);
  const showCancel = useCallback((id) => setModal({ type: 'cancel', id }), []);
  const showReceipt = useCallback((id) => setModal({ type: 'receipt', id }), []);
  const showRecovery = useCallback(() => setModal({ type: 'recovery' }), []);
  const showClosure = useCallback(() => setModal({ type: 'closure' }), []);
  const showReset = useCallback(() => setModal({ type: 'reset' }), []);
  const showCredits = useCallback(() => setModal({ type: 'credits' }), []);
  const showLocationPublic = useCallback(() => setModal({ type: 'location-public' }), []);
  const showBag = useCallback(() => setModal({ type: 'bag' }), []);

  const accountFavourite = useCallback(
    (id) => {
      if (!needSignin()) return;
      updateS((next) => {
        next.favourites = next.favourites.includes(id)
          ? next.favourites.filter((x) => x !== id)
          : [...next.favourites, id];
      });
      toast(s.favourites.includes(id) ? 'Removed from favourites.' : 'Saved to your favourites.');
      setModal((m) => (m?.type === 'food' ? { ...m } : m));
    },
    [needSignin, updateS, toast, s.favourites]
  );

  const accountAdd = useCallback(
    (id, qty = 1) => {
      if (!needSignin()) return;
      const next = clone(s);
      try {
        addToCart(next, id, qty);
        setS(next);
        setSite({ checkoutKey: null });
        setModal({ type: 'cart' });
        toast('Added to your food bag.');
      } catch (err) {
        if (err.message === 'DIFFERENT_SHOP') {
          setModal({ type: 'replace-cart', id, qty });
        } else toast(err.message, true);
      }
    },
    [needSignin, s, setSite, toast]
  );

  /* ---------- account data helpers ---------- */
  const ownedOrders = useCallback(() => s.orders.filter((o) => o.customerId === s.profile.id), [s.orders, s.profile.id]);

  const resetAccount = useCallback(() => {
    const next = withSiteDefaults(seed());
    setS(next);
    setSite({ filtersAccount: {}, terms: {}, checkoutKey: null });
    setModal(null);
    goAccount('overview');
    toast('The original sample customer account is restored.');
  }, [setSite, goAccount, toast]);

  const value = useMemo(
    () => ({
      s, setS, updateS, mounted, persist: () => {},
      site, setSite,
      modal, openModal, closeModal, setModal,
      toasts, toast,
      go, goAccount, explorePublic, signIn, signOut,
      shop, food, localFoods, ownedOrders,
      needSignin, saveFood, saveShop, add, replaceBag, changeCart, finishPayment,
      showFood, showCart, showCheckout, showGateway, showOrder, showPass,
      showLocation, showAreaPicker, showCaseForm, showCase, showCancel,
      showReceipt, showRecovery, showClosure, showReset, showCredits,
      showLocationPublic, showBag, accountFavourite, accountAdd,
      resetAccount, authReturn, setAuthReturn,
      moneyFns: { cartTotals, foodAvailable, owns, canShowPass, canCancel, cancelOrder, setPreferred, removeLocation, saveProfile, startCheckout },
      LOCATIONS, SHOPS, TODAY,
    }),
    [
      s, updateS, mounted, site, setSite, modal, openModal, closeModal, setModal, toasts, toast,
      go, goAccount, explorePublic, signIn, signOut, shop, food, localFoods, ownedOrders,
      needSignin, saveFood, saveShop, add, replaceBag, changeCart, finishPayment, showFood, showCart,
      showCheckout, showGateway, showOrder, showPass, showLocation, showAreaPicker,
      showCaseForm, showCase, showCancel, showReceipt, showRecovery, showClosure,
      showReset, showCredits, showLocationPublic, showBag, accountFavourite, accountAdd,
      resetAccount, authReturn,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { KEY };
