import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from './navItems.js';

// Mobile (<768px): fixed bottom navigation replaces the sidebar.
export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid h-16 grid-cols-3">
        {navItems.map(({ to, label, icon: Icon, match }) => {
          const active = pathname.startsWith(match || to);
          return (
            <li key={to}>
              <NavLink
                to={to}
                aria-current={active ? 'page' : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-xs font-medium ${active ? 'text-blue-700' : 'text-slate-500'}`}
              >
                <span className={`grid h-7 w-12 place-items-center rounded-full ${active ? 'bg-blue-50' : ''}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
