import { CalendarClock, CheckCircle2, Loader2, XCircle } from 'lucide-react';

const STYLES = {
  Succeeded: { cls: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', icon: CheckCircle2 },
  Running: { cls: 'bg-blue-50 text-blue-700 ring-blue-600/20', icon: Loader2, spin: true },
  Failed: { cls: 'bg-red-50 text-red-700 ring-red-600/20', icon: XCircle },
  Scheduled: { cls: 'bg-violet-50 text-violet-700 ring-violet-600/20', icon: CalendarClock },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const s = STYLES[status] ?? STYLES.Scheduled;
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full font-medium ring-1 ring-inset ${s.cls} ${
        size === 'lg' ? 'px-2.5 py-1 text-sm' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <Icon className={`${size === 'lg' ? 'size-4' : 'size-3.5'} ${s.spin ? 'animate-spin' : ''}`} aria-hidden="true" />
      {status}
    </span>
  );
}
