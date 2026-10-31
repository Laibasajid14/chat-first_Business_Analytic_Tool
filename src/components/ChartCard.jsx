import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

// White card with title, context line and a small action menu.
export default function ChartCard({ title, subtitle, actions = [], children, footer, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <section className={`min-w-0 rounded-xl border border-line bg-white p-2.5 shadow-sm sm:p-3 ${className}`} aria-label={title}>
      <header className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        {actions.length > 0 && (
          <div className="relative shrink-0" ref={ref}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label={`Actions for ${title}`}
              className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-ink"
            >
              <MoreHorizontal className="size-5" aria-hidden="true" />
            </button>
            {open && (
              <div role="menu" className="animate-fade-up absolute right-0 z-20 mt-1 w-52 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-line bg-white py-1 shadow-lg">
                {actions.map(({ label, icon: Icon, onClick, destructive }) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => { setOpen(false); onClick(); }}
                    className={`flex h-11 w-full items-center gap-2.5 px-3 text-left text-sm hover:bg-slate-50 ${destructive ? 'text-red-700' : 'text-slate-700'}`}
                  >
                    {Icon && <Icon className={`size-4 ${destructive ? 'text-red-500' : 'text-slate-400'}`} aria-hidden="true" />}
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
      {children}
      {footer}
    </section>
  );
}
