require('newrelic');
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import React from 'react';
import { find, get } from 'lodash';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import compression from 'compression';
import lusca from 'lusca';
import createService from './api/createService';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import { setLocale } from '../src/reducers/locale/actions';
import errorPageStyle from './routes/error/ErrorPage.scss';
import router from './router';
import apiRouter from './api/routes';
// import assets from './asset-manifest.json'; // eslint-disable-line import/no-unresolved
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { loadStoreConfigsCompleted } from '../src/reducers/storeConfig/actions';
import translation from '../translation';
import { resolveUrl } from './utils/url';
import languages from './constants/languages';
import boom from 'express-boom';
import dotenv from 'dotenv';
import config from './config';
import config2 from './api/config';
import { clientConfig } from './config/client';
import theme from './config/theme';
import configGraphql from './config/var';
import customAttribute from './config/customAttribute';
import { ServerStyleSheet } from 'styled-components';
import {
  GET_STORECONFIGS,
  GET_CUSTOMER,
  CreateGraphqlClient,
  CoreUiProvider,
  getDataFromTree,
} from '@central-tech/core-ui';
import { Helmet } from 'react-helmet';
import MobileDetect from 'mobile-detect';
import { redisClient, webCache, redisConnect } from './api/configRedis';
import { getCmsContext } from './setupServer';
dotenv.config();

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  // send entire app down. Process manager will restart it
  process.exit(1);
});

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const app = express();

app.use(compression());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
//
// If you are using proxy from external machine, you can set TRUST_PROXY env
// Default is to trust proxy headers only from loopback interface.
// -----------------------------------------------------------------------------
app.set('trust proxy', config.trustProxy);

app.get('/:language/jwt', function(req, res) {
  if (req.params.language === 'th' || req.params.language === 'en') {
    res.cookie('lang', req.params.language, {
      maxAge: 10 * 365 * 24 * 60 * 60,
      httpOnly: false,
      signed: false,
    });
    res.cookie('store', `ssp_${req.params.language}`, {
      maxAge: 10 * 365 * 24 * 60 * 60,
      httpOnly: false,
      signed: false,
    });

    res.send('loading...');
  }
  res.status(404).end();
});

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(
  express.static(path.resolve(__dirname, 'public'), { maxAge: 31557600000 }),
);
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
    // limit: '256mb',
  }),
);
app.use(bodyParser.json());
app.use(createService);

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config2.cookie_secret_key,
    credentialsRequired: false,
    getToken: req => req.cookies.uut,
  }),
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.uut);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('uut');
    res.redirect('/');
  } else {
    next(err);
  }
});
// helper for HTTP status code
app.use(boom());

app.get(
  /^.+\.(jpg|jpeg|gif|png|bmp|ico|webp|svg|css|js|zip|rar|flv|swf|xls)$/,
  (req, res) => {
    res.status(404).end();
  },
);

app.use('/api', apiRouter);
//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
let storeConfigInstant = null;
app.get('*', async (req, res, next) => {
  try {
    if (req.path.startsWith('/api') || req.path.startsWith('/browser-sync')) {
      return next();
    }

    const userToken = req.user ? req.user.token : undefined;
    const currentDevice =
      req.user && req.user.device ? req.user.device : 'desktop';
    req.decodedUserToken = userToken;

    let currentLang;
    const firstFourCharOfPath = req.path.substring(0, 4);

    if (
      firstFourCharOfPath !== '/en' &&
      firstFourCharOfPath !== '/en/' &&
      firstFourCharOfPath !== '/th' &&
      firstFourCharOfPath !== '/th/' &&
      !req.path.startsWith('/browser-sync')
    ) {
      currentLang = Object.keys(languages).includes(req.cookies.lang)
        ? req.cookies.lang
        : 'th';
      return res.redirect(resolveUrl(currentLang, req.originalUrl));
    }

    currentLang = req.path.slice(1, 3);
    const css = new Set();

    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    const insertCss = (...styles) => {
      styles.forEach(style => css.add(style._getCss()));
    };

    const initialState = {};
    const store = configureStore(initialState);

    const key = getCacheKey(req);
    const cacheData = redisConnect && (await webCache(key));
    let activeConfig =
      storeConfigInstant &&
      find(
        storeConfigInstant,
        config => config.locale === languages[currentLang],
      );

    // Apollo Header config
    const { client, cache } = CreateGraphqlClient({
      uri: configGraphql.graphqlUrl,
      headers: {
        ...customAttribute,
        store: activeConfig ? activeConfig.code : '',
        client: 'web',
        ...(userToken && { Authorization: `Bearer ${userToken}` }),
      },
      cacheData: cacheData ? JSON.parse(cacheData) : null,
      server: true,
    });

    // for case newly deploy and storeConfig is not load yet.
    if (!storeConfigInstant) {
      try {
        const {
          data: { storeConfigs },
        } = await client.query({
          query: GET_STORECONFIGS,
        });

        storeConfigInstant = storeConfigs;
        activeConfig = find(
          storeConfigInstant,
          config => config.locale === languages[currentLang],
        );
      } catch (error) {
        res.send(
          '<body style="margin: 0px;"><img data-message="can not fetch store config" style="width: 100%;" src="http://supersports-media-live-th.s3.amazonaws.com/Maintenance/SSP_Maintenance-02.jpg"></body>',
        );
        res.status(500).end();
        throw new Error('can not fetch store config');
      }
    }

    // set cookies to current language
    res.cookie('store', activeConfig.code);
    res.cookie('lang', currentLang);
    const translationLanguage = {};
    translationLanguage[languages[currentLang]] =
      translation[languages[currentLang]];

    // initial local state !!important
    cache.writeData({
      data: {
        base_url: configGraphql.clientUrl,
        locale: languages[currentLang],
        lang: currentLang,
        translation: JSON.stringify(translationLanguage),
        storeConfigs: storeConfigInstant,
        activeConfig: activeConfig,
      },
    });

    ///////
    await store.dispatch(loadStoreConfigsCompleted(storeConfigInstant));
    await store.dispatch(setLocale(currentLang));
    // await store.dispatch(loadTranslation(translation));

    const md = new MobileDetect(req.headers['user-agent']);
    const isMobile = !!md.mobile();
    const isTablet = !!md.tablet();
    const isBot = md.is('bot');

    const deviceDetect = {
      checkoutDevice: currentDevice,
      os: md.os(),
      isMobile,
      isTablet,
      isDesktop: isMobile !== true,
      isBot,
    };

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      insertCss,
      // The twins below are wild, be careful!
      pathname: req.path,
      query: req.query,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
      client,
      deviceDetect,
      customer: {},
      cms: getCmsContext(req),
    };

    if (userToken) {
      try {
        const customerData = await client.query({ query: GET_CUSTOMER });
        const customer = get(customerData, 'data.customer', '');
        const cookieLanguage = get(req.cookies, 'lang', '');
        const customerDefaultLanguage = get(
          customer,
          'custom_attributes.language',
          'th',
        );
        if (!cookieLanguage && customerDefaultLanguage) {
          const originalUrl = req.originalUrl.replace(/([\/])(th|en)/, '');

          return res
            .cookie('lang', customerDefaultLanguage)
            .redirect(resolveUrl(customerDefaultLanguage, originalUrl));
        }
        context.customer = {
          ...customer,
          mdcStoreCode: activeConfig.code,
          userToken: userToken,
        };
      } catch (error) {
        res.clearCookie('uut', { path: '/' });
      }
    } else {
      context.customer = {
        guest: {
          cartId: get(req.cookies, 'gct', ''),
        },
        mdcStoreCode: activeConfig.code,
      };
    }

    const route = await router.resolve(context);

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const customTheme = {
      ...theme,
      device: deviceDetect.isMobile === true ? 'mobile' : 'desktop',
    };

    const Root = () => (
      <CoreUiProvider client={client} theme={customTheme}>
        <App context={context}>{route.component}</App>
      </CoreUiProvider>
    );

    // allow apollo-react to fetch data in server side.
    if (!cacheData) {
      try {
        await getDataFromTree(<Root />);
        redisConnect &&
          redisClient.set(
            key,
            JSON.stringify(context.client.extract()),
            'EX',
            60 * 3,
          );
      } catch (error) {
        // console.error(error);
      }
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(<Root />);

    const sheet = new ServerStyleSheet();
    try {
      const styled = sheet.getStyleElement();
      data.styled = styled;
    } catch (error) {
    } finally {
      sheet.seal();
    }

    data.styles = [{ id: 'css', cssText: [...css].join('') }];

    const scripts = new Set();
    const addChunk = chunk => {
      if (chunks[chunk]) {
        chunks[chunk].forEach(asset => scripts.add(asset));
      } else if (__DEV__) {
        throw new Error(`Chunk with name '${chunk}' cannot be found`);
      }
    };
    addChunk('client');
    if (route.chunk) addChunk(route.chunk);
    if (route.chunks) route.chunks.forEach(addChunk);

    data.scripts = Array.from(scripts);

    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
      env: configGraphql.env,
      clientUrl: configGraphql.clientUrl,
      graphqlUrl: configGraphql.graphqlUrl,
      graphql: context.client.extract(),
      deviceDetect,
      customer: context.customer,
      userToken,
      cms: context.cms,
    };

    data.base = process.env.BASE_URL;

    const helmet = Helmet.renderStatic();
    const title = helmet.title.toComponent();
    const meta = helmet.meta.toComponent();
    const metaSeo = {
      fbAppId: configGraphql.facebook.fbAppId,
      fbPagesId: configGraphql.facebook.fbPagesId,
      siteVerification: configGraphql.google.siteVerification,
      gtmID: configGraphql.analytics.gtmID,
    };

    const customClientConfig = {
      ...clientConfig,
    };

    const html = ReactDOM.renderToStaticMarkup(
      <Html
        {...data}
        clientConfig={customClientConfig}
        helmetTitle={title}
        meta={meta}
        metaSeo={metaSeo}
      />,
    );

    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    // console.log(err);
    next(err);
  }
});

const getCacheKey = req => {
  return `${req.path}`;
};

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
