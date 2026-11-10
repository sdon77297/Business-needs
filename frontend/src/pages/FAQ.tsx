import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the qualifying minimum capital requirement to engage MFEF?',
      a: 'Our core Discretionary Private Wealth mandates typically commence at $2,000,000 in liquid investable capital. For Family Office Advisory & Cross-Border Succession, the minimum balance sheet threshold is $10,000,000. Corporate Debt Syndication and Capital Advisory are evaluated on an enterprise scale exceeding $5,000,000.',
    },
    {
      q: 'How does MFEF maintain independence from investment banking conflicts?',
      a: 'MFEF operates exclusively as an independent, fee-only fiduciary advisor. We do not underwrite proprietary investment products, engage in market-making, or accept commissions from third-party fund managers. Our revenue is tied solely to clear, agreed-upon advisory percentages, perfectly aligning our incentives with preserving your capital.',
    },
    {
      q: 'Where are my assets held, and does MFEF have custody?',
      a: 'MFEF never takes physical custody of client assets. All capital remains held in your legal name (or in the name of your family trust/holding entity) at institutional Tier-1 custodian banks such as BNY Mellon, J.P. Morgan, or UBS. MFEF is granted limited trading power of attorney to execute allocations strictly according to your Investment Policy Statement (IPS).',
    },
    {
      q: 'Can MFEF coordinate with our existing family attorneys and tax accountants?',
      a: 'Yes. In fact, multi-disciplinary collaboration is central to our family office governance methodology. Our senior partners work side-by-side with your existing trust attorneys, offshore tax specialists, and corporate accountants to ensure seamless structural cohesion.',
    },
    {
      q: 'How does the confidential consultation booking process work?',
      a: 'Upon submitting a consultation request via our online concierge desk, your preliminary parameters are reviewed directly by a Managing Partner. We verify mutual fit and schedule a secure encrypted video conference or in-person meeting in our Mayfair or Manhattan suites. Every engagement begins under a formal mutual Non-Disclosure Agreement (NDA).',
    },
    {
      q: 'What is the difference between an immediate callback and a scheduled consultation?',
      a: 'The Direct Advisor Callback connects you directly via telephone within 30 minutes for urgent advisory or market inquiries. A Scheduled Consultation is a formal, comprehensive discovery session where we review your portfolio parameters and draft preliminary Investment Policy Statement considerations.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-16 text-platinum-100 space-y-16">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
          Institutional Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-luxury text-platinum-100">
          Frequently Answered <span className="text-gold-gradient">Questions</span>
        </h1>
        <p className="text-sm sm:text-base text-platinum-300 max-w-2xl mx-auto leading-relaxed">
          Transparent insights into our fiduciary standards, custodial arrangements, mandate thresholds, and confidential engagement protocol.
        </p>

        {/* Search Input */}
        <div className="pt-6 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-gold-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, e.g. custody, minimum, fees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-obsidian-900 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-xs text-platinum-100 placeholder:text-platinum-500"
            />
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-platinum-500 text-sm">
              No answers matched your query. Contact our concierge desk for tailored inquiries.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-obsidian-900 border border-obsidian-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between space-x-4 hover:bg-obsidian-850/60 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold font-luxury text-platinum-100">
                      {faq.q}
                    </span>
                    <span className="p-1 rounded-lg text-gold-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-platinum-300 leading-relaxed border-t border-obsidian-800/60 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Footer Support Banner */}
      <section className="text-center max-w-2xl mx-auto px-4 space-y-4">
        <h3 className="text-xl font-bold font-luxury text-platinum-100">
          Have An Unlisted Complex Scenario?
        </h3>
        <p className="text-xs text-platinum-400">
          Our senior partners are available to discuss cross-border structures, corporate liquidity, and dynastic trusts confidentially.
        </p>
        <Link
          to="/contact"
          className="inline-block px-6 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 text-xs uppercase tracking-widest font-bold hover:shadow-gold-glow transition-all"
        >
          Contact Managing Partner Desk
        </Link>
      </section>
    </div>
  );
};
