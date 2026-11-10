import { Request, Response, NextFunction } from 'express';
import { Inquiry, InquiryStatus, InquiryType } from '../models/Inquiry';
import { User } from '../models/User';
import { statusUpdateSchema, addNoteSchema } from '../validators/inquiryValidator';
import { AppError } from '../middleware/errorHandler';

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'NEW' });
    const inReview = await Inquiry.countDocuments({ status: 'IN_REVIEW' });
    const converted = await Inquiry.countDocuments({ status: 'CONVERTED' });
    const consultationsCount = await Inquiry.countDocuments({ inquiryType: 'CONSULTATION' });
    const callbacksCount = await Inquiry.countDocuments({ inquiryType: 'CALLBACK' });

    // Aggregate portfolio tiers
    const portfolioBreakdown = await Inquiry.aggregate([
      {
        $group: {
          _id: '$estimatedPortfolioTier',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent 5 leads
    const recentLeads = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('referenceNumber fullName email phone inquiryType status estimatedPortfolioTier createdAt');

    res.status(200).json({
      success: true,
      stats: {
        totalInquiries,
        newInquiries,
        inReview,
        converted,
        consultationsCount,
        callbacksCount,
        portfolioBreakdown,
        conversionRate: totalInquiries > 0 ? ((converted / totalInquiries) * 100).toFixed(1) + '%' : '0%',
        recentLeads,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getInquiries = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const { status, inquiryType, search } = req.query;

    const filter: any = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (inquiryType && inquiryType !== 'ALL') {
      filter.inquiryType = inquiryType;
    }

    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      filter.$or = [
        { fullName: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
        { phone: { $regex: term, $options: 'i' } },
        { referenceNumber: { $regex: term, $options: 'i' } },
        { serviceOfInterest: { $regex: term, $options: 'i' } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate('assignedAdvisor', 'name email title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Inquiry.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getInquiryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id).populate('assignedAdvisor', 'name email title');

    if (!inquiry) {
      throw new AppError('Inquiry record not found', 404);
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInquiryStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, assignedAdvisorId } = statusUpdateSchema.parse(req.body);

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      throw new AppError('Inquiry record not found', 404);
    }

    inquiry.status = status as InquiryStatus;

    if (assignedAdvisorId) {
      inquiry.assignedAdvisor = assignedAdvisorId as any;
    }

    // Append system note for audit log
    if (req.user) {
      inquiry.internalNotes.push({
        authorId: req.user.userId as any,
        authorName: req.user.name,
        content: `Status updated to ${status}${assignedAdvisorId ? ' and advisor reassigned' : ''}.`,
        createdAt: new Date(),
      });
    }

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: `Lead status updated to ${status}`,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const addInternalNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = addNoteSchema.parse(req.body);

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      throw new AppError('Inquiry record not found', 404);
    }

    if (!req.user) {
      throw new AppError('Unauthenticated', 401);
    }

    inquiry.internalNotes.push({
      authorId: req.user.userId as any,
      authorName: req.user.name,
      content,
      createdAt: new Date(),
    });

    await inquiry.save();

    res.status(201).json({
      success: true,
      message: 'Confidential advisor note logged successfully.',
      notes: inquiry.internalNotes,
    });
  } catch (error) {
    next(error);
  }
};

export const exportInquiriesCsv = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, inquiryType } = req.query;
    const filter: any = {};
    if (status && status !== 'ALL') filter.status = status;
    if (inquiryType && inquiryType !== 'ALL') filter.inquiryType = inquiryType;

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });

    // Construct CSV Header
    const headers = [
      'Reference Number',
      'Date Submitted',
      'Inquiry Type',
      'Status',
      'Full Name',
      'Email',
      'Phone',
      'Location',
      'Portfolio Tier',
      'Service Of Interest',
      'Preferred Mode',
      'Scheduled Date',
      'Callback Window',
      'Internal Notes Count',
    ];

    const rows = inquiries.map((item) => {
      return [
        `"${item.referenceNumber}"`,
        `"${new Date(item.createdAt).toISOString()}"`,
        `"${item.inquiryType}"`,
        `"${item.status}"`,
        `"${item.fullName.replace(/"/g, '""')}"`,
        `"${item.email.replace(/"/g, '""')}"`,
        `"${item.phone.replace(/"/g, '""')}"`,
        `"${(item.countryOrCity || '').replace(/"/g, '""')}"`,
        `"${item.estimatedPortfolioTier}"`,
        `"${(item.serviceOfInterest || '').replace(/"/g, '""')}"`,
        `"${item.preferredMode}"`,
        `"${item.preferredDate ? new Date(item.preferredDate).toISOString().split('T')[0] : 'N/A'}"`,
        `"${item.callbackWindow || 'N/A'}"`,
        item.internalNotes.length,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="MFEF_Leads_Export_${new Date().toISOString().split('T')[0]}.csv"`
    );

    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
