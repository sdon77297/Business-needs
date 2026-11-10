import React from 'react';
import { ShieldCheck, Lock, FileText, Scale } from 'lucide-react';

export const Legal: React.FC = () => {
  return (
    <div className="py-16 text-platinum-100 space-y-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
          Compliance & Regulatory Governance
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-luxury text-platinum-100">
          Terms of Engagement & <span className="text-gold-gradient">Regulatory Disclosures</span>
        </h1>
        <p className="text-xs sm:text-sm text-platinum-400 max-w-xl mx-auto leading-relaxed">
          Comprehensive compliance framework, fiduciary legal duties, client privacy protocols, and regulatory oversight standards.
        </p>
      </section>

      {/* Sections Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Section 1 */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center space-x-3 text-gold-400">
            <Scale className="w-5 h-5" />
            <h2 className="text-base font-bold font-luxury text-platinum-100">
              1. Regulatory Oversight & Fiduciary Standard
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-platinum-300 leading-relaxed">
            MFEF Private Wealth Partners operates as an independent discretionary wealth advisory firm. All advisory recommendations, investment policies, and portfolio mandates are rendered in strict adherence to our legal fiduciary obligations. We are legally bound to act solely in the best interests of our client principals at all times, with zero acceptance of third-party referral kickbacks, distributor retrocessions, or proprietary product syndications.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center space-x-3 text-gold-400">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-base font-bold font-luxury text-platinum-100">
              2. Qualifying Investor Standard & Minimum Thresholds
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-platinum-300 leading-relaxed">
            Services described across this digital portal are intended strictly for Qualified Purchasers (as defined under Section 2(a)(51) of the US Investment Company Act of 1940) and Professional / Accredited Clients across the United Kingdom, European Economic Area, Switzerland, and Singapore. The minimum relationship threshold for discretionary asset management is \$2,000,000 USD in liquid assets.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center space-x-3 text-gold-400">
            <Lock className="w-5 h-5" />
            <h2 className="text-base font-bold font-luxury text-platinum-100">
              3. Client Privacy, Swiss Banking Secrecy & Data Encryption
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-platinum-300 leading-relaxed">
            In compliance with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and the Swiss Federal Act on Data Protection (FADP), all prospective consultation inquiries and balance sheet disclosures are encrypted with AES-256 bit protocols both in transit and at rest. MFEF does not share, monetize, or disclose client identity information to any third party except as strictly mandated by competent judicial court orders.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center space-x-3 text-gold-400">
            <FileText className="w-5 h-5" />
            <h2 className="text-base font-bold font-luxury text-platinum-100">
              4. Custodial Independence & Risk Disclosures
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-platinum-300 leading-relaxed">
            MFEF does not take direct physical custody of cash or securities. All capital remains securely deposited in the client’s legal name at Tier-1 independent custodian banks. All investment strategies involve risk of loss, including the possible loss of principal. Past capital preservation metrics and historical compounding models do not guarantee future performance.
          </p>
        </div>
      </section>
    </div>
  );
};
