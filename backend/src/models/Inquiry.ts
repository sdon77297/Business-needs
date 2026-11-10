import { Schema, model, Document, Types } from 'mongoose';

export type InquiryType = 'CONSULTATION' | 'CALLBACK' | 'GENERAL';
export type InquiryStatus = 'NEW' | 'CONTACTED' | 'IN_REVIEW' | 'CONVERTED' | 'ARCHIVED';
export type PortfolioTier = '$1M-$5M' | '$5M-$20M' | '$20M+' | 'CONFIDENTIAL';
export type MeetingMode = 'IN_PERSON' | 'SECURE_VIDEO' | 'TELEPHONE';
export type CallbackWindow = 'IMMEDIATE' | 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface IInternalNote {
  _id?: Types.ObjectId;
  authorId: Types.ObjectId;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface IInquiry extends Document {
  referenceNumber: string;
  inquiryType: InquiryType;
  status: InquiryStatus;
  
  // Client Contact Information
  fullName: string;
  email: string;
  phone: string;
  countryOrCity?: string;
  
  // Wealth & Advisory Requirements
  estimatedPortfolioTier: PortfolioTier;
  serviceOfInterest: string;
  preferredMode: MeetingMode;
  preferredDate?: Date;
  preferredTimeSlot?: string;
  callbackWindow?: CallbackWindow;
  message?: string;
  
  // CRM Workflow
  assignedAdvisor?: Types.ObjectId;
  internalNotes: IInternalNote[];
  ipAddress?: string;
  userAgent?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const internalNoteSchema = new Schema<IInternalNote>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Note content cannot be empty'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const inquirySchema = new Schema<IInquiry>(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    inquiryType: {
      type: String,
      enum: ['CONSULTATION', 'CALLBACK', 'GENERAL'],
      default: 'CONSULTATION',
      index: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'IN_REVIEW', 'CONVERTED', 'ARCHIVED'],
      default: 'NEW',
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    countryOrCity: {
      type: String,
      trim: true,
      default: 'Confidential / Global',
    },
    estimatedPortfolioTier: {
      type: String,
      enum: ['$1M-$5M', '$5M-$20M', '$20M+', 'CONFIDENTIAL'],
      default: 'CONFIDENTIAL',
    },
    serviceOfInterest: {
      type: String,
      default: 'Private Wealth Management',
    },
    preferredMode: {
      type: String,
      enum: ['IN_PERSON', 'SECURE_VIDEO', 'TELEPHONE'],
      default: 'SECURE_VIDEO',
    },
    preferredDate: {
      type: Date,
    },
    preferredTimeSlot: {
      type: String,
      trim: true,
    },
    callbackWindow: {
      type: String,
      enum: ['IMMEDIATE', 'MORNING', 'AFTERNOON', 'EVENING'],
      default: 'IMMEDIATE',
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    assignedAdvisor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    internalNotes: [internalNoteSchema],
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying and filtering in Admin CRM
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ inquiryType: 1, status: 1 });
inquirySchema.index({ email: 1 });

export const Inquiry = model<IInquiry>('Inquiry', inquirySchema);
