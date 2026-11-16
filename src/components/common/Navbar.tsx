import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  MapPin,
  Award,
  BarChart3,
  Plane,
  PlusCircle,
  FileText,
  Info,
  Menu,
  X,
  UserCheck,
  User,
  Sparkles,
  LogOut,
  Leaf
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, role, switchRole, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/', icon: <Leaf className="w-4 h-4" /> },
    { label: 'Report Issue', path: '/report', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'My Reports', path: '/my-reports', icon: <FileText className="w-4 h-4" /> },
    { label: 'Heatmap', path: '/heatmap', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Eco Rewards', path: '/rewards', icon: <Award className="w-4 h-4" /> },
    { label: 'Admin Command', path: '/admin', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Drone Survey', path: '/drone', icon: <Plane className="w-4 h-4" /> },
    { label: 'About', path: '/about', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#244D30] text-[#FFF8E7] shadow-md border-b border-[#3E7C4A]/40">
      {/* Top micro-bar with Indian Civic Context & Demo Switcher */}
      <div className="bg-[#1A3823] px-4 py-1 text-xs text-[#FFF8E7]/80 flex justify-between items-center border-b border-[#3E7C4A]/20">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#F2A900] animate-pulse"></span>
          <span className="font-sans font-medium">Smart Civic Grievance Redressal • Swachh Bharat & Municipal AI Initiative</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-[#FFF8E7]/70">Demo Persona:</span>
          <button
            onClick={() => switchRole(role === 'citizen' ? 'admin' : 'citizen')}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F2A900] text-[#244D30] hover:bg-[#D69400] transition-colors shadow-xs"
            title="Toggle between Citizen and Admin mode for live presentation"
          >
            {role === 'admin' ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Mode (Rajesh)</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Citizen Mode (Aarav)</span>
              </>
            )}
            <span className="ml-1 text-[10px] bg-[#244D30]/20 px-1.5 py-0.2 rounded-full font-mono">Switch</span>
          </button>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3E7C4A] to-[#244D30] border-2 border-[#F2A900] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-[#F2A900]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-bold text-xl tracking-tight text-white">EcoSahayak</span>
                <span className="text-xs font-medium text-[#F2A900] tracking-wide">इको सहायक</span>
              </div>
              <p className="text-[10px] text-[#FFF8E7]/70 font-sans tracking-wide">AI Community Problem Reporter</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#3E7C4A] text-white shadow-xs font-semibold'
                      : 'text-[#FFF8E7]/90 hover:bg-[#3E7C4A]/40 hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Eco Points & User Menu */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser && (
              <Link
                to="/rewards"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A3823] border border-[#F2A900]/40 text-[#F2A900] text-xs font-semibold hover:border-[#F2A900] transition-colors"
                title="Your Eco Reward Points"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
                <span>{currentUser.ecoPoints} Points</span>
                <span className="bg-[#F2A900]/20 text-[#F2A900] px-1.5 py-0.5 rounded-full text-[10px]">
                  {currentUser.badgeLevel}
                </span>
              </Link>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#3E7C4A]/60">
                <div className="w-8 h-8 rounded-full bg-[#3E7C4A] text-[#FFF8E7] flex items-center justify-center font-bold text-xs border border-[#FFF8E7]/30">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden xl:block text-left text-xs">
                  <div className="font-semibold text-white truncate max-w-[110px]">{currentUser.fullName}</div>
                  <div className="text-[10px] text-[#F2A900] capitalize">{currentUser.role}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-[#FFF8E7]/70 hover:text-red-400 hover:bg-[#1A3823] rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3E7C4A] text-white text-xs font-semibold hover:bg-[#32643B] transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            {currentUser && (
              <Link
                to="/rewards"
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1A3823] border border-[#F2A900]/40 text-[#F2A900] text-[11px] font-semibold"
              >
                <Sparkles className="w-3 h-3 text-[#F2A900]" />
                <span>{currentUser.ecoPoints} pt</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#FFF8E7] hover:bg-[#3E7C4A] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1A3823] border-t border-[#3E7C4A]/40 px-4 pt-3 pb-6 space-y-1">
          {navLinks.map(link => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-[#3E7C4A] text-white font-semibold' : 'text-[#FFF8E7]/90 hover:bg-[#3E7C4A]/30'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-[#3E7C4A]/40 flex justify-between items-center">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <div className="text-xs">
                  <div className="font-semibold text-white">{currentUser.fullName}</div>
                  <div className="text-[10px] text-[#F2A900] capitalize">{currentUser.role} • {currentUser.badgeLevel}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-900/60 text-red-200 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-lg bg-[#3E7C4A] text-white text-sm font-semibold"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
