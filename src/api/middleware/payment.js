// import { isEmpty, find } from 'lodash';
// import PaymentModel from '../../model/Payment/Payment';

const fetch = async (req, res) => {
  const isLoggedIn = req.user ? req.user.token : null;

  try {
    const response = isLoggedIn
      ? await getMemberPayment(req)
      : await getGuestPayment(req);

    return res.json({ payment: response });
  } catch (e) {
    const data = e.response ? e.response.data : null;
    return res.boom.serverUnavailable(e.message, data);
  }
};

const getMemberPayment = async req => {
  const response = await req.service.get(
    '/carts/mine/payment-information',
    {},
    {
      authorizationToken: req.user.token,
    },
  );
  return response;
};

const getGuestPayment = async req => {
  const guestCartId = req.cookies.gct;
  if (!guestCartId) {
    throw new Error('no guest token');
  }

  const url = `/guest-carts/${guestCartId}/payment-information`;
  return await req.service.get(url, {}, { auth: false });
};

const setPaymentInfo = async (req, res) => {
  try {
    const { paymentMethod, email, extension_attributes } = req.body;
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.gct;

    let response;
    const body = {
      method: paymentMethod,
      extension_attributes: {},
    };

    if (paymentMethod === 'p2c2p_ipp') {
      body.extension_attributes = extension_attributes;
    }

    if (isLogin) {
      response = await req.service.post(
        `/carts/mine/set-payment-information`,
        {
          payment_method: body,
        },
        { authorizationToken: req.user.token },
      );
    } else {
      response = await req.service.post(
        `/guest-carts/${guestCartId}/set-payment-information`,
        {
          email: email,
          payment_method: body,
        },
        { auth: false },
      );
    }

    if (response.message) {
      return res.json({ status: 'error', message: response.message });
    }

    return res.json({ cartItem: response, status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};

const applyCreditCardOntop = async (req, res) => {
  try {
    const { paymentMethod, promoId, email } = req.body;
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.gct;

    let response;
    if (isLogin) {
      response = await req.service.post(
        `/carts/mine/set-payment-information`,
        {
          payment_method: {
            method: paymentMethod,
            extension_attributes: {
              promotion_id: promoId,
            },
          },
        },
        { authorizationToken: req.user.token },
      );
    } else {
      response = await req.service.post(
        `/guest-carts/${guestCartId}/set-payment-information`,
        {
          email: email,
          payment_method: {
            method: paymentMethod,
            extension_attributes: {
              promotion_id: promoId,
            },
          },
        },
        { auth: false },
      );
    }

    if (response.message) {
      return res.json({ status: 'error', message: response.message });
    }

    return res.json({ cartItem: response, status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};

export default {
  fetch,
  setPaymentInfo,
  applyCreditCardOntop,
};
