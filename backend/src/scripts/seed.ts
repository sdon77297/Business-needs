import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { User } from '../models/User';
import { ServiceOffering } from '../models/ServiceOffering';
import { SiteSetting } from '../models/SiteSetting';
import { Inquiry } from '../models/Inquiry';
import { generateReferenceNumber } from '../utils/referenceGenerator';

const seedDatabase = async () => {
  try {
    console.log('[Seed Engine] Connecting to database...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('[Seed Engine] Connected to MongoDB.');

    // 1. Seed Users (Super Admin & Senior Partners)
    console.log('[Seed Engine] Clearing existing users...');
    await User.deleteMany({});

    const superAdminPassword = await bcrypt.hash('MFEF_Wealth_2026!', 12);
    const partnerPassword = await bcrypt.hash('Partner_MFEF_2026!', 12);

    const superAdmin = await User.create({
      name: 'Alexander Sterling, CFA',
      email: 'admin@mfefwealth.com',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
      title: 'Senior Managing Partner & Chief Investment Officer',
      phone: '+1 (212) 555-0199',
      isActive: true,
    });

    const seniorPartner = await User.create({
      name: 'Eleanor Vance, TEP',
      email: 'partner@mfefwealth.com',
      passwordHash: partnerPassword,
      role: 'MANAGING_PARTNER',
      title: 'Head of Family Office Governance & Succession',
      phone: '+44 20 7946 0912',
      isActive: true,
    });

    console.log(`[Seed Engine] Created 2 Admin Users:`);
    console.log(`  - ${superAdmin.email} (Password: MFEF_Wealth_2026!)`);
    console.log(`  - ${seniorPartner.email} (Password: Partner_MFEF_2026!)`);

    // 2. Seed Services
    console.log('[Seed Engine] Seeding Wealth Advisory Services...');
    await ServiceOffering.deleteMany({});

    const services = [
      {
        slug: 'private-wealth-management',
        title: 'Discretionary Private Wealth Management',
        tagline: 'Tailored multi-asset portfolios focused on capital preservation and risk-adjusted yield.',
        category: 'Wealth Management',
        summary:
          'Bespoke discretionary mandates designed for individuals and families with complex balance sheets, navigating global markets with institutional risk controls.',
        detailedOverview:
          'Our Discretionary Private Wealth Management mandate combines multi-asset macroeconomic asset allocation with single-name private security selection. We construct resilient, all-weather portfolios tailored to individual liquidity, tax domiciles, and long-term capital preservation goals.',
        keyDeliverables: [
          'Direct Discretionary Portfolio Mandates',
          'Global Multi-Currency Cash & Fixed Income Optimization',
          'Tactical Asset Allocation & Macro Hedging',
          'Real-Time Consolidated Custody Reporting',
          'Direct Access to Senior Portfolio Managers',
        ],
        minimumThreshold: '$2,000,000 Investable Assets',
        iconName: 'TrendingUp',
        displayOrder: 1,
        isActive: true,
      },
      {
        slug: 'family-office-succession',
        title: 'Family Office Advisory & Succession Planning',
        tagline: 'Preserving capital, legacy, and family governance across multiple generations.',
        category: 'Family Office',
        summary:
          'Comprehensive family office orchestration encompassing trust architecture, philanthropic foundations, tax domicile structuring, and generational leadership succession.',
        detailedOverview:
          'Transferring significant wealth across generations demands institutional governance paired with deep familial sensitivity. We construct customized family constitutions, oversee cross-border trust structures, and align next-generation beneficiaries with fiduciary education and leadership responsibilities.',
        keyDeliverables: [
          'Cross-Border Trust & Foundation Structuring',
          'Family Constitution & Governance Protocols',
          'Next-Generation Fiduciary Mentorship Programs',
          'Philanthropic Endowment Architecture',
          'Consolidated Global Family Balance Sheet Oversight',
        ],
        minimumThreshold: '$10,000,000 Family Net Worth',
        iconName: 'Shield',
        displayOrder: 2,
        isActive: true,
      },
      {
        slug: 'corporate-capital-advisory',
        title: 'Corporate Capital Advisory & Debt Restructuring',
        tagline: 'Strategic liquidity management, business financing, and balance sheet advisory.',
        category: 'Corporate Advisory',
        summary:
          'Strategic corporate advisory for business owners, enterprise founders, and corporations navigating liquidity events, commercial debt syndication, and mergers & acquisitions.',
        detailedOverview:
          'We bridge private client balance sheets with institutional capital markets. Whether positioning an enterprise for a generational liquidity event, structuring senior secured debt facilities, or executing recapitalizations, our advisory partners deliver discreet, high-value execution.',
        keyDeliverables: [
          'Pre-Liquidity Event Structuring & Valuation',
          'Syndicated Senior & Mezzanine Debt Placement',
          'Mergers & Acquisitions Strategic Fiduciary Guidance',
          'Working Capital & Corporate Treasury Solutions',
          'Shareholder Dispute & Equity Buyout Structuring',
        ],
        minimumThreshold: '$5,000,000 Enterprise Value / Financing',
        iconName: 'Briefcase',
        displayOrder: 3,
        isActive: true,
      },
      {
        slug: 'alternative-investments',
        title: 'Private Equity & Alternative Asset Placement',
        tagline: 'Uncorrelated alpha through private equity, private credit, and institutional real estate.',
        category: 'Alternative Assets',
        summary:
          'Exclusive co-investment opportunities, direct private equity transactions, private debt facilities, and prime real estate assets closed to retail markets.',
        detailedOverview:
          'In an era of compressed public market returns, alternative assets are foundational for ultra-high-net-worth portfolios. We conduct exhaustive due diligence on direct secondary transactions, private lending facilities, and trophy real estate investments, granting our clients privileged institutional access.',
        keyDeliverables: [
          'Direct Private Equity Co-Investment Syndications',
          'Senior Secured Private Credit & Direct Lending',
          'Institutional Real Estate & Prime Urban Assets',
          'Proprietary Due Diligence & Legal Structuring',
          'Discreet Secondary Liquidity Windows',
        ],
        minimumThreshold: '$3,000,000 Minimum Allocation',
        iconName: 'Layers',
        displayOrder: 4,
        isActive: true,
      },
    ];

    await ServiceOffering.insertMany(services);
    console.log(`[Seed Engine] Seeded ${services.length} Wealth Advisory Services.`);

    // 3. Seed Site Settings
    console.log('[Seed Engine] Seeding Site Settings...');
    await SiteSetting.deleteMany({});
    await SiteSetting.create({
      firmName: 'MFEF Private Wealth Partners',
      tagline: 'Multi-Generational Wealth Preservation & Bespoke Advisory',
      conciergePhone: '+1 (800) 492-6333',
      conciergeEmail: 'concierge@mfefwealth.com',
      conciergeWhatsApp: '+18004926333',
      headquartersAddress: 'Mayfair Financial Tower, Suite 4400, London & New York',
      statAum: '$3.8B+',
      statClientRetention: '99.4%',
      statAvgExperience: '24 Years',
      statJurisdictions: '18 Global Jurisdictions',
    });

    // 4. Seed Initial Realistic Inquiries & Callbacks for CRM
    console.log('[Seed Engine] Seeding Initial Inquiries for CRM Pipeline...');
    await Inquiry.deleteMany({});

    const initialInquiries = [
      {
        referenceNumber: generateReferenceNumber('MFEF'),
        inquiryType: 'CONSULTATION',
        status: 'NEW',
        fullName: 'Julian Montgomery',
        email: 'j.montgomery@montgomeryholdings.co.uk',
        phone: '+44 7700 900142',
        countryOrCity: 'London, United Kingdom',
        estimatedPortfolioTier: '$20M+',
        serviceOfInterest: 'Family Office Advisory & Succession Planning',
        preferredMode: 'IN_PERSON',
        preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        preferredTimeSlot: '14:00 - 15:30 GMT',
        message: 'Exploring transition of multi-generational real estate holdings into a structured family governance trust. Require confidential review.',
        assignedAdvisor: seniorPartner._id,
        internalNotes: [
          {
            authorId: superAdmin._id,
            authorName: superAdmin.name,
            content: 'High-priority inquiry received from UK family holding company. Assigned to Eleanor Vance.',
            createdAt: new Date(),
          },
        ],
      },
      {
        referenceNumber: generateReferenceNumber('CALL'),
        inquiryType: 'CALLBACK',
        status: 'CONTACTED',
        fullName: 'Dr. Robert C. Hastings',
        email: 'dr.hastings@hastingscardio.com',
        phone: '+1 (312) 555-0188',
        countryOrCity: 'Chicago, IL, United States',
        estimatedPortfolioTier: '$5M-$20M',
        serviceOfInterest: 'Discretionary Private Wealth Management',
        preferredMode: 'TELEPHONE',
        callbackWindow: 'MORNING',
        message: 'Priority callback requested regarding corporate sale liquidity event and tax mitigation.',
        assignedAdvisor: superAdmin._id,
        internalNotes: [
          {
            authorId: superAdmin._id,
            authorName: superAdmin.name,
            content: 'Spoke with Dr. Hastings this morning. Scheduled formal discovery video call for next Tuesday.',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          },
        ],
      },
      {
        referenceNumber: generateReferenceNumber('MFEF'),
        inquiryType: 'CONSULTATION',
        status: 'IN_REVIEW',
        fullName: 'Genevieve Du Pont-Laurent',
        email: 'genevieve@laurent-asset.fr',
        phone: '+33 1 42 68 55 00',
        countryOrCity: 'Paris & Geneva',
        estimatedPortfolioTier: '$20M+',
        serviceOfInterest: 'Private Equity & Alternative Asset Placement',
        preferredMode: 'SECURE_VIDEO',
        preferredDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        preferredTimeSlot: '10:00 - 11:30 CET',
        message: 'Requesting allocation details for Q1 private credit and European logistics direct equity syndication.',
        assignedAdvisor: seniorPartner._id,
        internalNotes: [
          {
            authorId: seniorPartner._id,
            authorName: seniorPartner.name,
            content: 'Accredited European investor. Due diligence pack prepared for video conference.',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          },
        ],
      },
    ];

    await Inquiry.insertMany(initialInquiries);
    console.log(`[Seed Engine] Seeded ${initialInquiries.length} VIP CRM Inquiries.`);

    console.log('[Seed Engine] Database seeding completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Engine Failure]', error);
    process.exit(1);
  }
};

seedDatabase();
