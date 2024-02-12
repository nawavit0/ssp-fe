const loginT1C = async (req, res) => {
  const isLogin = req.user ? req.user.token : null;
  try {
    const response = isLogin
      ? await connectT1ByCustomer(req)
      : await connectT1ByGuestId(req);

    if (response.message) {
      return res.json({
        the1card: null,
        message: response.message,
        status: 'error',
      });
    }

    return res.json({ the1card: response });
  } catch (e) {
    return res.status(500).json({
      the1card: '',
      status: 'error',
    });
  }
};

const connectT1ByCustomer = async req => {
  const { email, password } = req.body;
  return await req.service.post(
    '/carts/mine/t1c/balance',
    {
      email,
      password,
    },
    {
      authorizationToken: req.user.token,
    },
  );
};

const connectT1ByGuestId = async req => {
  const { email, password } = req.body;
  const cartId = req.cookies.gct;

  if (!cartId) throw new Error('no guest token');

  return await req.service.post(
    `/guest-carts/${cartId}/t1c/balance`,
    {
      email,
      password,
    },
    { auth: false },
  );
};

const redeemT1C = async (req, res) => {
  const isLogin = req.user ? req.user.token : null;
  try {
    const response = isLogin
      ? await redeemT1CByCustomer(req)
      : await redeemT1CByGuestId(req);

    if (response.message) {
      return res.json({
        message: response.message,
        status: 'error',
      });
    }

    return res.json({ status: 'success' });
  } catch (e) {
    return res.status(500).json({
      the1card: e.message || '',
      status: 'error',
    });
  }
};

const redeemT1CByCustomer = async req => {
  const { points } = req.body;

  return await req.service.put(
    '/carts/mine/t1c',
    {
      points: points,
    },
    {
      authorizationToken: req.user.token,
    },
  );
};

const redeemT1CByGuestId = async req => {
  const { points } = req.body;
  const cartId = req.cookies.guest;

  return await req.service.put(
    `/guest-carts/${cartId}/t1c`,
    {
      points: points,
    },
    { auth: false },
  );
};

const removePointT1C = async (req, res) => {
  const isLogin = req.user ? req.user.token : null;
  try {
    const response = isLogin
      ? await removePointT1CByCustomer(req)
      : await removePointT1CByGuestId(req);

    if (response.message) {
      return res.json({
        message: response.message,
        status: 'error',
      });
    }

    return res.json({ status: 'success' });
  } catch (e) {
    return res.status(500).json({
      message: e.message || '',
      status: 'error',
    });
  }
};

const removePointT1CByCustomer = async req => {
  return await req.service.delete(
    '/carts/mine/t1c',
    {},
    {
      authorizationToken: req.user.token,
    },
  );
};

const removePointT1CByGuestId = async req => {
  const cartId = req.cookies.guest;

  return await req.service.delete(
    `/guest-carts/${cartId}/t1c`,
    {},
    { auth: false },
  );
};

export default {
  loginT1C,
  redeemT1C,
  removePointT1C,
};
