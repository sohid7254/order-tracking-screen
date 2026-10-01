import { useEffect, useRef } from 'react';

const BTN = {
  base: 'min-h-[46px] w-full rounded-xl border px-3.5 py-2.5 text-center font-semibold',
  default: 'border-line bg-card',
  primary: 'border-ink bg-ink text-bg',
  danger: 'border-bad bg-bad text-white',
};

export function Btn({ variant = 'default', className = '', ...p }) {
  return <button className={`${BTN.base} ${BTN[variant]} ${className}`} {...p} />;
}

export function Card({ title, children, className = '' }) {
  return (
    <section className={`mb-3 rounded-2xl border border-line bg-card p-4 ${className}`}>
      {title && <h2 className="mb-2.5 text-base font-bold">{title}</h2>}
      {children}
    </section>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-skel ${className}`} />;
}

export function Sheet({ title, intro, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    ref.current?.querySelector('button,input')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/45" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title}
        className="sheet-up max-h-[88vh] w-full max-w-[430px] overflow-auto rounded-t-[20px] bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <h2 className="text-xl font-bold">{title}</h2>
        {intro && <p className="mb-3 text-mute">{intro}</p>}
        {children}
      </div>
    </div>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div role="status" className="fixed bottom-5 left-1/2 z-30 max-w-[90%] -translate-x-1/2 rounded-xl bg-ink px-4 py-2.5 text-sm text-bg">
      {message}
    </div>
  );
}
