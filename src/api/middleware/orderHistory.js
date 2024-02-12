import { get as prop, size } from 'lodash';
import logger from '../logger';
import { responseError } from '../response';
import CryptoJS from 'crypto-js';

const fetch = async (req, res) => {
  try {
    const { from, to, increment_id, required, ...other } = req.query;

    const orderIdAndEncrypted = increment_id.split('-');
    let orderID = increment_id;
    if (size(orderIdAndEncrypted) === 2) {
      orderID = orderIdAndEncrypted[0];
      const orderEncryptedBackend = orderIdAndEncrypted[1];
      const orderEncryptedFrontend = CryptoJS.SHA1(
        `${orderID}central-success-page-secret-string`,
      ).toString();

      if (orderEncryptedBackend !== orderEncryptedFrontend) {
        return res.json({
          status: 'error',
          detail: 'not found order id',
        });
      }
    }

    const isLogin = req.user ? req.user.token : null;
    const params = {
      ...other,
      ...filterIncrementId(orderID),
      ...createdAt(from, to),
    };

    if (isLogin) {
      const customer = await req.service.get(
        '/customers/me',
        {},
        { authorizationToken: req.user.token },
      );
      params.customer_id = customer.id;
    } else {
      if (!increment_id) {
        throw new Error('order id is require for guest.');
      }
      if (required === 'true' && !params.customer_email) {
        throw new Error('Email is require for guest.');
      }
      params.customer_is_guest = 1;
    }

    const orderHistory = await req.service.get('/orders', params);

    return res.json({
      orderHistory: prop(orderHistory, 'items', []),
      searchCriteria: prop(orderHistory, 'search_criteria', {}),
      totalCount: prop(orderHistory, 'total_count', undefined),
    });
  } catch (e) {
    logger('orderHistory.fetchOrderHistory', e);
    return responseError(res, e);
  }
};

const filterIncrementId = increment_id => {
  if (increment_id) {
    return { increment_id };
  }
  return {};
};

const createdAt = (from, to) => {
  if (from && to) {
    return { created_at: { from, to } };
  }
  if (from) {
    return { created_at: { from } };
  }
  if (to) {
    return { created_at: { to } };
  }
  return {};
};

/**
 * @deprecated
 */
const fetchOne = async (req, res) => {
  try {
    const isLogin = req.user ? req.user.token : null;
    let customer;

    if (isLogin) {
      customer = await req.service.get(
        '/customers/me',
        {},
        { authorizationToken: req.user.token },
      );
    }

    const { id } = req.params;
    const response = await req.service.get(`/orders/${id}`);

    if (response.message) {
      return res.json({
        status: 'error',
      });
    }

    const {
      created_at: date,
      payment: { amount_ordered: total },
      grand_total: grandTotal,
      items,
      status,
      payment: {
        method: paymentMethod,
        additional_information: paymentAdditional,
      },
      discount_amount: discountAmount,
    } = response;

    //TODO: if-else out if magento sends back non-empty custom-attributes!
    for (const item of items) {
      const image = item.extension_attributes.custom_attributes.filter(
        attribute => attribute.attribute_code === 'thumbnail',
      );

      if (image[0]) item.image = image[0].value;
    }

    const {
      city: deliveryCity,
      company: deliveryCompany,
      postcode: deliveryPostcode,
      region: deliveryRegion,
      street: deliveryStreet,
      telephone: deliveryTelephone,
      firstname: deliveryFirstname,
      lastname: deliveryLastname,
      country_id: deliveryCountry,
      extension_attributes: { custom_attributes: deliveryAddress },
    } = response.extension_attributes.shipping_assignments.filter(
      object => object.shipping,
    )[0].shipping.address;

    const {
      city: billingCity,
      company: billingCompany,
      postcode: billingPostcode,
      region: billingRegion,
      street: billingStreet,
      telephone: billingTelephone,
      firstname: billingFirstname,
      lastname: billingLastname,
      country_id: billingCountry,
      vat_id: taxId,
      extension_attributes: { custom_attributes: billingAddr },
    } = response.billing_address;

    const shippingAddress = {
      street: deliveryStreet.join(' '),
      city: deliveryCity,
      to: deliveryCompany || `${deliveryFirstname} ${deliveryLastname}`,
      postcode: deliveryPostcode,
      region: deliveryRegion,
      telephone: deliveryTelephone,
      country: deliveryCountry,
      district: deliveryAddress.filter(
        attribute => attribute.attribute_code === 'district',
      )[0].value,
      subdistrict: deliveryAddress.filter(
        attribute => attribute.attribute_code === 'subdistrict',
      )[0].value,
      addressNo: deliveryAddress.filter(
        attribute => attribute.attribute_code === 'address_line',
      )[0].value,
      addressName: deliveryAddress.filter(
        attribute => attribute.attribute_code === 'address_name',
      )[0].value,
    };

    const billingAddress = {
      street: billingStreet.join(' '),
      city: billingCity,
      to: billingCompany || `${billingFirstname} ${billingLastname}`,
      postcode: billingPostcode,
      region: billingRegion,
      telephone: billingTelephone,
      country: billingCountry,
      taxId,
      district: billingAddr.filter(
        attribute => attribute.attribute_code === 'district',
      )[0].value,
      subdistrict: billingAddr.filter(
        attribute => attribute.attribute_code === 'subdistrict',
      )[0].value,
      addressNo: billingAddr.filter(
        attribute => attribute.attribute_code === 'address_line',
      )[0].value,
      addressName: billingAddr.filter(
        attribute => attribute.attribute_code === 'address_name',
      )[0].value,
    };

    const order = {
      date,
      id,
      total,
      grandTotal,
      discountAmount,
      items,
      status,
      paymentMethod,
      paymentAdditional,
      billingAddress,
      shippingAddress,
      originalValue: response,
    };

    if (
      customer &&
      customer.id !== response.customer_id &&
      response.customer_is_guest !== 1
    ) {
      throw new Error('permission denide.');
    }

    return res.json(order);
  } catch (e) {
    return responseError(res, e);
  }
};

const fetchOneV2 = async (req, res) => {
  try {
    const isLogin = req.user ? req.user.token : null;
    let customer;

    if (isLogin) {
      customer = await req.service.get(
        '/customers/me',
        {},
        { authorizationToken: req.user.token },
      );
    }

    const { id } = req.params;
    const order = await req.service.get(`/orders/${id}`);

    if (
      customer &&
      customer.id !== order.customer_id &&
      order.customer_is_guest !== 1
    ) {
      throw new Error('permission denide.');
    }

    return res.json(order);
  } catch (e) {
    return responseError(res, e);
  }
};

export default {
  fetchOne,
  fetchOneV2,
  fetch,
};
