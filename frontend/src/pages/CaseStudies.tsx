import React from 'react';
import { ShieldCheck, CheckCircle2, TrendingUp, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CaseStudies: React.FC = () => {
  const cases = [
    {
      title: 'Dynastic Family Office: Multi-Jurisdictional Trust Governance',
      clientProfile: 'Third-Generation Industrial & Real Estate Family',
      assetScale: '$65,000,000 Total Net Worth',
      jurisdictions: 'United Kingdom, Switzerland, Singapore',
      challenge:
        'Succession impasse across 8 family beneficiaries with divergent liquidity demands, conflicting tax domiciles, and concentrated legacy commercial real estate exposure.',
      solution:
        'Architected a unified Family Constitution, partitioned holdings into dual discretionary trust vehicles, and executed a \$20M liquidity refinancing program to fund next-gen ventures without liquidating trophy real estate.',
      outcome:
        '100% beneficiary ratification, annual tax leakage reduced by ~18%, and a diversified multi-asset treasury yielding 6.4% net cash flow.',
    },
    {
      title: 'Enterprise Founder: Post-Acquisition Liquidity Mandate',
      clientProfile: 'Enterprise SaaS Founder post-NASDAQ liquidity event',
      assetScale: '$28,000,000 Investable Capital',
      jurisdictions: 'United States & Luxembourg',
      challenge:
        'Abrupt transition from active operating executive to managing substantial liquid cash in an inflationary environment, seeking zero proprietary bank lock-ups and absolute capital protection.',
      solution:
        'Constructed a bespoke all-weather portfolio utilizing short-duration sovereign paper, inflation-linked swaps, and direct private credit secondaries, accompanied by an Irrevocable Grantor Trust structure.',
      outcome:
        'Shielded capital through significant public equity drawdowns with a 2.1% max historical drawdown and zero default exposure.',
    },
    {
      title: 'Commercial Group: Corporate Debt Syndication & Balance Sheet Reorganization',
      clientProfile: 'Mid-Market Logistics & Cold-Chain Operator',
      assetScale: '$42,000,000 Enterprise Debt Refinancing',
      jurisdictions: 'North America',
      challenge:
        'Restrictive covenant terms on existing bank credit lines limiting fleet expansion and cross-border acquisition of regional competitors.',
      solution:
        'Syndicated a senior secured asset-backed credit facility via institutional private debt funds, replacing covenant-heavy bank debt with flexible payment-in-kind (PIK) options.',
      outcome:
        'Lowered blended cost of capital by 140 bps, unlocked \$12M in operating liquidity, and facilitated two accretive acquisitions within 18 months.',
    },
  ];

  return (
    <div className="py-16 text-platinum-100 space-y-20">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
          Client Credentials & Anonymized Profiles
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-luxury text-platinum-100">
          Proven Stewardship in <span className="text-gold-gradient">Complex Situations</span>
        </h1>
        <p className="text-sm sm:text-base text-platinum-300 max-w-2xl mx-auto leading-relaxed">
          In adherence with our strict fiduciary client confidentiality agreements, all identifying family and corporate names are anonymized. The structural solutions and financial metrics represent real-world client engagements.
        </p>
      </section>

      {/* Case Studies List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {cases.map((c, idx) => (
          <div
            key={idx}
            className="bg-obsidian-900 border border-obsidian-800 hover:border-gold-500/40 rounded-3xl p-8 sm:p-12 shadow-luxury transition-all space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-obsidian-800">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block mb-1">
                  Case Profile 0{idx + 1}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-luxury text-platinum-100">
                  {c.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-obsidian-950 border border-gold-500/30 text-xs font-mono text-gold-400">
                  {c.assetScale}
                </span>
                <span className="px-3 py-1 rounded-full bg-obsidian-950 border border-obsidian-800 text-xs text-platinum-400">
                  {c.jurisdictions}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800/80 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-platinum-400 font-bold block">
                  The Client Situation
                </span>
                <p className="text-xs sm:text-sm text-platinum-300 leading-relaxed">
                  {c.challenge}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800/80 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-gold-500 font-bold block">
                  The MFEF Fiduciary Solution
                </span>
                <p className="text-xs sm:text-sm text-platinum-300 leading-relaxed">
                  {c.solution}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-obsidian-950 border border-gold-500/20 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Preserved Outcome
                </span>
                <p className="text-xs sm:text-sm text-platinum-200 leading-relaxed font-medium">
                  {c.outcome}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Action banner */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-luxury text-platinum-100">
          Request A Confidential Case Analysis
        </h2>
        <p className="text-sm text-platinum-400">
          Schedule an initial review of your family or corporate balance sheet with a managing director.
        </p>
        <div>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gold-500 text-obsidian-950 text-xs uppercase tracking-widest font-bold hover:shadow-gold-glow transition-all"
          >
            <span>Initiate Discovery Review</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
