import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Briefcase, Layers, ArrowRight, CheckCircle2, Filter } from 'lucide-react';
import { ServiceOffering } from '../types';
import { api } from '../services/api';

export const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceOffering[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success && res.data.data) {
          setServices(res.data.data);
          setFilteredServices(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching services', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'ALL') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((s) => s.category.toUpperCase().includes(category)));
    }
  };

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
    <div className="py-16 text-platinum-100 space-y-20">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
          Discretionary & Advisory Practices
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-luxury text-platinum-100">
          Institutional Fiduciary <span className="text-gold-gradient">Mandates</span>
        </h1>
        <p className="text-sm sm:text-base text-platinum-300 max-w-2xl mx-auto leading-relaxed">
          Explore our core advisory practices engineered exclusively for qualified high-net-worth families, enterprise founders, and sovereign family balance sheets.
        </p>

        {/* Category Filters */}
        <div className="pt-6 flex flex-wrap justify-center gap-2">
          {[
            { label: 'All Mandates', value: 'ALL' },
            { label: 'Wealth Management', value: 'WEALTH' },
            { label: 'Family Office', value: 'FAMILY' },
            { label: 'Corporate Advisory', value: 'CORPORATE' },
            { label: 'Alternative Assets', value: 'ALTERNATIVE' },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                selectedCategory === cat.value
                  ? 'bg-gold-500 text-obsidian-950 shadow-gold-glow'
                  : 'bg-obsidian-900 border border-obsidian-800 text-platinum-400 hover:text-platinum-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Services List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        {isLoading ? (
          <div className="text-center py-20 text-platinum-500">
            Querying advisory practices...
          </div>
        ) : (
          <div className="space-y-12">
            {filteredServices.map((srv) => (
              <div
                key={srv.slug}
                className="bg-obsidian-900 border border-obsidian-800 hover:border-gold-500/40 rounded-3xl p-8 sm:p-12 shadow-luxury transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-obsidian-850 border border-gold-500/30 text-gold-400">
                      {getServiceIcon(srv.iconName)}
                    </div>
                    <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold">
                      {srv.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold font-luxury text-platinum-100">
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-platinum-300 leading-relaxed">
                    {srv.detailedOverview}
                  </p>

                  <div className="pt-2">
                    <span className="text-xs uppercase tracking-wider text-platinum-400 font-bold block mb-2">
                      Core Institutional Deliverables:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-platinum-300">
                      {srv.keyDeliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-obsidian-950 border border-gold-500/25 rounded-2xl p-6 sm:p-8 space-y-5 text-center flex flex-col justify-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-platinum-400 block mb-1">
                      Minimum Qualifying Mandate
                    </span>
                    <span className="font-luxury text-xl font-bold text-gold-400 block">
                      {srv.minimumThreshold}
                    </span>
                  </div>

                  <p className="text-xs text-platinum-400 leading-relaxed">
                    Individually managed mandate with dedicated senior partner oversight and quarterly balance sheet audit.
                  </p>

                  <div className="space-y-2 pt-2">
                    <Link
                      to={`/services/${srv.slug}`}
                      className="w-full py-2.5 rounded-xl border border-gold-500/40 text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Read Mandate Specification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to="/contact"
                      className="w-full py-2.5 rounded-xl bg-gold-500 text-obsidian-950 text-xs uppercase tracking-wider font-bold hover:shadow-gold-glow transition-all block text-center"
                    >
                      Schedule Discovery Call
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
