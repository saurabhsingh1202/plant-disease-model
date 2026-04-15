import { NavLink, useLocation } from 'react-router-dom';
import { Leaf, Home, Scan, Clock, Info, Zap } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/predict', label: 'Detect', icon: Scan },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon">🌿</span>
          PlantGuard AI
        </NavLink>

        <ul className="navbar-links">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => isActive ? 'active' : ''}
                end={to === '/'}
              >
                <Icon size={15} />
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/predict" className="navbar-cta">
              <Zap size={14} />
              Analyze Plant
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
