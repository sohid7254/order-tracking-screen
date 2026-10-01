import { useEffect, useRef, useState } from 'react';
import { STEPS, ITEMS, STATES } from './data';
import { Btn, Card, Skeleton, Sheet, Toast } from './ui';

const HERO = { ok: 'bg-brand-s', warn: 'bg-warn-s', bad: 'bg-bad-s', idle: 'bg-card border border-line' };
const TEXT = { ok: 'text-brand', warn: 'text-warn', bad: 'text-bad', idle: 'text-mute' };
const FILL = { ok: 'bg-brand', warn: 'bg-warn', bad: 'bg-bad', idle: 'bg-brand' };
const RING = { ok: 'border-brand text-brand ring-brand-s', warn: 'border-warn text-warn ring-warn-s', bad: 'border-bad text-bad ring-bad-s', idle: 'border-brand text-brand ring-brand-s' };
const REASONS = [['missing', "I didn't receive it"], ['late', "It's taking too long"], ['damaged', 'It arrived damaged'], ['wrong', 'Wrong item or address']];

function Hero({ d, children }) {
  return (
    <section className={`mb-3 rounded-[20px] p-[18px] ${HERO[d.tone]}`}>
      <span className={`inline-flex rounded-full bg-card px-2.5 py-0.5 text-[13px] font-semibold ${TEXT[d.tone]} ${d.tone === 'idle' ? 'border border-line' : ''}`}>{d.pill}</span>
      <h2 className="mb-1 mt-3 text-[26px] font-bold leading-tight tracking-tight">{d.title}</h2>
      <p className="text-mute">{d.sub}</p>
      <div className="mt-4 flex gap-1" role="img" aria-label={`Step ${d.cur + 1} of 5: ${STEPS[d.cur]}`}>
        {STEPS.map((_, i) => <i key={i} className={`h-1.5 flex-1 rounded-sm ${i <= d.cur ? FILL[d.tone] : 'bg-black/10 dark:bg-white/15'}`} />)}
      </div>
      <div className="mt-3.5 flex items-end justify-between gap-3 border-t border-black/10 pt-3 dark:border-white/15">
        <div>
          <small className="block text-xs text-mute">{d.etaLabel || 'Estimated delivery'}</small>
          <b className="text-[17px]">{d.eta}</b>
        </div>
        {d.oldEta && <s className="text-[13px] text-mute">{d.oldEta}</s>}
        {d.note && <small className="text-right text-xs text-mute">{d.note}</small>}
      </div>
      {children}
    </section>
  );
}

function Timeline({ d }) {
  return (
    <ol>
      {STEPS.map((s, i) => {
        const done = i < d.cur, now = i === d.cur;
        const dot = done ? 'border-brand bg-brand text-card' : now ? `ring-4 ${RING[d.tone]}` : 'border-line text-mute';
        return (
          <li key={s} className={`relative grid grid-cols-[28px_1fr] gap-3 ${i < 4 ? 'pb-[18px]' : ''}`}>
            {i < 4 && <span className={`absolute bottom-0 left-[13px] top-7 w-0.5 ${done ? 'bg-brand' : 'bg-line'}`} />}
            <span aria-hidden className={`grid h-7 w-7 place-items-center rounded-full border-2 bg-card text-sm font-bold ${dot}`}>
              {done ? '✓' : now && (d.problem || d.tone === 'warn') ? '!' : i + 1}
            </span>
            <div>
              <b className={`block ${!done && !now ? 'font-medium text-mute' : 'font-semibold'}`}>{s}</b>
              <small className="text-[13px] text-mute">{d.times[i] || 'Not started'}</small>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Summary() {
  const [open, setOpen] = useState(false);
  const rows = [['Subtotal', '$142.00'], ['Shipping', '$6.00'], ['Total paid', '$148.00'], ['Deliver to', 'Road 5, Dhanmondi, Dhaka'], ['Courier', 'SwiftPost · SP22841907']];
  return (
    <Card title="Order summary">
      {ITEMS.map((i) => (
        <div key={i.name} className="flex items-center gap-3 py-2">
          <div aria-hidden className="grid h-[52px] w-[52px] flex-none place-items-center rounded-xl bg-brand-s text-2xl">{i.icon}</div>
          <div className="min-w-0 flex-1"><b className="block font-semibold">{i.name}</b><small className="text-mute">{i.meta}</small></div>
          <b>{i.price}</b>
        </div>
      ))}
      <button className="pt-2 font-semibold text-brand" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Hide order details' : 'View order details'}
      </button>
      {open && (
        <dl className="mt-2.5 grid gap-2 border-t border-line pt-3 text-sm">
          {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-mute">{k}</dt><dd className="text-right">{v}</dd></div>)}
        </dl>
      )}
    </Card>
  );
}

function Actions({ state, notify, setNotify, reported, openSheet, toast }) {
  const toggle = () => { setNotify(!notify); toast(notify ? 'Notifications off' : "We'll notify you"); };
  if (state === 'transit') return <div className="mt-4"><Btn variant="primary" onClick={() => openSheet('map')}>View live location</Btn></div>;
  if (state === 'delayed') return (
    <>
      <div className="mt-3.5 rounded-xl bg-card p-3 text-sm"><b className="block">What happens next</b>We&apos;ll message you when it moves again. If it isn&apos;t delivered by Oct 5, you can cancel for a full refund.</div>
      <div className="mt-4 grid gap-2">
        <Btn variant="primary" onClick={toggle}>{notify ? "✓ We'll notify you" : 'Notify me when it moves'}</Btn>
        <Btn onClick={() => openSheet('report')}>Cancel or ask for a refund</Btn>
      </div>
    </>
  );
  if (state === 'lost') {
    if (reported) return (
      <>
        <div className="mt-3.5 rounded-xl bg-card p-3 text-sm"><b className="block">Report R-20931 received</b>We&apos;re contacting the courier. Expect an update within 24 hours, with a replacement or refund.</div>
        <div className="mt-4"><Btn onClick={() => openSheet('contact')}>Contact support</Btn></div>
      </>
    );
    return (
      <>
        <ul className="mt-3 grid gap-2 text-sm">
          {['Check around the gate, porch and with neighbours or security.', 'Ask household members if they took it in.', "Still nothing? Tell us and we'll investigate."].map((t, i) => (
            <li key={t} className="flex items-start gap-2.5 rounded-xl bg-card px-3 py-2.5">
              <span className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-bad-s text-xs font-bold text-bad">{i + 1}</span>{t}
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2">
          <Btn variant="danger" onClick={() => openSheet('report')}>I didn&apos;t receive it</Btn>
          <Btn onClick={() => toast('Glad it turned up. Thanks for letting us know.')}>I found it</Btn>
        </div>
      </>
    );
  }
  return (
    <div className="mt-3.5 flex items-center justify-between gap-3">
      <span>Notify me when tracking is ready</span>
      <button role="switch" aria-checked={notify} aria-label="Notify me when tracking is ready" onClick={toggle}
        className={`relative h-7 w-[46px] flex-none rounded-full transition-colors ${notify ? 'bg-brand' : 'bg-line'}`}>
        <span className={`absolute left-[3px] top-[3px] h-[22px] w-[22px] rounded-full bg-white transition-transform ${notify ? 'translate-x-[18px]' : ''}`} />
      </button>
    </div>
  );
}

function ReportForm({ initial, onSubmit, onClose }) {
  const [reason, setReason] = useState(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {REASONS.map(([v, label]) => (
        <label key={v} className={`mb-2 flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 ${reason === v ? 'border-brand bg-brand-s' : 'border-line'}`}>
          <input type="radio" name="reason" className="h-[18px] w-[18px] accent-brand" checked={reason === v} onChange={() => setReason(v)} />{label}
        </label>
      ))}
      <textarea aria-label="More detail (optional)" placeholder="Anything else we should know? (optional)"
        className="mb-3 mt-1 min-h-[76px] w-full rounded-xl border border-line bg-bg p-2.5" />
      <div className="grid gap-2"><Btn variant="primary" type="submit">Submit report</Btn><Btn type="button" onClick={onClose}>Cancel</Btn></div>
    </form>
  );
}

export default function TrackingScreen() {
  const [state, setState] = useState('transit');
  const [last, setLast] = useState('transit');
  const [sheet, setSheet] = useState(null);
  const [reported, setReported] = useState(false);
  const [notify, setNotify] = useState(false);
  const [msg, setMsg] = useState('');
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const toast = (m) => { setMsg(m); timers.current.push(setTimeout(() => setMsg(''), 2600)); };
  const go = (s) => {
    timers.current.forEach(clearTimeout);
    if (s !== 'loading' && s !== 'error') setLast(s);
    if (s === 'transit') setReported(false);
    setState(s);
  };
  const reload = () => { go('loading'); timers.current.push(setTimeout(() => setState(last), 900)); };
  const close = () => setSheet(null);

  const tabs = [...Object.entries(STATES).map(([k, v]) => [k, v.label]), ['loading', 'Loading'], ['error', 'Error']];
  const d = STATES[state];

  return (
    <div className="mx-auto min-h-screen max-w-[430px] px-4 pb-10 pt-[env(safe-area-inset-top,0px)]">
      <div className="sticky top-[env(safe-area-inset-top,0px)] z-10 -mx-4 bg-bg px-4 pb-2 pt-2.5">
        <p className="mb-1.5 text-xs text-mute">Prototype: switch between the screen&apos;s states</p>
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Screen state">
          {tabs.map(([k, l]) => (
            <button key={k} aria-pressed={state === k} onClick={() => go(k)}
              className={`flex-none rounded-full border px-3 py-1.5 text-[13px] font-medium ${state === k ? 'border-ink bg-ink text-bg' : 'border-line bg-card'}`}>{l}</button>
          ))}
        </div>
      </div>

      <header className="flex items-center justify-between pb-3 pt-3.5">
        <h1 className="text-xl font-bold tracking-tight">Track order</h1>
        <span className="text-[13px] text-mute">#BD-48213</span>
      </header>

      <main aria-live="polite">
        {state === 'loading' && (
          <>
            <Skeleton className="mb-3 h-[200px] !rounded-[20px]" />
            <Card><Skeleton className="mb-4 h-[18px] w-2/5" />{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="mb-3 h-[34px]" />)}</Card>
            <Skeleton className="h-[120px] !rounded-2xl" />
          </>
        )}
        {state === 'error' && (
          <Card className="px-2 py-7 text-center">
            <div aria-hidden className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-bad-s text-[26px]">⚠️</div>
            <h2 className="mb-1.5 text-xl font-bold">Can&apos;t load tracking</h2>
            <p className="mb-4 text-mute">We couldn&apos;t reach the tracking service. Your order is safe. Check your connection and try again.</p>
            <div className="grid gap-2"><Btn variant="primary" onClick={reload}>Try again</Btn><Btn onClick={() => setSheet('contact')}>Contact support</Btn></div>
          </Card>
        )}
        {d && (
          <>
            <Hero d={d}>
              <Actions state={state} notify={notify} setNotify={setNotify} reported={reported} openSheet={setSheet} toast={toast} />
            </Hero>
            <Card title="Delivery progress"><Timeline d={d} /></Card>
            <Summary />
            <Card title="Need help?">
              <div className="grid grid-cols-2 gap-2">
                <Btn onClick={() => setSheet('contact')}>Contact support<small className="block text-xs font-normal text-mute">Chat, call or email</small></Btn>
                <Btn onClick={() => setSheet('report')}>Report an issue<small className="block text-xs font-normal text-mute">Late, missing, damaged</small></Btn>
              </div>
            </Card>
          </>
        )}
      </main>

      {sheet === 'map' && (
        <Sheet title="Live location" intro="Rider Imran is about 4 stops away, roughly 35 minutes." onClose={close}>
          <Skeleton className="mb-3 h-[150px]" /><Btn variant="primary" onClick={close}>Close</Btn>
        </Sheet>
      )}
      {sheet === 'contact' && (
        <Sheet title="Contact support" intro="Quote order #BD-48213. We reply fastest on chat." onClose={close}>
          <div className="grid gap-2">
            <Btn variant="primary" onClick={() => { close(); toast('Chat opened. Wait time about 2 min'); }}>Start chat · about 2 min wait</Btn>
            <Btn onClick={() => { close(); toast('Calling support'); }}>Call 16000 · 9 AM–9 PM</Btn>
            <Btn onClick={() => { close(); toast('Email draft opened'); }}>Email support · reply in 24 h</Btn>
            <Btn onClick={close}>Cancel</Btn>
          </div>
        </Sheet>
      )}
      {sheet === 'report' && (
        <Sheet title="Report an issue" intro="Pick what happened. We'll follow up within 24 hours." onClose={close}>
          <ReportForm initial={state === 'lost' ? 'missing' : 'late'} onClose={close}
            onSubmit={() => { close(); if (state === 'lost') setReported(true); toast('Report submitted. Reference R-20931'); }} />
        </Sheet>
      )}
      <Toast message={msg} />
    </div>
  );
}
