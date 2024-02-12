import logger from '../logger';
import { CustomerType } from '../../model/Auth/CustomerType';
import { sign } from 'jsonwebtoken';
import config from '../config';
import { map, uniqBy, isUndefined } from 'lodash';

const settings = {
  USER_TOKEN: 'uut',
  COOKIE_PARAMS: { maxAge: 31_556_952_000 }, //1 year
};

const register = async (req, res) => {
  try {
    const { customerType, customer, subscribe } = req.body;
    let response;

    if (customerType === CustomerType.CORPORATE) {
      const personalModel = {};
      personalModel.firstName = customer.companyName;
      personalModel.lastName = customer.companyName;
      personalModel.email = customer.email;
      personalModel.password = customer.password;
      personalModel.cellPhone = customer.telephone;

      // create user
      const personalResp = await registerPersonal(
        req,
        personalModel,
        subscribe,
      );

      // create company
      const corporateModel = customer;
      corporateModel.userId = personalResp.id;
      response = await registerCorporate(req, corporateModel, subscribe);
    } else {
      response = await registerPersonal(req, customer, subscribe);
    }

    return res.json(response);
  } catch (e) {
    logger('authController.register', e);
    return res.status(500).json(e);
  }
};

const login = async (req, res) => {
  try {
    const { email: username, password } = req.body;
    const token = await req.service.post('/integration/customer/token', {
      username,
      password,
    });

    const jwtToken = sign({ token }, config.cookie_secret_key);
    res.cookie(settings.USER_TOKEN, jwtToken, settings.COOKIE_PARAMS);

    return res.status(200).send();
  } catch (e) {
    return res.status(e.status || 500).json({
      status: e.statusText || 'error',
      cause: e.message,
    });
  }
};

const logout = async (req, res) => {
  return (
    res
      .clearCookie(settings.USER_TOKEN)
      // .clearCookie('guest')
      .clearCookie('io')
      .status(200)
      .send()
  );
};

const fbAuth = async (req, res) => {
  try {
    const params = {
      social_id: req.query.social_id,
      social_type: 'facebook',
    };

    const token = await req.service.post(
      '/integration/customer/social_token',
      params,
    );

    const jwtToken = sign({ token }, config.cookie_secret_key);

    res.cookie(settings.USER_TOKEN, jwtToken, settings.COOKIE_PARAMS);

    const customerCart = await req.service.get(
      '/carts/mine',
      {},
      { authorizationToken: token },
    );
    const customerCartItems = customerCart.items;
    const tmpCartItems = [];

    const mergeCart = req.cookies.mergeCartFB;

    if (mergeCart === 'true') {
      // Customer Cart
      map(customerCartItems, item => {
        if (item.price !== 0) {
          tmpCartItems.push({
            sku: item.sku,
            qty: item.qty,
          });
        }
      });
    }

    const guestCartId = req.cookies.guest;
    if (!isUndefined(guestCartId)) {
      const guestCart = await req.service.get(`/guest-carts/${guestCartId}`);
      const guestCartItems = guestCart.items;
      // Guest Cart
      map(guestCartItems, item => {
        if (item.price !== 0) {
          tmpCartItems.push({
            sku: item.sku,
            qty: item.qty,
          });
        }
      });
    }

    // remove duplicate item where minim qty
    const cartItems = uniqBy(
      tmpCartItems,
      // orderBy(tmpCartItems, ['sku', 'qty'], ['asc', 'desc']),
      'sku',
    );

    await req.service.post(
      '/carts/mine/replaceMulti',
      { cartItems: cartItems },
      { authorizationToken: token },
    );

    await req.service.post(
      '/carts/mine/billing-address',
      {
        address: {},
        cartId: customerCart.id,
      },
      {
        authorizationToken: token,
      },
    );

    // Clear guest cookie
    res.clearCookie('guest');

    return res.redirect('/login/redirect');
  } catch (e) {
    logger('authController.fbAction', e);
    return res.status(500).json({ status: 'error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const params = {
      email: req.body.email,
      template: 'email_reset',
    };

    const response = await req.service.put('/customers/password', params);

    if (response === true) {
      return res.send();
    }
    return res.status(400).send();
  } catch (e) {
    logger('authController.forgotPassword', e);
    return res.status(500).json({ status: 'error', e });
  }
};

const resetPassword = async (req, res) => {
  try {
    const params = {
      email: req.body.email,
      newPassword: req.body.newPassword,
      resetToken: req.body.resetToken,
    };
    const response = await req.service.post('/customers/resetPassword', params);

    if (response === true) {
      return res.status(200).json({ status: 'success' });
    }

    return res.status(400).json(response);
  } catch (e) {
    return res.status(500).json(e);
  }
};

export default {
  login,
  logout,
  register,
  fbAuth,
  forgotPassword,
  resetPassword,
};

const registerPersonal = async (req, personalModel, subscribe) =>
  req.service.post(
    '/customers',
    personalToMagentoCustomer(personalModel, subscribe),
  );

const registerCorporate = async (req, customerModel, subscribe) =>
  req.service.post(
    '/company',
    corporateToMagentoCustomer(customerModel, subscribe),
  );

const personalToMagentoCustomer = (personalModel, subscribe) => {
  const firstname = personalModel.firstName;
  const lastname = personalModel.lastName;

  return {
    customer: {
      firstname,
      lastname,
      custom_attributes: personalModel.custom_attributes || [],
      email: personalModel.email,
      extension_attributes: { is_subscribed: subscribe },
    },
    password: personalModel.password,
  };
};

const corporateToMagentoCustomer = (corporateModel, subscribe) => {
  const na = 'n/a';
  return {
    company: {
      company_name: corporateModel.companyName,
      company_email: corporateModel.email,
      street: [na],
      city: na,
      country_id: 'TH',
      region: 'BKK',
      region_id: 570,
      postcode: na,
      telephone: corporateModel.telephone || na,
      vat_tax_id: corporateModel.taxNo,
      super_user_id: corporateModel.userId,
      customer_group_id: 1,
      extension_attributes: { is_subscribed: subscribe },
      custom_attributes: corporateModel.custom_attributes || [],
    },
  };
};
