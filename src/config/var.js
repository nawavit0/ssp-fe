/* eslint-disable max-len */
import dotenv from 'dotenv';
dotenv.config();

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

export default {
  // Node.js app
  env: process.env.ENV || 'dev',
  port: process.env.PORT || 3000,
  clientUrl: process.env.BASE_URL || '',
  apiUrl: process.env.API_URL || '',
  graphqlUrl: process.env.GRAPHQL_URL,
  cmsUrl: process.env.CMS_URL || '',
  mdcUrl: process.env.MDC_URL || '',
  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
    gtmID: process.env.GTM_ID,
  },
  google: {
    capcha: process.env.GOOGLE_CAPCHA_KEY,
    map: process.env.GOOGLE_MAP_KEY,
    siteVerification: process.env.GOOGLE_SITE_VERIFICATION,
  },
  facebook: {
    fbAppId: process.env.FB_APP_ID,
    fbPagesId: process.env.FB_PAGES_ID,
  },
};
