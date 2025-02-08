import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Package, LogOut } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const navItems = [
    { path: '/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/products', icon: <Package size={20} />, label: 'Products' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
      </div>
      <nav className="flex-1">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            style={({ isActive }) => ({
              animationDelay: `${index * 0.1}s`,
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="sidebar-link mt-auto group"
      >
        <LogOut size={20} className="transition-transform duration-200 group-hover:rotate-12" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;