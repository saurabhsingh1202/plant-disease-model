import { NavLink } from 'react-router-dom';
import { Home, Scan, Clock, Info, Zap, BarChart3, Landmark, Bot, Globe } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Navbar() {
  const { t, lang, setLanguage } = useTranslation();

  const navItems = [
    { to: '/', labelKey: 'navHome', icon: Home },
    { to: '/predict', labelKey: 'navDetect', icon: Scan },
    { to: '/history', labelKey: 'navHistory', icon: Clock },
    { to: '/dashboard', labelKey: 'navDashboard', icon: BarChart3 },
    { to: '/assistant', labelKey: 'navHub', icon: Landmark },
    { to: '/chatbot', labelKey: 'navChatbot', icon: Bot },
    { to: '/about', labelKey: 'navAbout', icon: Info },
  ];

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="navbar-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <NavLink to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontWeight: 800 }}>
          <span className="logo-icon" style={{ fontSize: 22 }}>🌿</span>
          KrishiSathi AI
        </NavLink>

        <ul className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: 14, listStyle: 'none', margin: 0, padding: 0 }}>
          {navItems.map(({ to, labelKey, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => isActive ? 'active' : ''}
                end={to === '/'}
                style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 14 }}
              >
                <Icon size={15} />
                {t(labelKey)}
              </NavLink>
            </li>
          ))}

          {/* Language Selector */}
          <li style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8, borderLeft: '1px solid var(--border)', paddingLeft: 14 }}>
            <Globe size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              value={lang}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: '4px 8px',
                borderRadius: 8,
                color: 'var(--text-primary)',
                fontSize: 12,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bho">भोजपुरी</option>
              <option value="mr">मराठी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </li>

          <li>
            <NavLink to="/predict" className="navbar-cta" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 14 }}>
              <Zap size={14} />
              {t('analyzePlant')}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
