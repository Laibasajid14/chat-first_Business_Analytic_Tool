import { Outlet, useLocation } from 'react-router-dom';
import { BarChart3, CheckCircle2, Info, XCircle } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';
import { useAppState } from '../../context/AppState.jsx';
import { workspace } from '../../data/mockData.js';

export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white shadow-sm">
        <BarChart3 className="size-5" aria-hidden="true" />
      </span>
      {!compact && <span className="text-[15px] font-semibold tracking-tight text-ink">{workspace.product}</span>}
    </div>
  );
}

function Toast() {
  const { toast } = useAppState();
  if (!toast) return null;
  const Icon = toast.tone === 'error' ? XCircle : toast.tone === 'info' ? Info : CheckCircle2;
  const color = toast.tone === 'error' ? 'text-red-600' : toast.tone === 'info' ? 'text-blue-600' : 'text-emerald-600';
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-6" role="status" aria-live="polite">
      <div key={toast.key} className="animate-fade-up pointer-events-auto flex max-w-md items-start gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-lg">
        <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} aria-hidden="true" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default function AppShell() {
  const isChatPage = useLocation().pathname.startsWith('/chat');

  return (
    <div className={`flex ${isChatPage ? 'h-dvh overflow-hidden' : 'min-h-full'}`}>
      <Sidebar />
      <div className={`flex min-w-0 flex-1 flex-col ${isChatPage ? 'min-h-0' : ''}`}>
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur md:hidden">
          <Logo />
          <span className="rounded-md border border-line px-2 py-1 text-xs font-medium text-muted">{workspace.company}</span>
        </header>
        <main className={`min-w-0 flex-1 ${isChatPage ? 'min-h-0 overflow-hidden' : ''}`}>
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <Toast />
    </div>
  );
}
