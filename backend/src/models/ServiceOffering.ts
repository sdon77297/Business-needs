import { Schema, model, Document } from 'mongoose';

export interface IServiceOffering extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const serviceOfferingSchema = new Schema<IServiceOffering>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Wealth Advisory',
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    detailedOverview: {
      type: String,
      required: true,
    },
    keyDeliverables: [
      {
        type: String,
        required: true,
      },
    ],
    minimumThreshold: {
      type: String,
      default: '$1,000,000 Investable Capital',
    },
    iconName: {
      type: String,
      default: 'ShieldCheck',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceOfferingSchema.index({ isActive: 1, displayOrder: 1 });

export const ServiceOffering = model<IServiceOffering>('ServiceOffering', serviceOfferingSchema);
