import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneCall, Calendar, ShieldCheck, Menu, X, ArrowUpRight, Lock, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onRequestCallback: () => void;
  onTrackInquiry: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestCallback, onTrackInquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Advisory Services', path: '/services' },
    { name: 'Client Credentials', path: '/credentials' },
    { name: 'Concierge Desk', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-obsidian-950/85 border-b border-gold-500/15 transition-all">
      {/* Top institutional ticker strip */}
      <div className="bg-obsidian-900 border-b border-obsidian-800/80 px-4 sm:px-8 py-1.5 text-xs text-platinum-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-gold-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Fiduciary Private Wealth Advisory
            </span>
            <span className="hidden md:inline text-platinum-500">|</span>
            <span className="hidden md:inline">London • New York • Zurich • Singapore</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onTrackInquiry}
              className="text-platinum-300 hover:text-gold-400 transition-colors flex items-center"
            >
              <span>Track Consultation</span>
            </button>
            <span className="text-platinum-600">|</span>
            <a
              href="https://wa.me/18004926333?text=Confidential%20Inquiry%20to%20MFEF%20Private%20Wealth"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">VIP WhatsApp Concierge</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
            <span className="text-platinum-600">|</span>
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="text-gold-400 hover:text-gold-300 font-medium flex items-center"
              >
                <Lock className="w-3 h-3 mr-1" />
                <span>Advisor CRM ({user?.name.split(' ')[0]})</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-platinum-400 hover:text-platinum-200 transition-colors flex items-center"
              >
                <Lock className="w-3 h-3 mr-1" />
                <span>Partner Portal</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Crest */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400/20 via-obsidian-850 to-gold-600/30 border border-gold-500/40 flex items-center justify-center text-gold-400 font-luxury font-bold text-xl shadow-luxury group-hover:border-gold-400 transition-colors">
            ⚜
          </div>
          <div className="flex flex-col">
            <span className="font-luxury text-lg sm:text-xl font-bold tracking-wider text-platinum-100 group-hover:text-gold-300 transition-colors">
              MFEF
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gold-500 font-medium">
              Private Wealth Partners
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm tracking-wide font-medium transition-colors relative py-1 ${
                isActive(link.path)
                  ? 'text-gold-400'
                  : 'text-platinum-300 hover:text-platinum-100'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onRequestCallback}
            className="px-4 py-2.5 rounded-lg border border-gold-500/30 text-gold-400 hover:text-gold-300 hover:border-gold-500/60 bg-obsidian-850/60 text-xs tracking-wider uppercase font-semibold transition-all flex items-center"
          >
            <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-gold-400" />
            <span>Direct Callback</span>
          </button>

          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs tracking-wider uppercase font-bold hover:shadow-gold-glow hover:brightness-105 transition-all flex items-center"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span>Consultation</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={onRequestCallback}
            className="sm:hidden p-2 rounded-lg border border-gold-500/30 text-gold-400"
            title="Request Advisor Callback"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-platinum-300 hover:text-platinum-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile slide drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-obsidian-950/98 border-b border-gold-500/20 px-6 py-6 animate-fade-in">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-1.5 ${
                  isActive(link.path) ? 'text-gold-400 font-semibold' : 'text-platinum-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-obsidian-800 flex flex-col space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRequestCallback();
                }}
                className="w-full py-3 rounded-lg border border-gold-500/30 text-gold-400 text-center text-sm font-semibold uppercase tracking-wider flex items-center justify-center"
              >
                <PhoneCall className="w-4 h-4 mr-2" />
                <span>Request Advisor Callback</span>
              </button>

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-lg bg-gold-500 text-obsidian-950 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span>Schedule Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
