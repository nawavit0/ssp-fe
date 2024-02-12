/* eslint-disable max-len */
import dotenv from 'dotenv';
dotenv.config();

export const clientConfig = {
  env: process.env.ENV || 'dev',
  clientUrl: process.env.BASE_URL || '',
  os: '',
  isMobile: false,
  isDesktop: false,
  isTablet: false,
};
