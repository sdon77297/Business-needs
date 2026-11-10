export type UserRole = 'SUPER_ADMIN' | 'MANAGING_PARTNER' | 'SENIOR_ADVISOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  lastLogin?: string;
}

export type InquiryType = 'CONSULTATION' | 'CALLBACK' | 'GENERAL';
export type InquiryStatus = 'NEW' | 'CONTACTED' | 'IN_REVIEW' | 'CONVERTED' | 'ARCHIVED';
export type PortfolioTier = '$1M-$5M' | '$5M-$20M' | '$20M+' | 'CONFIDENTIAL';
export type MeetingMode = 'IN_PERSON' | 'SECURE_VIDEO' | 'TELEPHONE';
export type CallbackWindow = 'IMMEDIATE' | 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface InternalNote {
  _id?: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  referenceNumber: string;
  inquiryType: InquiryType;
  status: InquiryStatus;
  fullName: string;
  email: string;
  phone: string;
  countryOrCity?: string;
  estimatedPortfolioTier: PortfolioTier;
  serviceOfInterest: string;
  preferredMode: MeetingMode;
  preferredDate?: string;
  preferredTimeSlot?: string;
  callbackWindow?: CallbackWindow;
  message?: string;
  assignedAdvisor?: {
    _id: string;
    name: string;
    email: string;
    title: string;
  };
  internalNotes: InternalNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOffering {
  _id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  summary: string;
  detailedOverview: string;
  keyDeliverables: string[];
  minimumThreshold: string;
  iconName: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SiteSetting {
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
}

export interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  inReview: number;
  converted: number;
  consultationsCount: number;
  callbacksCount: number;
  conversionRate: string;
  portfolioBreakdown: Array<{ _id: string; count: number }>;
  recentLeads: Array<{
    _id: string;
    referenceNumber: string;
    fullName: string;
    email: string;
    phone: string;
    inquiryType: InquiryType;
    status: InquiryStatus;
    estimatedPortfolioTier: PortfolioTier;
    createdAt: string;
  }>;
}
