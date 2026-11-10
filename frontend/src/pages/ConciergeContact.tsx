import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Copy,
  MessageSquare,
  Clock,
  Video,
  Building,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const consultationFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please provide a valid business or personal email'),
  phone: z.string().min(7, 'Please provide a valid direct telephone number'),
  countryOrCity: z.string().min(2, 'City or primary residence is required'),
  estimatedPortfolioTier: z.enum(['$1M-$5M', '$5M-$20M', '$20M+', 'CONFIDENTIAL']),
  serviceOfInterest: z.string().min(1, 'Please select your area of inquiry'),
  preferredMode: z.enum(['IN_PERSON', 'SECURE_VIDEO', 'TELEPHONE']),
  preferredDate: z.string().optional(),
  preferredTimeSlot: z.string().optional(),
  message: z.string().max(2000).optional(),
});

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export const ConciergeContact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const { error } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      estimatedPortfolioTier: '$5M-$20M',
      serviceOfInterest: 'Discretionary Private Wealth Management',
      preferredMode: 'SECURE_VIDEO',
      preferredTimeSlot: '14:00 - 15:30 (Local Time)',
    },
  });

  const onSubmit = async (data: ConsultationFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await api.post('/inquiries/consultation', data);
      if (res.data.success) {
        setReferenceCode(res.data.referenceNumber);
        reset();
      }
    } catch (err: any) {
      error('Booking Error', err.message || 'Unable to register consultation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = () => {
    if (referenceCode) {
      navigator.clipboard.writeText(referenceCode);
    }
  };

  return (
    <div className="py-16 text-platinum-100 space-y-20">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
          Direct Advisory Concierge
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-luxury text-platinum-100">
          Initiate A Confidential <span className="text-gold-gradient">Fiduciary Review</span>
        </h1>
        <p className="text-sm sm:text-base text-platinum-300 max-w-2xl mx-auto leading-relaxed">
          Request a private consultation with an MFEF senior managing partner. Every consultation is executed under a mutual Non-Disclosure Agreement (NDA).
        </p>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Booking Form (7 Cols) */}
          <div className="lg:col-span-7 bg-obsidian-900 border border-gold-500/30 rounded-3xl p-6 sm:p-10 shadow-luxury">
            {referenceCode ? (
              <div className="text-center py-12 space-y-6 animate-fade-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/20 border border-gold-500/50 flex items-center justify-center text-gold-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-luxury text-platinum-100">
                    Consultation Mandate Registered
                  </h3>
                  <p className="text-sm text-platinum-400 max-w-md mx-auto">
                    Your request has been routed to the Senior Managing Partner desk. A partner will review your balance sheet requirements and confirm meeting coordinates.
                  </p>
                </div>

                {/* Reference Code Box */}
                <div className="p-5 rounded-2xl bg-obsidian-950 border border-gold-500/40 inline-flex items-center space-x-4 max-w-sm w-full justify-between">
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-widest text-gold-500 font-bold block">
                      Assigned Tracking Code
                    </span>
                    <span className="font-mono text-lg font-bold text-platinum-100">
                      {referenceCode}
                    </span>
                  </div>
                  <button
                    onClick={copyCode}
                    className="p-2.5 rounded-xl bg-obsidian-850 hover:bg-gold-500 hover:text-obsidian-950 text-gold-400 transition-colors"
                    title="Copy Code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => setReferenceCode(null)}
                    className="px-6 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 text-xs uppercase tracking-widest font-bold hover:shadow-gold-glow transition-all"
                  >
                    Register Another Consultation
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-obsidian-800">
                  <div>
                    <h3 className="text-xl font-bold font-luxury text-platinum-100">
                      Bespoke Consultation Booking
                    </h3>
                    <p className="text-xs text-platinum-400">
                      Please provide preliminary parameters for partner allocation.
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400 hidden sm:block">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
                        Full Name & Salutation *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lord Alexander Wright"
                        {...register('fullName')}
                        className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-sm text-platinum-100"
                      />
                      {errors.fullName && (
                        <p className="text-rose-400 text-xs mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
                        Direct Email *
                      </label>
                      <input
                        type="email"
                        placeholder="alexander@familyoffice.com"
                        {...register('email')}
                        className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-sm text-platinum-100"
                      />
                      {errors.email && (
                        <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
                        Direct Phone / Signal *
                      </label>
                      <input
                        type="tel"
                        placeholder="+44 20 7946 0912"
                        {...register('phone')}
                        className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-sm text-platinum-100"
                      />
                      {errors.phone && (
                        <p className="text-rose-400 text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
                        City & Primary Domicile *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. London / Zurich / New York"
                        {...register('countryOrCity')}
                        className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-sm text-platinum-100"
                      />
                      {errors.countryOrCity && (
                        <p className="text-rose-400 text-xs mt-1">{errors.countryOrCity.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
                        Investable Portfolio Tier
                      </label>
                      <select
                        {...register('estimatedPortfolioTier')}
                        className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-sm text-platinum-100"
                      >
                        <option value="$1M-$5M">$1,000,000 – $5,000,000</option>
                        <option value="$5M-$20M">$5,000,000 – $20,000,000</option>
                        <option value="$20M+">$20,000,000+ (Institutional)</option>
                        <option value="CONFIDENTIAL">Undisclosed / Confidential</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
                        Primary Mandate Area
                      </label>
                      <select
                        {...register('serviceOfInterest')}
                        className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-sm text-platinum-100"
                      >
                        <option value="Discretionary Private Wealth Management">Discretionary Private Wealth Management</option>
                        <option value="Family Office Advisory & Succession">Family Office Advisory & Succession</option>
                        <option value="Corporate Capital Advisory & Debt">Corporate Capital Advisory & Debt</option>
                        <option value="Alternative Investments & PE">Alternative Investments & PE</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
                        Preferred Meeting Mode
                      </label>
                      <select
                        {...register('preferredMode')}
                        className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-sm text-platinum-100"
                      >
                        <option value="SECURE_VIDEO">Encrypted Video Conference</option>
                        <option value="IN_PERSON">In-Person Partner Office (London/NY)</option>
                        <option value="TELEPHONE">Confidential Telephone</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
                        Preferred Date (Target)
                      </label>
                      <input
                        type="date"
                        {...register('preferredDate')}
                        className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-sm text-platinum-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
                      Confidential Advisory Objectives (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Outline any specific considerations, e.g. cross-border trust structuring, corporate recapitalization, liquidity event timing..."
                      {...register('message')}
                      className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-sm text-platinum-100"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs uppercase tracking-widest font-bold hover:shadow-gold-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Routing To Partner Desk...</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Submit Confidential Booking</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-[11px] text-platinum-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                    <span>Protected by end-to-end 256-bit encryption. Strict fiduciary non-disclosure.</span>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Physical Desks & Direct Channels (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Channels */}
            <div className="bg-obsidian-900 border border-gold-500/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-luxury">
              <h3 className="text-lg font-bold font-luxury text-platinum-100">
                Direct Communication Channels
              </h3>

              <div className="space-y-4 text-xs">
                <a
                  href="https://wa.me/18004926333?text=Confidential%20Inquiry%20to%20MFEF%20Private%20Wealth"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between group hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-platinum-100">VIP WhatsApp Concierge</div>
                      <div className="text-platinum-400">Encrypted instant partner routing</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                </a>

                <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-2">
                  <div className="flex items-center space-x-2 text-gold-400 font-bold">
                    <Phone className="w-4 h-4" />
                    <span>Private Banking Telephone</span>
                  </div>
                  <div className="text-sm font-mono text-platinum-100">+1 (800) 492-MFEF</div>
                  <div className="text-[11px] text-platinum-500">24/7 dedicated line for client principals</div>
                </div>

                <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-2">
                  <div className="flex items-center space-x-2 text-gold-400 font-bold">
                    <Mail className="w-4 h-4" />
                    <span>Managing Desk Dispatch</span>
                  </div>
                  <div className="text-sm font-mono text-platinum-100">concierge@mfefwealth.com</div>
                  <div className="text-[11px] text-platinum-500">PGP Key available upon request</div>
                </div>
              </div>
            </div>

            {/* Office Locations */}
            <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold font-luxury text-platinum-100">
                Global Partner Suites
              </h3>

              <div className="space-y-4 text-xs text-platinum-300">
                <div className="flex items-start space-x-3">
                  <Building className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-platinum-100 block">London Headquarters</strong>
                    <span>Mayfair Financial Tower, 44 Berkeley Square, London W1J 5AR</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Building className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-platinum-100 block">New York Advisory Suite</strong>
                    <span>590 Madison Avenue, 32nd Floor, New York, NY 10022</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
