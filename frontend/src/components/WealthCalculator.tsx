import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, ShieldCheck, TrendingUp, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WealthCalculator: React.FC = () => {
  const [initialCapital, setInitialCapital] = useState<number>(5000000); // $5M
  const [years, setYears] = useState<number>(20);
  const [strategy, setStrategy] = useState<'preservation' | 'balanced' | 'alpha'>('balanced');

  const strategyRates = {
    preservation: { rate: 0.055, label: 'Capital Preservation Mandate (5.5% Target Net Yield)' },
    balanced: { rate: 0.078, label: 'Balanced Growth & Governance (7.8% Target Net Yield)' },
    alpha: { rate: 0.105, label: 'Private Market Alpha & PE (10.5% Target Net Yield)' },
  };

  const calculation = useMemo(() => {
    const rate = strategyRates[strategy].rate;
    // Compound interest: A = P(1 + r)^t
    const futureValue = initialCapital * Math.pow(1 + rate, years);
    const wealthCreated = futureValue - initialCapital;
    const taxShieldEstimate = wealthCreated * 0.22; // Estimated structuring advantage

    return {
      futureValue: Math.round(futureValue),
      wealthCreated: Math.round(wealthCreated),
      taxShieldEstimate: Math.round(taxShieldEstimate),
    };
  }, [initialCapital, years, strategy]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="py-20 bg-obsidian-950 border-y border-obsidian-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Modeling</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-luxury text-platinum-100">
            Multi-Generational Wealth Projection
          </h2>
          <p className="text-sm text-platinum-400 mt-2">
            Simulate institutional asset compounding and cross-generational capital preservation across discretionary advisory mandates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-obsidian-900 border border-gold-500/30 rounded-2xl p-6 sm:p-8 shadow-luxury space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-wider text-platinum-300 font-semibold">
                  Initial Investable Capital
                </label>
                <span className="text-sm font-bold font-mono text-gold-400">
                  {formatCurrency(initialCapital)}
                </span>
              </div>
              <input
                type="range"
                min="1000000"
                max="50000000"
                step="1000000"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full accent-gold-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-platinum-500 mt-1 font-mono">
                <span>$1M</span>
                <span>$25M</span>
                <span>$50M+</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-wider text-platinum-300 font-semibold">
                  Generational Horizon
                </label>
                <span className="text-sm font-bold font-mono text-gold-400">
                  {years} Years
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-gold-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-platinum-500 mt-1 font-mono">
                <span>5 Yrs</span>
                <span>25 Yrs</span>
                <span>50 Yrs</span>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-platinum-300 font-semibold block mb-2">
                Strategic Mandate Profile
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(['preservation', 'balanced', 'alpha'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStrategy(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      strategy === key
                        ? 'border-gold-500 bg-gold-500/15 text-platinum-100 shadow-gold-glow'
                        : 'border-obsidian-800 bg-obsidian-950 text-platinum-400 hover:border-obsidian-700'
                    }`}
                  >
                    <div className="text-xs font-bold capitalize">{key}</div>
                    <div className="text-[11px] text-gold-400 mt-0.5">
                      {(strategyRates[key].rate * 100).toFixed(1)}% Net Target
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-obsidian-850 to-obsidian-900 border border-gold-500/40 rounded-2xl p-6 sm:p-8 shadow-luxury space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-800">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                Projected Portfolio Outcome
              </span>
              <span className="flex items-center text-xs text-platinum-400">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400 mr-1" />
                Fiduciary Model
              </span>
            </div>

            <div>
              <span className="text-xs text-platinum-400 block mb-1">
                Projected Capital at Year {years}
              </span>
              <div className="text-3xl sm:text-4xl font-bold font-luxury text-gold-gradient">
                {formatCurrency(calculation.futureValue)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-obsidian-800">
                <span className="text-[11px] uppercase tracking-wider text-platinum-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1 text-gold-400" />
                  Preserved Growth
                </span>
                <span className="text-base font-bold font-mono text-platinum-100 mt-1 block">
                  +{formatCurrency(calculation.wealthCreated)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-950 border border-obsidian-800">
                <span className="text-[11px] uppercase tracking-wider text-platinum-400 flex items-center">
                  <Percent className="w-3.5 h-3.5 mr-1 text-gold-400" />
                  Tax Shield Potential
                </span>
                <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
                  ~{formatCurrency(calculation.taxShieldEstimate)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/contact"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs uppercase tracking-wider font-bold hover:shadow-gold-glow transition-all flex items-center justify-center space-x-2"
              >
                <span>Structure This Mandate With A Partner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[10px] text-platinum-500 text-center mt-2">
                Hypothetical simulation based on historical asset allocation. Not a guaranteed return.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
