import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Calendar, PhoneCall, Award, Layers } from 'lucide-react';
import { ServiceOffering } from '../types';
import { api } from '../services/api';

interface ServiceDetailProps {
  onRequestCallback: () => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ onRequestCallback }) => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceOffering | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        setNotFound(false);
        const res = await api.get(`/services/${slug}`);
        if (res.data.success && res.data.data) {
          setService(res.data.data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchService();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-platinum-400">
        Loading mandate specifications...
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4 space-y-4">
        <h2 className="text-2xl font-bold font-luxury text-platinum-100">Mandate Not Found</h2>
        <p className="text-sm text-platinum-400">
          The requested advisory practice could not be located in our ledger.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center space-x-2 text-gold-400 text-xs uppercase tracking-wider font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Advisory Practices</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 text-platinum-100 space-y-20">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <Link
          to="/services"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-platinum-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Mandates</span>
        </Link>
      </div>

      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-5">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs uppercase tracking-widest font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>{service.category}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-luxury text-platinum-100 leading-tight">
          {service.title}
        </h1>

        <p className="text-base sm:text-lg text-gold-500 font-medium max-w-2xl mx-auto">
          {service.tagline}
        </p>

        <div className="pt-2">
          <span className="inline-block px-4 py-1.5 rounded-full bg-obsidian-900 border border-gold-500/30 text-xs font-mono text-platinum-300">
            Mandate Threshold: <strong className="text-gold-400">{service.minimumThreshold}</strong>
          </span>
        </div>
      </section>

      {/* Content Details */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-obsidian-900 border border-gold-500/30 rounded-3xl p-8 sm:p-12 shadow-luxury space-y-10">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-gold-400 font-bold block mb-3 font-luxury">
              Mandate Philosophy & Execution
            </h2>
            <p className="text-sm sm:text-base text-platinum-300 leading-relaxed">
              {service.detailedOverview}
            </p>
          </div>

          <div className="pt-6 border-t border-obsidian-800">
            <h2 className="text-xs uppercase tracking-widest text-gold-400 font-bold block mb-6 font-luxury">
              Key Fiduciary Deliverables
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.keyDeliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 flex items-start space-x-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-platinum-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-obsidian-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs text-platinum-400">
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 text-gold-500 mx-auto" />
              <div className="font-bold text-platinum-200">Segregated Accounts</div>
              <div>Zero pooled or synthetic liquidity exposure</div>
            </div>
            <div className="space-y-1">
              <Award className="w-5 h-5 text-gold-500 mx-auto" />
              <div className="font-bold text-platinum-200">Discretionary IPS</div>
              <div>Custom investment policy statement governance</div>
            </div>
            <div className="space-y-1">
              <Calendar className="w-5 h-5 text-gold-500 mx-auto" />
              <div className="font-bold text-platinum-200">Quarterly Audits</div>
              <div>Independent custodian performance reconciliation</div>
            </div>
          </div>

          {/* Action Box */}
          <div className="pt-8 border-t border-obsidian-800 bg-obsidian-950/60 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold font-luxury text-platinum-100">
                Engage A Managing Partner
              </h3>
              <p className="text-xs text-platinum-400 mt-1">
                Discuss custom structuring for {service.title} under strict confidentiality.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={onRequestCallback}
                className="px-4 py-2.5 rounded-xl border border-gold-500/40 text-gold-400 hover:text-gold-300 text-xs uppercase tracking-wider font-semibold"
              >
                Direct Callback
              </button>

              <Link
                to="/contact"
                className="px-6 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 text-xs uppercase tracking-wider font-bold hover:shadow-gold-glow transition-all"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
