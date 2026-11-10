import React, { useState } from 'react';
import { X, Search, Loader2, Calendar, Shield, Clock } from 'lucide-react';
import { api } from '../services/api';

interface StatusTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatusTrackerModal: React.FC<StatusTrackerModalProps> = ({ isOpen, onClose }) => {
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);
      setResult(null);

      const res = await api.get(`/inquiries/track?referenceNumber=${encodeURIComponent(reference.trim())}`);
      if (res.data.success && res.data.inquiry) {
        setResult(res.data.inquiry);
      } else {
        setErrorMsg('No consultation request found matching this reference code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to locate reference number.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">Registered with Managing Desk</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">Partner Connected / Follow-up Active</span>;
      case 'IN_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">Fiduciary Portfolio Review Underway</span>;
      case 'CONVERTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Mandate Active / Client Onboarded</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-platinum-500/15 text-platinum-400 border border-platinum-500/30">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-obsidian-900 border border-gold-500/30 rounded-2xl p-6 sm:p-8 shadow-luxury text-platinum-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-platinum-400 hover:text-platinum-100 transition-colors p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-luxury text-platinum-100">
              Consultation Status Tracker
            </h3>
            <p className="text-xs text-platinum-400">
              Verify the progress of your confidential inquiry.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-platinum-300 font-medium mb-1.5">
              Enter Reference Number
            </label>
            <input
              type="text"
              placeholder="e.g. MFEF-2026-9A1F"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-obsidian-950 border border-obsidian-700 focus:border-gold-500 focus:outline-none text-sm text-platinum-100 uppercase tracking-widest font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !reference.trim()}
            className="w-full py-2.5 rounded-lg bg-gold-500 text-obsidian-950 text-xs uppercase tracking-wider font-bold hover:shadow-gold-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Querying Ledger...</span>
              </>
            ) : (
              <span>Check Verification Status</span>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 rounded-xl bg-obsidian-950 border border-gold-500/30 space-y-3 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold-500 font-bold block">
                  Reference Code
                </span>
                <span className="font-mono text-sm font-bold text-platinum-100">
                  {result.referenceNumber}
                </span>
              </div>
              <div>{getStatusBadge(result.status)}</div>
            </div>

            <div className="text-xs text-platinum-400 space-y-1.5 pt-2 border-t border-obsidian-800">
              <div className="flex items-center text-platinum-300">
                <Shield className="w-3.5 h-3.5 mr-2 text-gold-400" />
                <span className="font-medium text-platinum-200">{result.fullName}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-2 text-platinum-500" />
                <span>Area: {result.serviceOfInterest}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-2 text-platinum-500" />
                <span>Lodged: {new Date(result.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
