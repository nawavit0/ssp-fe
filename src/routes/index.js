// import { setLocale } from '../reducers/locale/actions';
// import { setPageName } from '../reducers/tracking/actions';
// import { get, isEmpty } from 'lodash';

/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '/:lang?',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    {
      path: '/jwt',
      load: () => import(/* webpackChunkName: 'setJwt' */ './jwt'),
    },
    {
      path: ['/search', '/search/:query'],
      load: () => import(/* webpackChunkName: 'search' */ './search'),
    },
    {
      path: ['/store', '/store/:urlKey'],
      load: () => import(/* webpackChunkName: 'store' */ './store'),
    },
    {
      path: '/redirect',
      load: () => import(/* webpackChunkName: 'auth' */ './redirect'),
    },
    {
      path: '/product-sku',
      load: () =>
        import(/* webpackChunkName: 'productRedirect' */ './productRedirect'),
    },
    {
      path: '/login',
      load: () => import(/* webpackChunkName: 'mobile-login' */ './login'),
    },
    {
      path: '/login/redirect',
      load: () => import(/* webpackChunkName: 'auth' */ './login-redirect'),
    },
    {
      path: '/user/forgot-password',
      load: () => import(/* webpackChunkName: 'auth' */ './forgotPassword'),
    },
    // {
    //   path: '/forgot_password/reset/:token',
    //   load: () =>
    //     import(
    //       /* webpackChunkName: 'reset-password' */ './forgot-password/reset'
    //     ),
    // },
    {
      path: '/user/reset-password',
      load: () => import(/* webpackChunkName: 'auth' */ './reset-password'),
    },
    {
      path: '/register',
      load: () => import(/* webpackChunkName: 'auth' */ './register'),
    },
    {
      path: '/logout',
      load: () => import(/* webpackChunkName: 'auth' */ './logout'),
    },
    {
      path: '/registerSuccess',
      load: () => import(/* webpackChunkName: 'auth' */ './registerSuccess'),
    },
    {
      path: '/brands',
      load: () =>
        import(
          /* webpackChunkName: 'alphabetic-brands-index' */ './alphabeticBrandsIndex'
        ),
    },
    {
      path: '/cart',
      load: () => import(/* webpackChunkName: 'cart' */ './cart'),
    },
    {
      path: '/checkout/payment',
      load: () => import(/* webpackChunkName: 'payment' */ './payment'),
    },
    {
      path: '/checkout',
      load: () => import(/* webpackChunkName: 'checkout' */ './checkout'),
    },
    {
      path: '/checkout/completed/:id',
      load: () =>
        import(
          /* webpackChunkName: 'order-complete' */ './payment-callback/complete'
        ),
    },
    {
      path: '/checkout/failed/:id',
      load: () =>
        import(/* webpackChunkName: 'order-fail' */ './payment-callback/fail'),
    },
    {
      path: '/account',
      load: () => import(/* webpackChunkName: 'account' */ './account'),
      children: [
        {
          path: '/overview',
          load: () =>
            import(
              /* webpackChunkName: 'account' */ './account/AccountOverview'
            ),
        },
        {
          path: '/change-password',
          load: () =>
            import(
              /* webpackChunkName: 'account' */ './account/ChangePassword'
            ),
        },
        {
          path: '/return',
          load: () =>
            import(/* webpackChunkName: 'account' */ './account/Return'),
        },
        {
          path: '/detail',
          load: () =>
            import(/* webpackChunkName: 'account' */ './account/AccountDetail'),
        },
        {
          path: '/profile',
          load: () =>
            import(
              /* webpackChunkName: 'account' */ './account/AccountProfile'
            ),
        },
        // {
        //   path: '/profile/edit',
        //   load: () =>
        //     import(/* webpackChunkName: 'account' */ './account/AccountProfileEdit'),
        // },
        {
          path: '/address',
          load: () =>
            import(
              /* webpackChunkName: 'account' */ './account/AccountAddress'
            ),
        },
        {
          path: '/address/new',
          load: () =>
            import(
              /* webpackChunkName: 'account' */ './account/AccountAddressEdit'
            ),
        },
        {
          path: '/address/edit/:id',
          load: () =>
            import(
              /* webpackChunkName: 'account' */ './account/AccountAddressEdit'
            ),
        },
        {
          path: '/wishlist',
          load: () =>
            import(/* webpackChunkName: 'account' */ './account/Wishlist'),
        },
        {
          path: '/orders',
          load: () =>
            import(/* webpackChunkName: 'account' */ './account/OrderHistory'),
        },
        {
          path: '/orders/:id',
          load: () =>
            import(/* webpackChunkName: 'account' */ './account/OrderDetail'),
        },
        {
          path: '',
          load: () =>
            import(/* webpackChunkName: 'account' */ './account/AccountDetail'),
        },
        // {
        //   path: '(.*)',
        //   load: () =>
        //     import(/* webpackChunkName: 'not-found' */ './account/not-found'),
        // },
      ],
    },
    // {
    //   path: '/wishlist',
    //   load: () => import(/* webpackChunkName: 'wishlist' */ './wishlist'),
    // },
    // {
    //   path: '/origins',
    //   load: () => import(/* webpackChunkName: 'origins' */ './origins'),
    // },
    {
      path: '/guest-login',
      load: () => import(/* webpackChunkName: 'auth' */ './guest-login'),
    },
    {
      path: '/orders/tracking',
      load: () =>
        import(/* webpackChunkName: 'orders-tracking' */ './orders-tracking'),
    },
    // {
    //   path: '/category/:slug*',
    //   load: () => import(/* webpackChunkName: 'url-rewrite' */ './url-rewrite'),
    // },
    {
      path: '/:slug*/products/:category*',
      load: () => import(/* webpackChunkName: 'urlRewrite' */ './urlRewrite'),
    },
    {
      path: '/:slug*/products',
      load: () => import(/* webpackChunkName: 'urlRewrite' */ './urlRewrite'),
    },
    {
      path: '/:slug*',
      load: () => import(/* webpackChunkName: 'urlRewrite' */ './urlRewrite'),
    },
  ],

  async action(context, params) {
    const { next } = context;
    const { lang } = params;

    // context.store.dispatch(setLocale(lang));

    // Execute each child route until one of them return the result
    const route = await next();

    // Guard middleware
    if (route.guard && route.guard.condition) {
      return { redirect: `/${lang}${route.guard.redirect}` };
    }

    // Provide default values for title, description etc.
    // route.title = `${route.title}`;
    // route.description = route.description || '';
    // route.keywords = route.keywords || '';
    // route.canonical = context.pathname;
    // route.lang = lang;

    let canonical = context.pathname;
    const isStartWithTH = canonical.substring(0, 3) === '/th';
    if (isStartWithTH) {
      canonical = canonical.substring(3);
    }
    route.canonical = decodeURIComponent(canonical);
    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
