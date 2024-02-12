import dotenv from 'dotenv';

dotenv.config();

const config = {
  // The apps name
  app_name: 'Magenta',
  // The magento backend's REST base url to call. This will be used to
  // generate url for API calls.
  magento_api_base_url: process.env.MAGENTO_BASE_URL,
  // Token required to pass with requests to magento. For security,
  // this is loaded from the .env file.
  magento_token: process.env.MAGENTO_TOKEN,
  // If the app will be protected with an SSL
  ssl_enabled: process.env.SSLEnabled === 'true',
  cookie_secret_key: process.env.JWT_SECRET,
  google_api_key: process.env.GOOGLE_API_KEY,
};

export default config;
