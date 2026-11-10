import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, PhoneCall, ShieldCheck, CheckCircle2, Loader2, Copy } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const callbackSchema = z.object({
  fullName: z.string().min(2, 'Please provide your full name'),
  phone: z.string().min(7, 'Please enter a direct contact number'),
  callbackWindow: z.enum(['IMMEDIATE', 'MORNING', 'AFTERNOON', 'EVENING']),
  serviceOfInterest: z.string().min(1, 'Please select your area of inquiry'),
  countryOrCity: z.string().optional(),
});

type CallbackFormData = z.infer<typeof callbackSchema>;

interface DirectAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectAdvisorModal: React.FC<DirectAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const { error } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CallbackFormData>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      callbackWindow: 'IMMEDIATE',
      serviceOfInterest: 'Priority Wealth Inquiry',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CallbackFormData) => {
    try {
      setIsSubmitting(true);
      const res = await api.post('/inquiries/callback', data);
      if (res.data.success) {
        setSuccessReference(res.data.referenceNumber);
        reset();
      }
    } catch (err: any) {
      error('Submission Error', err.message || 'Unable to register callback request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    if (successReference) {
      navigator.clipboard.writeText(successReference);
    }
  };

  const handleClose = () => {
    setSuccessReference(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-obsidian-900 border border-gold-500/30 rounded-2xl p-6 sm:p-8 shadow-luxury text-platinum-100 overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-platinum-400 hover:text-platinum-100 transition-colors p-1"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {successReference ? (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/20 border border-gold-500/50 flex items-center justify-center text-gold-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-luxury text-platinum-100">
                Priority Callback Dispatched
              </h3>
              <p className="text-sm text-platinum-400 mt-1 max-w-sm mx-auto">
                A senior private wealth partner has received your request and will connect via direct telephone.
              </p>
            </div>

            {/* Reference Box */}
            <div className="p-4 rounded-xl bg-obsidian-950 border border-gold-500/40 inline-flex items-center space-x-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-500 block">
                  Confidential Reference Code
                </span>
                <span className="font-mono text-base font-bold text-platinum-100">
                  {successReference}
                </span>
              </div>
              <button
                onClick={copyReference}
                title="Copy reference code"
                className="p-2 rounded-lg bg-obsidian-850 hover:bg-gold-500 hover:text-obsidian-950 text-gold-400 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 text-xs uppercase tracking-wider font-bold hover:shadow-gold-glow transition-all"
              >
                Return to Portal
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-luxury text-platinum-100">
                  Direct Advisor Callback
                </h3>
                <p className="text-xs text-platinum-400">
                  Immediate, discreet connection with an MFEF managing partner.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-platinum-300 font-medium mb-1.5">
                  Full Name & Salutation *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sir Julian Montgomery"
                  {...register('fullName')}
                  className="w-full px-4 py-2.5 rounded-lg bg-obsidian-950 border border-obsidian-700 focus:border-gold-500 focus:outline-none text-sm text-platinum-100 transition-colors"
                />
                {errors.fullName && (
                  <p className="text-rose-400 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-platinum-300 font-medium mb-1.5">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (212) 555-0199"
                    {...register('phone')}
                    className="w-full px-4 py-2.5 rounded-lg bg-obsidian-950 border border-obsidian-700 focus:border-gold-500 focus:outline-none text-sm text-platinum-100 transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-rose-400 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-platinum-300 font-medium mb-1.5">
                    Preferred Window
                  </label>
                  <select
                    {...register('callbackWindow')}
                    className="w-full px-4 py-2.5 rounded-lg bg-obsidian-950 border border-obsidian-700 focus:border-gold-500 focus:outline-none text-sm text-platinum-100 transition-colors"
                  >
                    <option value="IMMEDIATE">Immediate (Within 30 Mins)</option>
                    <option value="MORNING">Morning (09:00 - 12:00)</option>
                    <option value="AFTERNOON">Afternoon (13:00 - 17:00)</option>
                    <option value="EVENING">Evening (18:00 - 20:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-platinum-300 font-medium mb-1.5">
                  Primary Area of Inquiry
                </label>
                <select
                  {...register('serviceOfInterest')}
                  className="w-full px-4 py-2.5 rounded-lg bg-obsidian-950 border border-obsidian-700 focus:border-gold-500 focus:outline-none text-sm text-platinum-100 transition-colors"
                >
                  <option value="Priority Wealth Inquiry">Priority Wealth Inquiry</option>
                  <option value="Discretionary Private Wealth Management">Discretionary Private Wealth Management</option>
                  <option value="Family Office & Succession Planning">Family Office & Succession Planning</option>
                  <option value="Corporate Capital Advisory & Debt">Corporate Capital Advisory & Debt</option>
                  <option value="Alternative Investments & PE">Alternative Investments & PE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-platinum-300 font-medium mb-1.5">
                  City / Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York, London, Zurich"
                  {...register('countryOrCity')}
                  className="w-full px-4 py-2.5 rounded-lg bg-obsidian-950 border border-obsidian-700 focus:border-gold-500 focus:outline-none text-sm text-platinum-100 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs uppercase tracking-wider font-bold hover:shadow-gold-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Dispatching Priority Callback...</span>
                    </>
                  ) : (
                    <>
                      <PhoneCall className="w-4 h-4" />
                      <span>Confirm Callback Request</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-platinum-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                <span>Encrypted transmission. Absolute client confidentiality guaranteed.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
