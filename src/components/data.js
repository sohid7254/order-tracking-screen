export const STEPS = ['Order placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];

export const ITEMS = [
  { icon: '👟', name: 'Ridge trail running shoes', meta: 'Size 42 · Slate', price: '$118.00' },
  { icon: '🧦', name: 'Wool socks, 3-pack', meta: 'Medium · Mixed', price: '$24.00' },
];

// Mock data for the three required states plus the normal in-transit state.
export const STATES = {
  transit: {
    label: 'On the way', tone: 'ok', pill: 'Out for delivery', title: 'Arriving today',
    sub: 'Rider Imran has your parcel and is heading to you.',
    eta: 'Today, 2:00–6:00 PM', cur: 3,
    times: ['Sep 28, 9:14 AM', 'Sep 28, 5:40 PM', 'Sep 29, 8:05 AM · Dhaka hub', 'Today, 8:30 AM · Rider on the way', 'Expected today'],
  },
  delayed: {
    label: 'Delayed', tone: 'warn', pill: 'Delayed', title: 'Running late',
    sub: 'Your parcel is held at the Chattogram hub because of heavy rain.',
    eta: 'Fri, Oct 3', oldEta: 'Was Tue, Sep 30', cur: 2,
    times: ['Sep 25, 10:02 AM', 'Sep 25, 6:15 PM', 'Sep 26, 7:40 AM · Delayed at Chattogram hub', 'Not out yet', 'Now expected Oct 3'],
  },
  lost: {
    label: 'Not received', tone: 'bad', pill: 'Marked delivered', title: 'Delivered, but not with you?',
    sub: 'The courier marked this delivered today at 11:42 AM and left it at the front gate.',
    eta: 'Delivered today, 11:42 AM', etaLabel: 'Delivery', cur: 4, problem: true,
    times: ['Sep 28, 9:14 AM', 'Sep 28, 5:40 PM', 'Sep 29, 8:05 AM', 'Today, 8:30 AM', 'Today, 11:42 AM · Left at front gate'],
  },
  pending: {
    label: 'No tracking yet', tone: 'idle', pill: 'Order confirmed', title: 'Tracking starts soon',
    sub: 'The seller is getting your order ready. Tracking appears once it ships.',
    eta: 'Oct 4–6', note: 'Usually within 1 business day', cur: 1,
    times: ['Today, 7:26 PM', 'Seller is preparing your order', 'Tracking number comes after pickup', '', ''],
  },
};
