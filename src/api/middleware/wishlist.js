// import { map, merge, isEmpty, get as prop } from 'lodash';
import logger from '../logger';

//Start Group
const fetchGroup = async (req, res) => {
  try {
    const params = req.query;
    const groups = await req.service.get(`/wishlists`, params);

    return res.json({ groups });
  } catch (e) {
    logger('wishlistController.fetchGroup', e);
    return res.status(500).json({ groups: {}, status: 'error' });
  }
};

const addGroup = async (req, res) => {
  try {
    const { name, cusID } = req.body;
    const response = await req.service.put(`/wishlist`, {
      wishlistData: {
        name: name,
        customer_id: cusID,
      },
    });

    if (response.message) {
      return res.json({
        wishlistData: null,
        message: response.message,
        status: 'error',
      });
    }

    return res.json({ wishlistData: response, status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupID } = req.body;
    const response = await req.service.delete(`/wishlist/${groupID}`);
    if (response.message) {
      return res.json({ status: 'error', message: response.message });
    }

    return res.json({ status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};
const editGroup = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;
    const response = await req.service.post(`/wishlist/${slug}`, {
      wishlistData: {
        name: name,
      },
    });

    if (response.message) {
      return res.json({
        wishlistData: null,
        message: response.message,
        status: 'error',
      });
    }

    return res.json({ wishlistData: response, status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};

//End Group

//Start List
const fetchList = async (req, res) => {
  try {
    const params = req.query;
    const lists = await req.service.get(
      `/wishlist/${params.wishlist_id}`,
      {},
      {
        magentoParams: false,
      },
    );

    // if (!isEmpty(prop(lists, 'items'))) {
    //   const productIDsString = map(
    //     lists.items,
    //     item => `${item.product_id}`,
    //   ).join(',');
    //   const body = {
    //     filterGroups: [
    //       {
    //         filters: [
    //           {
    //             field: 'entity_id',
    //             value: `${productIDsString}`,
    //             conditionType: 'in',
    //             splitter: ',',
    //           },
    //         ],
    //       },
    //     ],
    //     sortOrders: [
    //       {
    //         field: 'id',
    //         direction: 'desc',
    //       },
    //     ],
    //   };
    //   const products = await req.service.get(
    //     '/products/search',
    //     `criteria=${encodeURIComponent(
    //       decodeURIComponent(JSON.stringify(body)),
    //     )}`,
    //     {
    //       prefix: 'catalog-service/',
    //       version: '/V1',
    //       magentoParams: false,
    //     },
    //   );
    //   map(lists.items, item =>
    //     merge(
    //       item,
    //       products.products[
    //         products.products.findIndex(({ id }) => id === item.product_id, 0)
    //       ],
    //     ),
    //   );
    // }

    return res.json({ lists });
  } catch (e) {
    logger('wishlistController.fetchList', e);
    return res.status(500).json({ lists: {}, status: 'error' });
  }
};

const addList = async (req, res) => {
  try {
    const { groupId, itemId, activeAttribute } = req.body;
    let response;
    if (activeAttribute === false) {
      response = await req.service.put(`/wishlist-item`, {
        itemData: {
          wishlist_id: groupId,
          product_id: itemId,
        },
      });
    } else {
      response = await req.service.put(`/wishlist-item`, {
        itemData: {
          wishlist_id: groupId,
          product_id: itemId,
          custom_attributes: {
            ...activeAttribute,
          },
        },
      });
    }

    if (response.message) {
      return res.json({
        itemData: null,
        message: response.message,
        status: 'error',
      });
    }

    return res.json({ itemData: response, status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};

const deleteList = async (req, res) => {
  try {
    const { itemId } = req.body;
    const response = await req.service.delete(`/wishlist-item/${itemId}`);
    if (response.message) {
      return res.json({ status: 'error', message: response.message });
    }

    return res.json({ status: 'success' });
  } catch (e) {
    return res.status(500).json({ status: 'error' });
  }
};

// End List
export default {
  fetchGroup,
  addGroup,
  editGroup,
  deleteGroup,
  fetchList,
  // getList,
  addList,
  deleteList,
};
