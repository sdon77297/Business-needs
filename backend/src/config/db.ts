import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB Error]', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Disconnected] Attempting reconnect...');
    });

    return conn;
  } catch (error) {
    console.error('[MongoDB Connection Failure]', error);
    process.exit(1);
  }
};
