import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronsUpDown, MessageSquare, Plus } from 'lucide-react';
import { Logo } from './AppShell.jsx';
import { navItems } from './navItems.js';
import { useAppState } from '../../context/AppState.jsx';
import { workspace } from '../../data/mockData.js';

// Desktop (≥1024px): full sidebar. Tablet (768–1023px): compact icon rail.
export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { conversations } = useAppState();
  const isChatPage = pathname.startsWith('/chat');
  return (
    <aside className={`sticky top-0 hidden ${isChatPage ? 'h-dvh' : 'h-screen'} self-start w-[72px] shrink-0 flex-col border-r border-line bg-white md:flex lg:w-64`}>
      <div className="flex h-16 items-center justify-center px-4 lg:justify-start">
        <div className="lg:hidden"><Logo compact /></div>
        <div className="hidden lg:block"><Logo /></div>
      </div>

      <div className="hidden px-3 lg:block">
        <button
          type="button"
          className="flex h-11 w-full items-center gap-2.5 rounded-lg border border-line px-2.5 text-left hover:bg-slate-50"
          aria-label={`Workspace: ${workspace.company}`}
        >
          <span className="grid size-7 place-items-center rounded-md bg-slate-900 text-xs font-semibold text-white">RC</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] leading-tight text-muted">Workspace</span>
            <span className="block truncate text-sm font-medium leading-tight">{workspace.company}</span>
          </span>
          <ChevronsUpDown className="size-4 text-muted" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Main" className="mt-4 flex flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon: Icon, match }) => {
          const active = pathname.startsWith(match || to);
          return (
            <NavLink
              key={to}
              to={to}
              title={label}
              aria-current={active ? 'page' : undefined}
              className={`flex h-11 items-center justify-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors lg:justify-start ${
                active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
              }`}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="hidden lg:inline">{label}</span>
              <span className="sr-only lg:hidden">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 hidden min-h-0 flex-1 flex-col px-3 lg:flex">
        <div className="flex items-center justify-between gap-2 px-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Recent chats</p>
          <span className="text-[11px] tabular-nums text-muted">{conversations.length}</span>
        </div>
        <ul className="mt-2 min-h-0 space-y-0.5 overflow-y-auto">
          {conversations.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted">Your conversations will appear here.</li>
          ) : conversations.map((conversation) => (
            <li key={conversation.id}>
              <NavLink
                to={`/chat/${conversation.id}`}
                title={conversation.title}
                className={({ isActive }) => `flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
                }`}
              >
                <MessageSquare className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="truncate">{conversation.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => navigate('/chat')}
          className="mt-3 inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 text-sm font-medium text-blue-700 hover:bg-blue-100"
        >
          <Plus className="size-4" aria-hidden="true" />
          New conversation
        </button>
      </div>

      <div className="mt-auto border-t border-line p-3">
        <div className="flex items-center justify-center gap-3 rounded-lg p-1.5 lg:justify-start">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700" title={workspace.user.name}>
            {workspace.user.initials}
          </span>
          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-medium">{workspace.user.name}</p>
            <p className="truncate text-xs text-muted">{workspace.user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
