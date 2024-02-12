import { omit, get } from 'lodash';

const createOrder = async (req, res) => {
  const isLoggedIn = req.user ? req.user.token : null;

  try {
    const response = isLoggedIn
      ? await createMyOrder(req)
      : await createGuestOrder(req);

    if (response.message) {
      return res.json({
        order: null,
        status: 'error',
        message: response.message,
      });
    }

    return res.json({ order: response });
  } catch (e) {
    const data = e.response ? e.response.data : undefined;
    return res.boom.serverUnavailable(e.message, data);
  }
};

const createMyOrder = async req => {
  const { paymentMethod, billingAddress, cartId } = req.body;
  const address = omit(billingAddress, ['id', 'region']);
  const response = await req.service.post(
    '/carts/mine/payment-information',
    {
      cartId,
      paymentMethod,
      billingAddress: {
        ...address,
      },
    },
    {
      authorizationToken: req.user.token,
    },
  );

  return response;
};

const createGuestOrder = async req => {
  const guestCartId = req.cookies.gct;
  if (!guestCartId) {
    throw new Error('no guest token');
  }

  const { email, paymentMethod, billingAddress } = req.body;
  const address = omit(billingAddress, ['id', 'region']);

  const response = await req.service.post(
    `/guest-carts/${guestCartId}/payment-information`,
    {
      email,
      paymentMethod,
      billingAddress: {
        ...address,
      },
    },
    { auth: false },
  );
  return response;
};

const getOrderInfo = async (req, res) => {
  try {
    const response = await req.service.get(
      `/orders?searchCriteria[filter_groups][0][filters][0][field]=customer_id&searchCriteria[filter_groups][0][filters][0][value]=${req.params.id}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC&searchCriteria[pageSize]=20&searchCriteria[currentPage]=1`,
      {},
    );
    if (response.message) {
      return res.json({ order: null, status: 'error' });
    }
    return res.json({ order: response });
  } catch (e) {
    const data = e.response ? e.response.data : undefined;
    return res.boom.serverUnavailable(e.message, data);
  }
};

const createShippingInfo = async (req, res) => {
  const isLoggedIn = req.user && req.user.token;

  try {
    const response = isLoggedIn
      ? await createMyShippingInfo(req)
      : await createGuestShippingInfo(req);

    return res.json({ shippingInfo: response });
  } catch (e) {
    const data = e.response ? e.response.data : undefined;
    return res.boom.serverUnavailable(e.message, data);
  }
};

const createMyShippingInfo = async req => {
  const { addressInformation } = req.body;

  if (!get(addressInformation, 'shipping_address.address_id')) {
    addressInformation.shipping_address.address_id = 0;
  }

  if (!get(addressInformation, 'shipping_address.customer_id')) {
    addressInformation.shipping_address.customer_id = 0;
  }

  if (!get(addressInformation, 'billing_address.address_id')) {
    addressInformation.billing_address.address_id = 0;
  }

  if (!get(addressInformation, 'billing_address.customer_id')) {
    addressInformation.billing_address.customer_id = 0;
  }

  const response = await req.service.post(
    '/carts/mine/shipping-information',
    { addressInformation },
    {
      authorizationToken: req.user.token,
    },
  );
  return response;
};

const createGuestShippingInfo = async req => {
  const cartId = req.cookies.gct;
  if (!cartId) {
    throw new Error('no guest token');
  }

  const { addressInformation } = req.body;
  if (
    get(addressInformation, 'shipping_address.customer_id') &&
    typeof addressInformation.shipping_address.customer_id !== 'number'
  ) {
    addressInformation.shipping_address.customer_id = parseInt(
      addressInformation.shipping_address.customer_id,
    );
  } else {
    delete addressInformation.shipping_address.customer_id;
  }
  if (
    get(addressInformation, 'billing_address.customer_id') &&
    typeof addressInformation.billing_address.customer_id !== 'number'
  ) {
    addressInformation.billing_address.customer_id = parseInt(
      addressInformation.billing_address.customer_id,
    );
  } else {
    delete addressInformation.billing_address.customer_id;
  }

  const response = await req.service.post(
    `/guest-carts/${cartId}/shipping-information`,
    { addressInformation },
    { auth: false },
  );
  return response;
};

const createBillingInfo = async (req, res) => {
  try {
    const { address } = req.body;
    const isLogin = req.user ? req.user.token : null;

    if (!isLogin) {
      const cartId = req.cookies.gct;
      if (!cartId) {
        throw new Error('no guest token');
      }

      const response = await req.service.post(
        `/guest-carts/${cartId}/billing-address`,
        { address },
        { auth: false },
      );

      return res.json({ response });
    }

    const response = await req.service.post(
      '/carts/mine/billing-address',
      { address },
      {
        authorizationToken: req.user.token,
      },
    );

    return res.json({ response });
  } catch (e) {
    const data = e.response ? e.response.data : undefined;
    return res.boom.serverUnavailable(e.message, data);
  }
};

export default {
  createOrder,
  getOrderInfo,
  createShippingInfo,
  createBillingInfo,
};
