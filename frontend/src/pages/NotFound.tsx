import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md w-full bg-obsidian-900 border border-gold-500/30 rounded-3xl p-8 sm:p-12 shadow-luxury space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-bold font-luxury text-gold-gradient block">404</span>
          <h1 className="text-xl font-bold font-luxury text-platinum-100">
            Advisory Resource Not Found
          </h1>
          <p className="text-xs text-platinum-400 leading-relaxed">
            The private ledger record or page coordinate you requested is unavailable or has been relocated to an archive.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 text-xs uppercase tracking-widest font-bold hover:shadow-gold-glow transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
