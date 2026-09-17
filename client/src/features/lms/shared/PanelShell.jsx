import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, selectUser } from '../auth/authSlice.js';
import { logoutRequest } from '../auth/authApi.js';
import logo from '../../../assets/vision-logo-transparent.png';

const SIDEBAR_OPEN_WIDTH   = 'w-60';
const SIDEBAR_CLOSED_WIDTH = 'w-16';

/**
 * Shared shell layout for all three LMS role panels.
 * Renders a collapsible sidebar, a topbar, and the main content slot.
 *
 * @param {{ navItems: Array<{ label: string, to: string, icon: React.ReactNode }>, panelTitle: string, children: React.ReactNode }} props
 */
export default function PanelShell({ navItems, panelTitle, children }) {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const user            = useSelector(selectUser);
  const [open, setOpen] = useState(true);

  const handleLogout = async () => {
    try { await logoutRequest(); } catch (_e) { void _e; }
    dispatch(clearCredentials());
    navigate('/portal/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">

      <aside
        className={`flex flex-col bg-primary-600 text-white transition-all duration-300 flex-shrink-0 ${open ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH}`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-primary-700">
          <img src={logo} alt="Vision Academy" className="h-8 flex-shrink-0 brightness-0 invert" />
          {open && (
            <span className="text-sm font-bold tracking-wide truncate">{panelTitle}</span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
              {open && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-4 text-sm text-primary-200 hover:text-white hover:bg-white/10 border-t border-primary-700 transition-colors text-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          {open && <span>Sign out</span>}
        </button>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between bg-white border-b border-neutral-100 px-6 h-14 flex-shrink-0">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
            className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-neutral-800 leading-none">{user?.name}</p>
              <p className="text-xs text-neutral-400 mt-0.5 capitalize">{user?.role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
