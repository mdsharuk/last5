export const TODAY = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Dhaka',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

export const addDays = (date, n) => {
  const d = new Date(date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export const LOCATIONS = [
  { city: 'Dhaka', areas: ['Banani', 'Dhanmondi', 'Uttara', 'Gulshan', 'Mirpur'] },
  { city: 'Tangail City', areas: ['Central Tangail'] },
  { city: 'Mymensingh City', areas: ['Town Hall'] },
];

export const SHOPS = [
  {
    id: 'golden',
    name: 'Morning Crust',
    area: 'Banani',
    city: 'Dhaka',
    address: 'House 18, Road 11, Banani, Dhaka',
    instructions: 'Collect at the front counter. Show your collection pass to our team.',
    category: 'Bakery',
    image: 'bread',
  },
  {
    id: 'green',
    name: 'Green Fork Kitchen',
    area: 'Dhanmondi',
    city: 'Dhaka',
    address: 'House 7, Road 8, Dhanmondi, Dhaka',
    instructions: 'Collect from the takeaway counter on the ground floor.',
    category: 'Restaurant',
    image: 'rice',
  },
  {
    id: 'juniper',
    name: 'Brew & Bean',
    area: 'Uttara',
    city: 'Dhaka',
    address: 'Road 4, Sector 7, Uttara, Dhaka',
    instructions: 'Ask for Last5 collection at the café counter.',
    category: 'Café',
    image: 'cake',
  },
];

SHOPS.push(
  {
    id: 'slice',
    name: 'The Daily Slice',
    area: 'Gulshan',
    city: 'Dhaka',
    address: '17 Gulshan Avenue, Dhaka',
    instructions: 'Collect at the main counter during your order window.',
    category: 'Bakery',
    image: 'pizza',
  },
  {
    id: 'sweet',
    name: 'Sweet Little Things',
    area: 'Dhanmondi',
    city: 'Dhaka',
    address: '19 Dhanmondi Road, Dhaka',
    instructions: 'Show your collection pass at the bakery counter.',
    category: 'Bakery',
    image: 'cake',
  },
  {
    id: 'pantry',
    name: 'Corner Pantry',
    area: 'Dhanmondi',
    city: 'Dhaka',
    address: '7 Road 4, Dhanmondi, Dhaka',
    instructions: 'Collect from the checkout counter. Bring a carry bag if you have one.',
    category: 'Grocery',
    image: 'fruit',
  },
  {
    id: 'spice',
    name: 'Spice Route',
    area: 'Central Tangail',
    city: 'Tangail City',
    address: '5 Main Road, Central Tangail',
    instructions: 'Use the takeaway counter and show your pass.',
    category: 'Restaurant',
    image: 'rice',
  },
  {
    id: 'harvest',
    name: 'Harvest Basket',
    area: 'Town Hall',
    city: 'Mymensingh City',
    address: '9 Town Hall Road, Mymensingh City',
    instructions: 'Collect at the main grocery counter.',
    category: 'Grocery',
    image: 'fruit',
  }
);

export function seed() {
  const foods = [
    ['F1', 'Butter Croissant', 'Bakery', 'croissant', 16000, 8000, 12, 'golden', 'Flaky butter croissant, freshly baked this morning. One piece per portion.', 'Contains wheat, milk and egg. May contain nuts.'],
    ['F2', 'Chicken Sandwich', 'Sandwiches', 'sandwich', 22000, 11000, 6, 'golden', 'A chicken sandwich with lettuce and tomato. One sandwich per portion.', 'Contains wheat, milk and egg.'],
    ['F3', 'Sourdough Loaf', 'Bakery', 'bread', 28000, 14000, 8, 'golden', 'A crusty sourdough loaf with a soft centre. One whole loaf per portion.', 'Contains wheat.'],
    ['F4', 'Chocolate Cake Slice', 'Desserts', 'cake', 24000, 12000, 10, 'golden', 'One generous slice of chocolate cake with chocolate frosting.', 'Contains wheat, milk and egg. May contain nuts.'],
    ['F5', 'Bakery Sharing Box', 'Bakery', 'bread', 50000, 25000, 4, 'golden', 'A box with 2 butter croissants, 2 sweet buns and 2 dinner rolls. One box per portion.', 'Contains wheat, milk and egg. May contain nuts.'],
    ['F6', 'Vegetable Pizza', 'Pizza', 'pizza', 48000, 24000, 5, 'golden', 'A whole vegetable pizza with cheese, tomato and seasonal vegetables.', 'Contains wheat and milk.'],
    ['F7', 'Chicken Rice Bowl', 'Meals', 'rice', 32000, 16000, 7, 'green', 'A bowl of rice and chicken with vegetables. One meal per portion.', 'Merchant advises checking ingredient details before purchase.'],
    ['F8', 'Café Cake Box', 'Desserts', 'cake', 40000, 20000, 3, 'juniper', 'A box with two cake slices, one chocolate and one vanilla.', 'Contains wheat, milk and egg. May contain nuts.'],
    ['F9', 'Garden Salad Bowl', 'Meals', 'salad', 32000, 16000, 7, 'green', 'One bowl of mixed greens, chickpeas and seasonal vegetables. Dressing is included separately.', 'Contains sesame. Ask the shop about preparation and cross-contact.'],
    ['F10', 'Coffee & Croissant', 'Café', 'coffee', 38000, 19000, 5, 'juniper', 'One regular milk coffee and one butter croissant.', 'Contains milk, wheat and egg.'],
    ['F11', 'Margherita Pizza', 'Pizza', 'pizza', 50000, 25000, 4, 'slice', 'One small tomato and mozzarella pizza, approximately 8 inches.', 'Contains wheat and milk.'],
    ['F12', 'Doughnut Trio', 'Desserts', 'donut', 30000, 15000, 6, 'slice', 'Three glazed doughnuts packed together for collection.', 'Contains wheat, milk and egg.'],
    ['F13', 'Vanilla Cupcake Trio', 'Desserts', 'cupcake', 36000, 18000, 5, 'sweet', 'Three vanilla cupcakes with buttercream frosting.', 'Contains wheat, milk and egg.'],
    ['F14', 'Breakfast Bread Loaf', 'Bakery', 'bread', 22000, 11000, 4, 'pantry', 'One wheat bread loaf, approximately 350 grams.', 'Contains wheat.'],
    ['F15', 'Seasonal Fruit Selection', 'Grocery', 'fruit', 40000, 20000, 6, 'pantry', 'Two apples, two oranges and two bananas. Six pieces of fruit.', 'No declared common allergens. Confirm your needs with the shop.'],
    ['F16', 'Chicken Biryani Portion', 'Meals', 'rice', 32000, 16000, 8, 'spice', 'One portion of chicken biryani with one chicken piece and rice.', 'Contains milk. May contain nuts.'],
    ['F17', 'Fruit Pair Pack', 'Grocery', 'fruit', 24000, 12000, 3, 'harvest', 'Two apples and two oranges. Four pieces of fruit.', 'No declared common allergens. Confirm your needs with the shop.'],
    ['F18', 'Café Croissant Duo', 'Bakery', 'croissant', 34000, 17000, 4, 'juniper', 'Two plain butter croissants.', 'Contains wheat, milk and egg.'],
  ].map(([id, name, category, image, original, sale, stock, shopId, description, allergens]) => ({
    id, name, category, image, original, sale, stock, shopId, description, allergens,
    date: TODAY, start: '18:00', end: '21:00', active: true, approved: true,
  }));

  const makeOrder = (id, foodId, qty, orderState, date, extra = {}) => {
    const f = foods.find((x) => x.id === foodId);
    const sh = SHOPS.find((x) => x.id === f.shopId);
    return {
      id,
      customerId: 'CU-1048',
      customerName: 'Tanvir Hasan',
      phone: '+880 1700 000000',
      shopId: f.shopId,
      shopName: sh.name,
      address: sh.address,
      instructions: sh.instructions,
      area: sh.area,
      date,
      start: '18:00',
      end: '21:00',
      items: [{ foodId: f.id, name: f.name, image: f.image, original: f.original, unit: f.sale, qty, description: f.description, allergens: f.allergens }],
      subtotal: f.sale * qty,
      fee: 2000,
      payment: 'Paid',
      state: orderState,
      refund: 'None',
      refundAmount: 0,
      requestedRefund: 0,
      transaction: 'DEMO-TXN-' + id.slice(-4),
      channel: 'SSLCOMMERZ · Online',
      createdAt: date + 'T11:00:00+06:00',
      events: [
        'Order created',
        'Payment verified',
        ...(['Accepted', 'Ready', 'Collected'].includes(orderState) ? ['Merchant accepted'] : []),
        ...(['Ready', 'Collected'].includes(orderState) ? ['Ready for collection'] : []),
        ...(orderState === 'Collected' ? ['Collection verified'] : []),
      ],
      ...extra,
    };
  };

  const orders = [
    makeOrder('L5-4812', 'F2', 2, 'Ready', TODAY, { code: '482913' }),
    makeOrder('L5-4820', 'F1', 2, 'Accepted', TODAY),
    makeOrder('L5-4822', 'F4', 1, 'Paid', TODAY),
    makeOrder('L5-4799', 'F3', 1, 'Collected', addDays(TODAY, -1)),
    makeOrder('L5-4788', 'F4', 2, 'Collected', addDays(TODAY, -3)),
    makeOrder('L5-4775', 'F1', 3, 'Collected', addDays(TODAY, -5)),
    makeOrder('L5-4764', 'F5', 1, 'Cancelled', addDays(TODAY, -6), {
      refund: 'Completed', refundAmount: 27000, requestedRefund: 27000,
      reason: 'Cancelled before merchant acceptance.',
      events: ['Order created', 'Payment verified', 'Order cancelled', 'Refund completed'],
    }),
    makeOrder('L5-4755', 'F2', 1, 'Rejected', addDays(TODAY, -7), {
      refund: 'Pending', requestedRefund: 13000,
      reason: 'The shop could not fulfil this order.',
      events: ['Order created', 'Payment verified', 'Merchant rejected', 'Refund review requested'],
    }),
  ];

  return {
    version: 1,
    signedIn: false,
    profile: {
      id: 'CU-1048', name: 'Tanvir Hasan', email: 'tanvir@example.com',
      phone: '+880 1700 000000', emailVerified: true, phoneVerified: true,
      pendingContact: null, joined: addDays(TODAY, -28),
    },
    locations: [
      { id: 'LOC1', label: 'Near home', city: 'Dhaka', area: 'Banani', preferred: true },
      { id: 'LOC2', label: 'Near work', city: 'Dhaka', area: 'Dhanmondi', preferred: false },
    ],
    selectedArea: 'Banani',
    foods,
    orders,
    cart: [],
    favourites: ['F1', 'F4', 'F5'],
    checkoutAttempt: null,
    notifications: [
      { id: 'N1', title: 'Your food is ready to collect', body: 'Your Chicken Sandwich order at Golden Crust Bakery is ready. Collect between 6 PM and 9 PM.', kind: 'order', route: 'orders', orderId: 'L5-4812', read: false, time: 'Just now' },
      { id: 'N2', title: 'A fresh bakery find in Banani', body: 'Butter Croissants are available at Golden Crust Bakery. Take a look before they are gone.', kind: 'offer', area: 'Banani', route: 'explore', foodId: 'F1', read: false, time: '20 minutes ago' },
      { id: 'N3', title: 'Refund completed', body: 'The verified refund for L5-4764 is available in Payments & refunds.', kind: 'refund', route: 'payments', read: true, time: '6 days ago' },
    ],
    cases: [
      {
        id: 'SUP-2001', type: 'Refund', subject: 'Checking my refund status', orderId: 'L5-4755', state: 'In progress', date: addDays(TODAY, -1),
        messages: [
          { by: 'You', text: 'Could you help me check the refund for this order?' },
          { by: 'Last5 support', text: 'The refund is still pending review. We will update the order when the provider confirms its result.' },
        ],
      },
    ],
    preferences: { offerAlerts: true, language: 'English' },
    requests: [],
    sessions: [
      { id: 'current', name: 'This browser', current: true, last: 'Current sample session' },
      { id: 'sample-other', name: 'Another sample browser', current: false, last: '2 days ago' },
    ],
  };
}

export const owns = (s, o) => s.signedIn && o?.customerId === s.profile.id;

export const isActive = (o) => ['Pending payment', 'Paid', 'Accepted', 'Ready'].includes(o.state);

export const canShowPass = (s, o) => owns(s, o) && o.payment === 'Paid' && o.state === 'Ready' && o.refund === 'None';

export const canCancel = (o) => o.state === 'Paid' && o.payment === 'Paid' && !o.uncertain;

export const foodAvailable = (f) => f?.active && f.approved && f.stock > 0 && f.date >= TODAY;

export function cartTotals(s) {
  const subtotal = s.cart.reduce((n, l) => n + s.foods.find((f) => f.id === l.foodId).sale * l.qty, 0);
  return { subtotal, fee: subtotal ? 2000 : 0, total: subtotal + (subtotal ? 2000 : 0) };
}

export function addToCart(s, foodId, qty = 1, replace = false) {
  if (s.checkoutAttempt && s.orders.find((o) => o.id === s.checkoutAttempt.orderId)?.payment === 'Pending') {
    throw Error('Check the existing payment attempt before changing this reserved bag.');
  }
  if (!s.signedIn) throw Error('Sign in to add food to your account cart.');
  const f = s.foods.find((x) => x.id === foodId);
  if (!foodAvailable(f)) throw Error('This food is no longer available. Please choose another item.');
  if (!Number.isInteger(qty) || qty < 1) throw Error('Choose a whole quantity of at least one.');
  if (qty > f.stock) throw Error('Only ' + f.stock + ' portions are currently available.');
  const currentShop = s.cart.length ? s.foods.find((x) => x.id === s.cart[0].foodId).shopId : null;
  if (currentShop && currentShop !== f.shopId) {
    if (!replace) throw Error('DIFFERENT_SHOP');
    s.cart = [];
  }
  const line = s.cart.find((x) => x.foodId === foodId);
  const total = qty + (line?.qty || 0);
  if (total > f.stock) throw Error('Only ' + f.stock + ' portions are currently available.');
  if (line) line.qty = total;
  else s.cart.push({ foodId, qty });
  return cartTotals(s);
}

export function updateCart(s, foodId, qty) {
  if (s.checkoutAttempt && s.orders.find((o) => o.id === s.checkoutAttempt.orderId)?.payment === 'Pending') {
    throw Error('Check the existing payment attempt before changing this reserved bag.');
  }
  const line = s.cart.find((x) => x.foodId === foodId);
  if (!line) return;
  if (!Number.isInteger(qty) || qty < 0) throw Error('Quantity must be a whole number, zero or greater.');
  if (qty === 0) {
    s.cart = s.cart.filter((x) => x.foodId !== foodId);
    return;
  }
  const f = s.foods.find((x) => x.id === foodId);
  if (!foodAvailable(f) || qty > f.stock) throw Error('Only ' + f.stock + ' portions are currently available.');
  line.qty = qty;
}

export function startCheckout(s, key) {
  if (!s.signedIn) throw Error('Sign in before checkout.');
  if (s.checkoutAttempt?.key === key) return s.orders.find((o) => o.id === s.checkoutAttempt.orderId);
  if (s.checkoutAttempt) {
    const old = s.orders.find((x) => x.id === s.checkoutAttempt.orderId);
    if (old?.payment === 'Pending') throw Error('Check your existing payment attempt before paying again.');
  }
  if (!s.cart.length) throw Error('Your cart is empty.');
  const fs = s.cart.map((l) => ({ line: l, food: s.foods.find((x) => x.id === l.foodId) }));
  const shopId = fs[0].food.shopId;
  if (fs.some((x) => x.food.shopId !== shopId)) throw Error('A checkout can contain food from only one shop.');
  for (const { line, food } of fs) {
    if (!Number.isInteger(line.qty) || line.qty < 1 || !foodAvailable(food) || line.qty > food.stock) {
      throw Error(food.name + ' stock changed. Review your cart.');
    }
  }
  const shop = SHOPS.find((x) => x.id === shopId);
  const totals = cartTotals(s);
  const id = 'L5-' + Date.now().toString().slice(-7) + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
  const o = {
    id, customerId: s.profile.id, customerName: s.profile.name, phone: s.profile.phone,
    shopId, shopName: shop.name, address: shop.address, instructions: shop.instructions, area: shop.area,
    date: TODAY, start: fs[0].food.start, end: fs[0].food.end,
    items: fs.map(({ line, food }) => ({
      foodId: food.id, name: food.name, image: food.image, original: food.original,
      unit: food.sale, qty: line.qty, description: food.description, allergens: food.allergens,
    })),
    subtotal: totals.subtotal, fee: totals.fee, payment: 'Pending', state: 'Pending payment',
    refund: 'None', refundAmount: 0, requestedRefund: 0, transaction: 'DEMO-' + Date.now(),
    channel: 'SSLCOMMERZ · Online', reservationUntil: Date.now() + 600000, reservation: 'Active',
    uncertain: false, createdAt: new Date().toISOString(),
    events: ['Order created', 'Stock reserved for checkout'],
  };
  for (const { line, food } of fs) food.stock -= line.qty;
  s.orders.unshift(o);
  s.checkoutAttempt = { key, orderId: id };
  return o;
}

export function resolvePayment(s, id, outcome) {
  const o = s.orders.find((x) => x.id === id);
  if (!owns(s, o)) throw Error('Order unavailable for this account.');
  if (o.payment === 'Paid') return o;
  if (o.payment === 'Failed' || o.payment === 'Expired') throw Error('This payment attempt has already ended. Start a new checkout after reviewing availability.');
  if (o.state === 'Cancelled') throw Error('This checkout was cancelled.');
  if (outcome === 'pending') {
    o.uncertain = true;
    return o;
  }
  if (outcome === 'success') {
    o.payment = 'Paid';
    o.state = 'Paid';
    o.reservation = 'Consumed';
    o.uncertain = false;
    o.events.push('Payment verified');
    s.cart = [];
    return o;
  }
  if (outcome === 'failed') {
    o.payment = 'Failed';
    o.state = 'Cancelled';
    o.uncertain = false;
    o.reason = 'Demo payment failed; no verified charge.';
    if (o.reservation === 'Active') {
      for (const l of o.items) {
        const f = s.foods.find((x) => x.id === l.foodId);
        if (f?.active && f.date >= TODAY) f.stock += l.qty;
      }
      o.reservation = 'Released';
    }
    o.events.push('Payment failed', 'Reservation released');
    s.checkoutAttempt = null;
    return o;
  }
  throw Error('Unknown payment outcome.');
}

export function cancelOrder(s, id, reason) {
  const o = s.orders.find((x) => x.id === id);
  if (!owns(s, o)) throw Error('Order unavailable for this account.');
  if (!canCancel(o)) throw Error('This order cannot be cancelled here. Please contact support.');
  if (!reason?.trim()) throw Error('Choose or enter a cancellation reason.');
  o.state = 'Cancelled';
  o.reason = reason.trim();
  if (o.payment === 'Paid') {
    o.refund = 'Pending';
    o.requestedRefund = o.subtotal + o.fee;
  } else o.payment = 'Expired';
  if (o.reservation !== 'Released') {
    for (const l of o.items) {
      const f = s.foods.find((x) => x.id === l.foodId);
      if (f?.active && f.date >= TODAY) f.stock += l.qty;
    }
    o.reservation = 'Released';
  }
  o.events.push('Order cancelled', o.payment === 'Paid' ? 'Refund review requested' : 'Reservation released');
  if (s.checkoutAttempt?.orderId === id) s.checkoutAttempt = null;
  return o;
}

export function setPreferred(s, id) {
  if (!s.locations.some((x) => x.id === id)) throw Error('Choose a valid saved area.');
  s.locations.forEach((x) => (x.preferred = x.id === id));
  s.selectedArea = s.locations.find((x) => x.id === id).area;
}

export function removeLocation(s, id, replacement) {
  const l = s.locations.find((x) => x.id === id);
  if (!l) return;
  if (l.preferred && s.locations.length > 1) {
    if (!replacement || replacement === id || !s.locations.some((x) => x.id === replacement)) {
      throw Error('Choose a new preferred area first.');
    }
    setPreferred(s, replacement);
  }
  s.locations = s.locations.filter((x) => x.id !== id);
  if (!s.locations.length) s.selectedArea = '';
}

export function saveProfile(s, data) {
  const name = String(data.name || '').trim();
  if (!name || name.length > 80) throw Error('Enter a name of up to 80 characters.');
  const email = String(data.email || '').trim();
  const phone = String(data.phone || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('Enter a valid email address.');
  if (!/^\+?[\d ()-]{8,25}$/.test(phone)) throw Error('Enter a valid contact number.');
  s.profile.name = name;
  if (email !== s.profile.email || phone !== s.profile.phone) {
    s.profile.pendingContact = {
      email: email !== s.profile.email ? email : null,
      phone: phone !== s.profile.phone ? phone : null,
      state: 'Verification pending',
    };
  }
  return s.profile;
}

export function accountSummary(s) {
  const owned = s.orders.filter((o) => o.customerId === s.profile.id);
  const collected = owned.filter((o) => o.state === 'Collected');
  const savings = collected.reduce((n, o) => n + o.items.reduce((m, l) => m + (l.original - l.unit) * l.qty, 0), 0);
  return {
    active: owned.filter(isActive).length,
    collected: collected.length,
    savings,
    units: collected.reduce((n, o) => n + o.items.reduce((m, l) => m + l.qty, 0), 0),
  };
}

export function safeExport(s) {
  return {
    profile: { id: s.profile.id, name: s.profile.name, email: s.profile.email, phone: s.profile.phone },
    savedLocations: s.locations,
    favourites: s.favourites,
    orders: s.orders.filter((o) => o.customerId === s.profile.id).map(({ code, ...o }) => o),
    preferences: s.preferences,
    supportCases: s.cases,
  };
}
