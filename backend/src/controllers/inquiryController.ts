import { Request, Response, NextFunction } from 'express';
import { Inquiry } from '../models/Inquiry';
import {
  consultationSchema,
  callbackSchema,
  generalContactSchema,
} from '../validators/inquiryValidator';
import { generateReferenceNumber } from '../utils/referenceGenerator';

export const submitConsultation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = consultationSchema.parse(req.body);
    const referenceNumber = generateReferenceNumber('MFEF');

    const inquiry = await Inquiry.create({
      ...validatedData,
      referenceNumber,
      inquiryType: 'CONSULTATION',
      status: 'NEW',
      preferredDate: validatedData.preferredDate ? new Date(validatedData.preferredDate) : undefined,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    res.status(201).json({
      success: true,
      message: 'Your confidential consultation request has been registered with our senior partners.',
      referenceNumber: inquiry.referenceNumber,
      data: {
        id: inquiry._id,
        referenceNumber: inquiry.referenceNumber,
        fullName: inquiry.fullName,
        serviceOfInterest: inquiry.serviceOfInterest,
        preferredMode: inquiry.preferredMode,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = callbackSchema.parse(req.body);
    const referenceNumber = generateReferenceNumber('CALL');

    const inquiry = await Inquiry.create({
      fullName: validatedData.fullName,
      phone: validatedData.phone,
      callbackWindow: validatedData.callbackWindow,
      serviceOfInterest: validatedData.serviceOfInterest || 'Priority Wealth Inquiry',
      countryOrCity: validatedData.countryOrCity || 'Confidential',
      email: `${validatedData.phone.replace(/[^0-9]/g, '')}@callback.mfef.internal`, // internal identifier
      referenceNumber,
      inquiryType: 'CALLBACK',
      status: 'NEW',
      preferredMode: 'TELEPHONE',
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    res.status(201).json({
      success: true,
      message: 'Priority callback dispatched. A senior private wealth advisor will contact you shortly.',
      referenceNumber: inquiry.referenceNumber,
      data: {
        id: inquiry._id,
        referenceNumber: inquiry.referenceNumber,
        fullName: inquiry.fullName,
        callbackWindow: inquiry.callbackWindow,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitGeneralContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = generalContactSchema.parse(req.body);
    const referenceNumber = generateReferenceNumber('INQ');

    const inquiry = await Inquiry.create({
      ...validatedData,
      referenceNumber,
      inquiryType: 'GENERAL',
      status: 'NEW',
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received by our corporate communications desk.',
      referenceNumber: inquiry.referenceNumber,
      data: {
        id: inquiry._id,
        referenceNumber: inquiry.referenceNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const lookupInquiryStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { referenceNumber, email } = req.query;

    if (!referenceNumber) {
      res.status(400).json({ success: false, message: 'Reference number is required' });
      return;
    }

    const query: any = { referenceNumber: String(referenceNumber).trim().toUpperCase() };
    if (email) {
      query.email = String(email).trim().toLowerCase();
    }

    const inquiry = await Inquiry.findOne(query).select(
      'referenceNumber inquiryType status fullName serviceOfInterest preferredMode preferredDate createdAt'
    );

    if (!inquiry) {
      res.status(404).json({
        success: false,
        message: 'No consultation booking was found matching the provided reference number.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};
