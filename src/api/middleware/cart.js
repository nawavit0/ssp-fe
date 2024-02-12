import { map, merge, omit, uniqBy } from 'lodash';
import CartModel from '../../model/Cart/Cart';
import { explode } from '../../utils/customAttributes';

const fetch = async (req, res) => {
  try {
    const isLogin = req.user ? req.user.token : null;
    const response = isLogin
      ? await getCustomerCart(req, res)
      : await getGuestCart(req, res);

    const cart = new CartModel();
    cart.initialData(response);

    let products = await Promise.all(
      map(cart.items, item => {
        // if (item.product_type === 'configurable') {
        //   req.service
        //     .get(
        //       `/products/${item.extension_attributes.parent_sku}`,
        //       {},
        //       { version: '/V2' },
        //     )
        //     .then(result => {
        //       console.log(
        //         'group_sku',
        //         get(
        //           result,
        //           'extension_attributes.configurable_product_links',
        //           [],
        //         ),
        //       );
        //     });
        //   console.log('par', parentSku);
        //   return {
        //     ...item,
        //     group_sku: parentSku.extension_attributes.configurable_product_links,
        //   };
        // }
        return req.service.get(`/products/${item.sku}`, {}, { version: '/V2' });
      }),
    );

    // products = map(cart.items, item => {
    //   if (item.product_type === 'configurable') {
    //     console.log('ex', item.extension_attributes);
    //     const parentSku = req.service.get(
    //       `/products/${item.extension_attributes.parent_sku}`,
    //       {},
    //       { version: '/V2' },
    //     );
    //     console.log('par', parentSku)
    //     return {
    //       ...item,
    //       group_sku: parentSku.extension_attributes.configurable_product_links,
    //     };
    //   }
    // });
    //
    // console.log(products)

    // const groupSku = map(cart.items, item => {
    //   console.log(item);
    //   if (item.product_type === 'configurable') {
    //     return req.service.get(
    //       `/products/${item.extension_attributes.parent_sku}`,
    //       {},
    //       { version: '/V2' },
    //     );
    //     // console.log('aaa', parentSku)
    //     // return {
    //     //   ...item,
    //     //   group_sku: parentSku.extension_attributes.configurable_product_links,
    //     // };
    //   }
    // });
    //
    // console.log(groupSku);

    products = products.map(item => {
      return {
        ...item,
        original_price: parseFloat(item.price),
      };
    });

    merge(cart.items, explode(products));

    return res.json({ cart });
  } catch (e) {
    return res.status(500).json({ cart: null, status: 'error', message: e });
  }
};

const createGuestCart = async (req, res) => {
  const guestCartId = await req.service.post('/guest-carts');
  res.cookie('gct', guestCartId, {
    maxAge: 31556952000,
    httpOnly: true,
  });
  return guestCartId;
};

const getCustomerCart = async req => {
  try {
    const response = await req.service.get(
      '/carts/mine',
      {},
      { authorizationToken: req.user.token },
    );
    return response;
  } catch (error) {
    await req.service.post(
      '/carts/mine',
      {},
      { authorizationToken: req.user.token },
    );

    const response = await req.service.get(
      '/carts/mine',
      {},
      { authorizationToken: req.user.token },
    );

    return response;
  }
};

const getGuestCart = async (req, res) => {
  try {
    let guestCartId = req.cookies.gct;

    if (!guestCartId) {
      guestCartId = await createGuestCart(req, res);
    }

    let cart;
    cart = await req.service.get(`/guest-carts/${guestCartId}`, '', {
      auth: false,
    });
    if (cart && cart.is_active === false) {
      guestCartId = await createGuestCart(req, res);
      cart = await req.service.get(`/guest-carts/${guestCartId}`);
    }

    return cart;
  } catch (error) {
    const guestCartId = await createGuestCart(req, res);
    const cart = await req.service.get(`/guest-carts/${guestCartId}`);
    return cart;
  }
};

const fetchTotals = async (req, res) => {
  const userToken = req.user.token;
  let response = {};

  if (userToken) {
    const totals = await req.service.get(
      '/carts/mine/totals',
      {},
      { authorizationToken: req.user.token },
    );
    response = {
      totals: totals,
    };
  } else {
    response = {
      totals: {},
      status: 'error',
    };
  }

  return res.json(response);
};

const addToCart = async (req, res) => {
  try {
    const { cartId, sku, qty, productOptions } = req.body;
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.gct;

    let currentCartID = cartId;

    if (!currentCartID && isLogin) {
      const response = await getCustomerCart(req, res);
      currentCartID = response.id;
    }

    const body = {
      cartItem: {
        quote_id: isLogin ? currentCartID : guestCartId,
        qty: qty || 1,
        sku: sku,
      },
    };

    if (productOptions) {
      body.cartItem.product_option = productOptions;
    }

    const response = isLogin
      ? await req.service.post('/carts/mine/items', body, {
          authorizationToken: req.user.token,
        })
      : await req.service.post(`/guest-carts/${guestCartId}/items`, body, {
          auth: false,
        });

    if (response.message) {
      return res.json({
        cartItem: null,
        message: response.message,
        status: 'error',
      });
    }

    return res.json({ cartItem: response });
  } catch (e) {
    return res.boom.serverUnavailable(e.message);
  }
};

const changeItemQty = async (req, res) => {
  try {
    const { cartId, itemId, qty } = req.body;
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.gct;
    const body = {
      cartItem: {
        quote_id: isLogin ? cartId : guestCartId,
        qty,
        item_id: itemId,
      },
    };

    const response = isLogin
      ? await req.service.put(`/carts/mine/items/${itemId}`, body, {
          authorizationToken: req.user.token,
        })
      : await req.service.put(
          `/guest-carts/${guestCartId}/items/${itemId}`,
          body,
          { auth: false },
        );

    return res.json({ cartItem: response, status: 'success' });
  } catch (e) {
    return res.boom.serverUnavailable(e.message);
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.gct;

    const response = isLogin
      ? await req.service.delete(
          `/carts/mine/items/${itemId}`,
          {},
          { authorizationToken: req.user.token },
        )
      : await req.service.delete(
          `/guest-carts/${guestCartId}/items/${itemId}`,
          {},
          { auth: false },
        );

    if (response.message) {
      return res.json({ status: 'error', message: response.message });
    }

    return res.json({ status: 'success' });
  } catch (e) {
    return res.boom.serverUnavailable(e.message);
  }
};

const estimateShipping = async (req, res) => {
  const isLoggedIn = req.user && req.user.token;
  try {
    const response = isLoggedIn
      ? await estimateMyShipping(req)
      : await estimateGuestShipping(req);

    return res.json({ shippingMethods: response });
  } catch (e) {
    const data = e.response ? e.response.data : undefined;
    return res.boom.serverUnavailable(e.message, data);
  }
};

const estimateMyShipping = async req => {
  let { address } = req.body;
  address = transFormAddress(address);
  return await req.service.post(
    `/carts/mine/estimate-shipping-methods`,
    { address: omit(address, ['id', 'region']) },
    { authorizationToken: req.user.token },
  );
};

const transFormAddress = address => {
  return {
    ...address,
    customer_id: address.customer_id ? parseInt(address.customer_id) : 0,
    region_id: address.region_id ? parseInt(address.region_id) : 0,
    subdistrict_id: address.subdistrict_id
      ? parseInt(address.subdistrict_id)
      : 0,
    district_id: address.district_id ? parseInt(address.district_id) : 0,
  };
};

const estimateGuestShipping = async req => {
  const cartId = req.cookies.gct;
  if (!cartId) {
    throw new Error('no guest token');
  }
  let { address } = req.body;
  address = transFormAddress(address);
  return await req.service.post(
    `/guest-carts/${cartId}/estimate-shipping-methods`,
    { address: omit(address, ['id', 'region']) },
    { auth: false },
  );
};

const putCoupon = async (req, res) => {
  try {
    const { coupons } = req.body;
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.gct;

    const response = isLogin
      ? await req.service.put(
          `/carts/mine/coupons/${coupons}`,
          {},
          { authorizationToken: req.user.token },
        )
      : await req.service.put(
          `/guest-carts/${guestCartId}/coupons/${coupons}`,
          {},
          { auth: false },
        );

    if (response.message) {
      return res
        .status(404)
        .json({ status: 'error', message: response.message });
    }
    if (response) {
      return res.json({ status: 'success' });
    }
    return res.status(500).json({ status: 'error' });
  } catch (e) {
    return res.status(e.status || 500).json({ status: 'error', error: e });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.guest;

    const response = isLogin
      ? await req.service.delete(
          `/carts/mine/coupons`,
          {},
          { authorizationToken: req.user.token },
        )
      : await req.service.delete(
          `/guest-carts/${guestCartId}/coupons`,
          {},
          { auth: false },
        );

    if (response.message) {
      return res.json({ status: 'error', message: response.message });
    }

    return res.json({ status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};

const putGiftWrapping = async (req, res) => {
  try {
    const { optionId } = req.params;
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.guest;

    const body = {
      gift_message: {
        extension_attributes: {
          wrappingId: optionId,
        },
      },
    };

    const response = isLogin
      ? await req.service.post(`/carts/mine/gift-message`, body, {
          authorizationToken: req.user.token,
        })
      : await req.service.post(
          `/guest-carts/${guestCartId}/gift-message`,
          body,
          { auth: false },
        );

    if (response.message) {
      return res.json({ status: 'error' });
    }

    return res.json({ response, status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};

const fetchGiftWrapping = async (req, res) => {
  try {
    const { items } = await req.service.get('/gift-wrappings', { status: 1 });

    return res.json({ options: items, status: 'success' });
  } catch (e) {
    return res
      .status(500)
      .json({ giftWrapping: {}, status: 'error', message: e });
  }
};

const deleteGiftWrapping = async (req, res) => {
  try {
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.guest;

    const body = {
      message: null,
      gift_message: {
        extension_attributes: {
          wrapping_id: null,
        },
      },
    };

    const response = isLogin
      ? await req.service.post(`/carts/mine/gift-message`, body, {
          authorizationToken: req.user.token,
        })
      : await req.service.post(
          `/guest-carts/${guestCartId}/gift-message`,
          body,
          { auth: false },
        );

    if (response.message) {
      return res.json({ status: 'error' });
    }

    return res.json({ response, status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};

const changeGiftMessage = async (req, res) => {
  try {
    const { giftMessage, extension_attributes } = req.body;
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.guest;
    const body = {
      giftMessage: {
        message: giftMessage,
        extension_attributes,
      },
    };

    const response = isLogin
      ? await req.service.post(`/carts/mine/gift-message/`, body, {
          authorizationToken: req.user.token,
        })
      : await req.service.post(
          `/guest-carts/${guestCartId}/gift-message/`,
          body,
          { auth: false },
        );

    if (response.message) {
      return res.json({ message: response.message, status: 'error' });
    }

    return res.json({ status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};

const addPromo = async (req, res) => {
  try {
    const isLogin = req.user ? req.user.token : null;
    const guestCartId = req.cookies.guest;
    const { items } = req.body;

    const response = isLogin
      ? await req.service.post(
          `/carts/mine/promo/add`,
          { items: items },
          {
            authorizationToken: req.user.token,
          },
        )
      : await req.service.post(
          `/guest-carts/${guestCartId}/promo/add`,
          { items: items },
          { auth: false },
        );

    return res.json({ response });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: error });
  }
};

const guestCartTransfer = async (req, res) => {
  try {
    const guestCartId = req.cookies.guest;
    const guestCart = await req.service.get(`/guest-carts/${guestCartId}`);
    const guestCartItems = guestCart.items;
    const customerCart = await getCustomerCart(req, res);
    const customerCartItems = customerCart.items;

    const { merge } = req.body;
    const tmpCartItems = [];

    // Customer Cart
    if (merge) {
      map(customerCartItems, item => {
        if (item.price !== 0) {
          tmpCartItems.push({
            sku: item.sku,
            qty: item.qty,
          });
        }
      });
    }

    // Guest Cart
    map(guestCartItems, item => {
      if (item.price !== 0) {
        tmpCartItems.push({
          sku: item.sku,
          qty: item.qty,
        });
      }
    });

    // remove duplicate item where minim qty
    const cartItems = uniqBy(
      tmpCartItems,
      // orderBy(tmpCartItems, ['sku', 'qty'], ['asc', 'desc']),
      'sku',
    );

    const response = await req.service.post(
      '/carts/mine/replaceMulti',
      { cartItems: cartItems },
      { authorizationToken: req.user.token },
    );

    await req.service.post(
      '/carts/mine/billing-address',
      {
        address: {},
        cartId: customerCart.id,
      },
      {
        authorizationToken: req.user.token,
      },
    );

    // Clear guest cookie
    res.clearCookie('guest');

    return res.json({ response });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: error });
  }
};

export default {
  fetch,
  fetchTotals,
  addToCart,
  changeItemQty,
  deleteItem,
  estimateShipping,
  putCoupon,
  deleteCoupon,
  putGiftWrapping,
  fetchGiftWrapping,
  deleteGiftWrapping,
  changeGiftMessage,
  addPromo,
  guestCartTransfer,
};
