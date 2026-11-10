import { Request, Response, NextFunction } from 'express';
import { ServiceOffering } from '../models/ServiceOffering';
import { SiteSetting } from '../models/SiteSetting';
import { AppError } from '../middleware/errorHandler';

export const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const services = await ServiceOffering.find({ isActive: true }).sort({ displayOrder: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const service = await ServiceOffering.findOne({ slug, isActive: true });

    if (!service) {
      throw new AppError('Wealth advisory service not found', 404);
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const getSiteSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
