import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  Briefcase,
  Layers,
  ArrowRight,
  PhoneCall,
  Calendar,
  CheckCircle,
  Building2,
  Clock,
  Award,
} from 'lucide-react';
import { WealthCalculator } from '../components/WealthCalculator';
import { ServiceOffering } from '../types';
import { api } from '../services/api';

interface HomeProps {
  onRequestCallback: () => void;
}

export const Home: React.FC<HomeProps> = ({ onRequestCallback }) => {
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success && res.data.data) {
          setServices(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching services', err);
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-gold-400" />;
      case 'Shield':
        return <ShieldCheck className="w-6 h-6 text-gold-400" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-gold-400" />;
      case 'Layers':
      default:
        return <Layers className="w-6 h-6 text-gold-400" />;
    }
  };

  return (
    <div className="space-y-0 text-platinum-100">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-24 overflow-hidden border-b border-gold-500/15">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-obsidian-800/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-8 z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs uppercase tracking-widest font-semibold animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping mr-1" />
            <span>Fiduciary Discretionary Mandates • Single & Multi-Family Offices</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-luxury tracking-tight leading-[1.1] text-platinum-100">
            Multi-Generational Capital Preservation &{' '}
            <span className="text-gold-gradient">Bespoke Wealth Advisory</span>
          </h1>

          <p className="text-base sm:text-lg text-platinum-300 max-w-2xl mx-auto leading-relaxed font-light">
            MFEF Private Wealth Partners structures institutional-grade asset allocation, cross-border family governance, and discreet private market placements for ultra-high-net-worth clients globally.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs uppercase tracking-widest font-bold hover:shadow-gold-glow hover:brightness-105 transition-all flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Private Consultation</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <button
              onClick={onRequestCallback}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-gold-500/40 text-gold-400 hover:text-gold-300 hover:border-gold-400 bg-obsidian-900/60 text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-gold-400" />
              <span>Request Direct Advisor Callback</span>
            </button>
          </div>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-xs text-platinum-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-gold-500" />
              <span>Absolute Fiduciary Mandate</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-gold-500" />
              <span>Custody with Tier-1 Swiss & US Custodians</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-gold-500" />
              <span>Confidentiality Agreements (NDA)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Metrics Ticker */}
      <section className="bg-obsidian-950 border-b border-obsidian-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold font-luxury text-gold-gradient">
                $3.8B+
              </div>
              <div className="text-xs uppercase tracking-wider text-platinum-400">
                Assets Under Advisement
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold font-luxury text-gold-gradient">
                99.4%
              </div>
              <div className="text-xs uppercase tracking-wider text-platinum-400">
                Client Mandate Retention
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold font-luxury text-gold-gradient">
                24 Yrs
              </div>
              <div className="text-xs uppercase tracking-wider text-platinum-400">
                Avg. Partner Experience
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold font-luxury text-gold-gradient">
                18
              </div>
              <div className="text-xs uppercase tracking-wider text-platinum-400">
                Global Jurisdictions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Advisory Mandates */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
              Discretionary Practice Areas
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-luxury text-platinum-100">
              Institutional Mandates Tailored to Private Capital
            </h2>
            <p className="text-sm text-platinum-400 leading-relaxed">
              Every portfolio mandate is individually constructed, segregated from proprietary balance sheets, and monitored against custom benchmark metrics.
            </p>
          </div>

          <div>
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-gold-400 hover:text-gold-300 pb-1 border-b border-gold-500/40 transition-colors"
            >
              <span>Explore All Mandates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoadingServices ? (
            <div className="col-span-2 text-center py-12 text-platinum-500">
              Loading advisory mandates from ledger...
            </div>
          ) : (
            services.map((srv) => (
              <div
                key={srv.slug}
                className="group relative bg-obsidian-900 border border-obsidian-800 hover:border-gold-500/50 rounded-2xl p-8 transition-all duration-300 shadow-luxury hover:shadow-gold-glow flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-xl bg-obsidian-850 border border-gold-500/20 group-hover:border-gold-500/50 transition-colors">
                      {getServiceIcon(srv.iconName)}
                    </div>
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-obsidian-950 border border-obsidian-700 text-gold-400">
                      {srv.minimumThreshold}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-luxury text-platinum-100 group-hover:text-gold-300 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-gold-500/90 font-medium mt-1">
                      {srv.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-platinum-300 leading-relaxed">
                    {srv.summary}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-obsidian-800 text-xs text-platinum-400">
                    {srv.keyDeliverables.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-obsidian-800 flex items-center justify-between">
                  <Link
                    to={`/services/${srv.slug}`}
                    className="text-xs uppercase tracking-wider font-bold text-platinum-300 hover:text-gold-400 flex items-center space-x-1 transition-colors"
                  >
                    <span>View Mandate Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/contact"
                    className="px-3.5 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500 hover:text-obsidian-950 border border-gold-500/30 text-gold-400 text-xs font-semibold transition-all"
                  >
                    Schedule Review
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* The 4-Stage Advisory Methodology */}
      <section className="py-24 bg-obsidian-950 border-y border-obsidian-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
              The Engagement Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-luxury text-platinum-100">
              The MFEF Fiduciary Protocol
            </h2>
            <p className="text-sm text-platinum-400">
              A disciplined, institutional framework designed to preserve capital through market volatility and intergenerational succession.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Confidential Discovery',
                desc: 'Exhaustive balance sheet mapping, tax domicile analysis, liquidity requirements, and multi-generational family goals under strict NDA.',
              },
              {
                step: '02',
                title: 'Strategic Architecture',
                desc: 'Formulation of bespoke Investment Policy Statements (IPS), trust governance models, and uncorrelated asset allocations.',
              },
              {
                step: '03',
                title: 'Discreet Execution',
                desc: 'Institutional trade implementation through segregated Tier-1 custodial vaults with zero proprietary conflicts.',
              },
              {
                step: '04',
                title: 'Governance & Succession',
                desc: 'Quarterly partner reviews, consolidated balance sheet reporting, and next-generation fiduciary leadership mentorship.',
              },
            ].map((st) => (
              <div
                key={st.step}
                className="p-6 rounded-2xl bg-obsidian-900 border border-obsidian-800 hover:border-gold-500/40 transition-all space-y-3 relative group"
              >
                <div className="text-2xl font-luxury font-bold text-gold-500/40 group-hover:text-gold-400 transition-colors">
                  {st.step}
                </div>
                <h3 className="text-base font-bold font-luxury text-platinum-100">
                  {st.title}
                </h3>
                <p className="text-xs text-platinum-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Wealth Modeling Calculator */}
      <WealthCalculator />

      {/* VIP Concierge Banner */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-obsidian-900 border-t border-gold-500/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-400 font-luxury text-xl">
            ⚜
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold font-luxury text-platinum-100">
            Commence A Fiduciary Dialogue
          </h2>

          <p className="text-sm text-platinum-300 max-w-xl mx-auto leading-relaxed">
            Connect directly with an MFEF managing partner in London, New York, or via our encrypted digital concierge desk.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 text-xs uppercase tracking-widest font-bold hover:shadow-gold-glow transition-all"
            >
              Request Formal Advisory Review
            </Link>

            <button
              onClick={onRequestCallback}
              className="px-8 py-3.5 rounded-xl border border-gold-500/30 text-gold-400 hover:text-gold-300 bg-obsidian-850 text-xs uppercase tracking-widest font-semibold transition-all"
            >
              Direct Partner Callback
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
