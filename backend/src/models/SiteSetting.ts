import { Schema, model, Document } from 'mongoose';

export interface ISiteSetting extends Document {
  firmName: string;
  tagline: string;
  conciergePhone: string;
  conciergeEmail: string;
  conciergeWhatsApp: string;
  headquartersAddress: string;
  regulatoryDisclaimer: string;
  statAum: string;
  statClientRetention: string;
  statAvgExperience: string;
  statJurisdictions: string;
  updatedAt: Date;
}

const siteSettingSchema = new Schema<ISiteSetting>(
  {
    firmName: {
      type: String,
      default: 'MFEF Private Wealth Partners',
    },
    tagline: {
      type: String,
      default: 'Multi-Generational Wealth Preservation & Bespoke Advisory',
    },
    conciergePhone: {
      type: String,
      default: '+1 (800) 492-MFEF',
    },
    conciergeEmail: {
      type: String,
      default: 'concierge@mfefwealth.com',
    },
    conciergeWhatsApp: {
      type: String,
      default: '+18004926333',
    },
    headquartersAddress: {
      type: String,
      default: 'Mayfair Financial Tower, Suite 4400, London & New York',
    },
    regulatoryDisclaimer: {
      type: String,
      default:
        'MFEF Private Wealth Partners operates as a fiduciary wealth advisory. Investment advisory services are subject to market risks. Past capital preservation does not guarantee future results.',
    },
    statAum: {
      type: String,
      default: '$3.8B+',
    },
    statClientRetention: {
      type: String,
      default: '99.4%',
    },
    statAvgExperience: {
      type: String,
      default: '24 Years',
    },
    statJurisdictions: {
      type: String,
      default: '18 Global Jurisdictions',
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSetting = model<ISiteSetting>('SiteSetting', siteSettingSchema);
