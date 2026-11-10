import React from 'react';
import { ShieldCheck, Award, Lock, Building, Scale, ArrowRight, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="py-16 text-platinum-100 space-y-24">
      {/* Page Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
          Institutional Heritage & Governance
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-luxury text-platinum-100">
          Upholding An Uncompromising{' '}
          <span className="text-gold-gradient">Fiduciary Standard</span>
        </h1>
        <p className="text-sm sm:text-base text-platinum-300 max-w-2xl mx-auto leading-relaxed">
          MFEF Private Wealth Partners was founded on a singular premise: to liberate ultra-high-net-worth families and institutions from the conflicting incentives of traditional investment banking conglomerates.
        </p>
      </section>

      {/* Heritage & Fiduciary Oath */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold-400 font-semibold">
              <Scale className="w-4 h-4" />
              <span>Independent & Conflict-Free</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-luxury text-platinum-100">
              True Independence. Zero Proprietary Products.
            </h2>

            <p className="text-sm text-platinum-300 leading-relaxed">
              Unlike commercial institutions that cross-sell proprietary synthetic products or earn hidden commissions from underwritten syndicates, MFEF acts solely as an independent fee-only fiduciary advisor.
            </p>

            <p className="text-sm text-platinum-300 leading-relaxed">
              Every mandate we execute is bound by legal fiduciary duty: our partners sit on your side of the table, orchestrating custodians, tax attorneys, private equity sponsors, and investment banks to protect your capital.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-800">
                <ShieldCheck className="w-5 h-5 text-gold-400 mb-2" />
                <h4 className="text-xs uppercase font-bold text-platinum-100">Fee-Only Fiduciary</h4>
                <p className="text-[11px] text-platinum-400 mt-1">No commissions, rebate sharing, or hidden distribution spreads.</p>
              </div>

              <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-800">
                <Lock className="w-5 h-5 text-gold-400 mb-2" />
                <h4 className="text-xs uppercase font-bold text-platinum-100">Segregated Custody</h4>
                <p className="text-[11px] text-platinum-400 mt-1">All assets remain in client-named accounts at Tier-1 global institutions.</p>
              </div>
            </div>
          </div>

          {/* Visual Fiduciary Seal Box */}
          <div className="bg-gradient-to-br from-obsidian-850 via-obsidian-900 to-obsidian-950 border border-gold-500/30 rounded-3xl p-8 sm:p-12 shadow-luxury space-y-6 relative">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/40 flex items-center justify-center text-gold-400 text-3xl font-luxury">
              ⚜
            </div>

            <blockquote className="text-base sm:text-lg font-serif italic text-platinum-200 leading-relaxed">
              "Capital accumulated over decades of entrepreneurship can be eroded in months of careless succession. Our duty is not to gamble on short-term market euphoria, but to ensure your family's balance sheet endures for a century."
            </blockquote>

            <div className="pt-4 border-t border-obsidian-800">
              <div className="font-luxury font-bold text-gold-400 text-sm">
                Alexander Sterling, CFA
              </div>
              <div className="text-xs text-platinum-400">
                Senior Managing Partner & Chief Investment Officer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Senior Partners & Leadership */}
      <section className="py-20 bg-obsidian-950 border-y border-obsidian-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
              Managing Directorate
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-luxury text-platinum-100">
              Senior Advisory Leadership
            </h2>
            <p className="text-sm text-platinum-400">
              Direct access to seasoned market veterans with decades of institutional capital stewardship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alexander Sterling, CFA',
                title: 'Senior Managing Partner & CIO',
                bio: 'Former Managing Director of Global Macro at Morgan Stanley. Over 28 years directing multi-asset discretionary portfolios and hedging sovereign macro risks.',
                credentials: 'CFA Charterholder • MA Economics, Oxford University',
                location: 'London & Zurich',
              },
              {
                name: 'Eleanor Vance, TEP',
                title: 'Head of Family Office & Succession',
                bio: 'Specialist in cross-border wealth governance, dynastic trust structuring, and philanthropic endowments across UK, EU, and offshore common-law trusts.',
                credentials: 'Trust and Estate Practitioner (TEP) • LLM International Tax, Harvard',
                location: 'London & Geneva',
              },
              {
                name: 'Marcus Kensington',
                title: 'Managing Director - Private Credit & Real Assets',
                bio: '22 years structuring senior secured corporate credit, mezzanine recapitalizations, and prime commercial real estate syndications for family offices.',
                credentials: 'MBA Wharton • Senior Member of Institutional Risk Committee',
                location: 'New York',
              },
            ].map((partner, idx) => (
              <div
                key={idx}
                className="bg-obsidian-900 border border-obsidian-800 hover:border-gold-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-luxury transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:border-gold-500 transition-colors">
                  <UserCheck className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold font-luxury text-platinum-100 group-hover:text-gold-300 transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-gold-500 font-medium">{partner.title}</p>
                </div>

                <p className="text-xs text-platinum-300 leading-relaxed">{partner.bio}</p>

                <div className="pt-4 border-t border-obsidian-800 space-y-1 text-[11px] text-platinum-400">
                  <div className="font-semibold text-platinum-300">{partner.credentials}</div>
                  <div className="text-gold-400/80">{partner.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custody Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-obsidian-900 border border-gold-500/25 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
              Custody & Asset Protection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-luxury text-platinum-100">
              Institutional Segregation of Client Assets
            </h2>
            <p className="text-sm text-platinum-400 leading-relaxed">
              MFEF Private Wealth Partners never takes direct possession or physical custody of client liquid capital. All client funds reside exclusively within segregated accounts at globally licensed Tier-1 depository banks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-obsidian-800">
            <div className="space-y-2">
              <Building className="w-5 h-5 text-gold-400" />
              <h4 className="text-sm font-bold text-platinum-100">Custodian Flexibility</h4>
              <p className="text-xs text-platinum-400">Clients may select or maintain relationships with premier global custodians including BNY Mellon, UBS, and J.P. Morgan.</p>
            </div>

            <div className="space-y-2">
              <Award className="w-5 h-5 text-gold-400" />
              <h4 className="text-sm font-bold text-platinum-100">Limited Power of Attorney</h4>
              <p className="text-xs text-platinum-400">MFEF is granted limited discretionary trading authority strictly to execute agreed-upon Investment Policy Statements.</p>
            </div>

            <div className="space-y-2">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
              <h4 className="text-sm font-bold text-platinum-100">Independent Auditing</h4>
              <p className="text-xs text-platinum-400">Quarterly reconciliation and annual compliance reviews conducted by international Big-4 audit firms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-luxury text-platinum-100">
          Meet With An MFEF Senior Partner
        </h2>
        <p className="text-sm text-platinum-400">
          We invite qualified families and enterprise founders to schedule a confidential discovery session.
        </p>
        <div>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gold-500 text-obsidian-950 text-xs uppercase tracking-widest font-bold hover:shadow-gold-glow transition-all"
          >
            <span>Request Confidential Meeting</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
