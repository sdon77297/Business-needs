import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, MessageSquare, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onTrackInquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTrackInquiry }) => {
  return (
    <footer className="bg-obsidian-950 border-t border-gold-500/20 text-platinum-300 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-obsidian-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400/20 to-gold-600/30 border border-gold-500/40 flex items-center justify-center text-gold-400 font-luxury font-bold text-lg">
                ⚜
              </div>
              <div className="flex flex-col">
                <span className="font-luxury text-lg font-bold tracking-wider text-platinum-100">
                  MFEF
                </span>
                <span className="text-[9px] uppercase tracking-widest text-gold-500 font-medium">
                  Private Wealth Partners
                </span>
              </div>
            </Link>

            <p className="text-sm text-platinum-400 leading-relaxed max-w-sm">
              Dedicated to multi-generational capital preservation, discretionary portfolio management, and institutional family office governance for qualified high-net-worth families.
            </p>

            <div className="flex items-center space-x-3 text-xs text-gold-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict Fiduciary Standard of Care</span>
            </div>

            <div className="pt-2">
              <button
                onClick={onTrackInquiry}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-gold-500/30 text-gold-400 hover:text-gold-300 text-xs font-semibold bg-obsidian-900 transition-colors"
              >
                <span>Track Consultation Reference</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold font-luxury">
              The Firm
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-gold-300 transition-colors">
                  Founding Philosophy
                </Link>
              </li>
              <li>
                <Link to="/about#governance" className="hover:text-gold-300 transition-colors">
                  Fiduciary Governance
                </Link>
              </li>
              <li>
                <Link to="/credentials" className="hover:text-gold-300 transition-colors">
                  Client Case Profiles
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-300 transition-colors">
                  Institutional FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-300 transition-colors">
                  Direct Concierge Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Wealth Services */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold font-luxury">
              Advisory Mandates
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services/private-wealth-management" className="hover:text-gold-300 transition-colors">
                  Discretionary Wealth
                </Link>
              </li>
              <li>
                <Link to="/services/family-office-succession" className="hover:text-gold-300 transition-colors">
                  Family Office & Trust
                </Link>
              </li>
              <li>
                <Link to="/services/corporate-capital-advisory" className="hover:text-gold-300 transition-colors">
                  Corporate Advisory & Debt
                </Link>
              </li>
              <li>
                <Link to="/services/alternative-investments" className="hover:text-gold-300 transition-colors">
                  Alternative Assets & PE
                </Link>
              </li>
            </ul>
          </div>

          {/* Global Locations & Concierge */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold font-luxury">
              Private Concierge
            </h4>
            <div className="space-y-3 text-xs text-platinum-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>Mayfair Financial Tower, Suite 4400, London & New York</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="tel:+18004926333" className="hover:text-gold-300 transition-colors">
                  +1 (800) 492-MFEF
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="mailto:concierge@mfefwealth.com" className="hover:text-gold-300 transition-colors">
                  concierge@mfefwealth.com
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/18004926333?text=Confidential%20Inquiry%20to%20MFEF%20Private%20Wealth"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>VIP WhatsApp Direct</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimers & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-platinum-500">
          <p className="max-w-3xl leading-relaxed text-[11px]">
            <strong>Regulatory Disclosure:</strong> MFEF Private Wealth Partners operates as an independent fiduciary wealth advisory firm. Advisory services are provided strictly to qualified purchasers and accredited investors. Past performance is no guarantee of future results. Discretionary asset management is conducted in adherence with applicable fiduciary standards.
          </p>

          <div className="flex items-center space-x-4 shrink-0 text-xs">
            <Link to="/legal" className="hover:text-platinum-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/legal" className="hover:text-platinum-300 transition-colors">
              Terms & Compliance
            </Link>
            <span>•</span>
            <span>© {new Date().getFullYear()} MFEF</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
