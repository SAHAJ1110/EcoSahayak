import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Leaf, ShieldAlert, UserCheck, Lock, Mail, Phone, User, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await register(fullName, email, phone, role);
      } else {
        await login(email, role);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoRole: UserRole) => {
    setLoading(true);
    await login(demoEmail, demoRole);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#3E7C4A]/20 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#3E7C4A] text-white flex items-center justify-center mx-auto shadow-md">
            <Leaf className="w-6 h-6 text-[#F2A900]" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-[#244D30]">
            {isRegistering ? 'Create Citizen Account' : 'Welcome to EcoSahayak'}
          </h2>
          <p className="text-xs text-[#29332B]/70 font-sans">
            AI-Powered Community Problem Reporter
          </p>
        </div>

        {/* 1-Click Quick Demo Persona Selector */}
        <div className="bg-[#FFF8E7] p-4 rounded-2xl border border-[#F2A900]/40 space-y-2 text-xs font-sans">
          <div className="font-heading font-bold text-[#244D30] text-[11px] uppercase tracking-wide">
            ⚡ Quick 1-Click Presentation Personas
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('aarav.sharma@example.in', 'citizen')}
              className="p-2 rounded-xl bg-white border border-[#3E7C4A]/30 text-[#244D30] font-semibold hover:bg-[#EAF2E8] transition-colors text-left"
            >
              <div className="flex items-center gap-1 font-heading font-bold">
                <UserCheck className="w-3.5 h-3.5 text-[#3E7C4A]" />
                <span>Citizen</span>
              </div>
              <div className="text-[10px] text-gray-500 truncate">Aarav Sharma</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin.rajesh@municipal.gov.in', 'admin')}
              className="p-2 rounded-xl bg-white border border-[#F2A900]/40 text-[#244D30] font-semibold hover:bg-[#FFF8E7] transition-colors text-left"
            >
              <div className="flex items-center gap-1 font-heading font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F2A900]" />
                <span>Nodal Officer</span>
              </div>
              <div className="text-[10px] text-gray-500 truncate">Rajesh Verma</div>
            </button>
          </div>
        </div>

        {/* Standard Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {isRegistering && (
            <div>
              <label className="block font-bold text-[#244D30] uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#3E7C4A]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#244D30] uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.in"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#3E7C4A]"
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block font-bold text-[#244D30] uppercase mb-1">Mobile Phone (India)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#3E7C4A]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#244D30] uppercase mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-2.5 rounded-xl border border-gray-300 font-medium"
            >
              <option value="citizen">Citizen (Community Reporter)</option>
              <option value="admin">Municipal Officer (Admin Dispatcher)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#3E7C4A] text-white font-heading font-bold text-sm hover:bg-[#32643B] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>{isRegistering ? 'Register Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-[#3E7C4A] font-semibold hover:underline"
          >
            {isRegistering
              ? 'Already registered? Sign in here'
              : 'New citizen? Create an account for 50 welcome points'}
          </button>
        </div>
      </div>
    </div>
  );
};
