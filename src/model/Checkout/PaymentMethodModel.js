import { get as prop, head } from 'lodash';

export default class PaymentMethodModel {
  setPayOther = (paymentMethod, earnNo) => {
    return {
      method: paymentMethod,
      extension_attributes: {
        t1c_earn_card_number: earnNo,
      },
    };
  };

  setPay123 = (paymentMethod, extension, earnNo, cart) => {
    const shippingAssignment = prop(
      cart,
      'extension_attributes.shipping_assignments',
      [],
    );
    const address = prop(head(shippingAssignment), 'shipping.address', {});
    const name = `${prop(address, 'firstname', 'n/a')} ${prop(
      address,
      'lastname',
      'n/a',
    )}`;
    const email = prop(address, 'email');
    return {
      method: paymentMethod,
      extension_attributes: {
        customer_name: name,
        customer_email: email,
        customer_phone: extension.customer_phone,
        apm_agent_code: extension.apm_agent_code,
        apm_channel_code: extension.apm_channel_code,
        t1c_earn_card_number: earnNo,
      },
    };
  };

  setPayIPP = (paymentMethod, extension, earnNo) => {
    return {
      method: paymentMethod,
      extension_attributes: {
        customer_name: 'n/a',
        customer_email: 'n/a',
        customer_phone: 'n/a',
        ipp_plan_id: extension.ipp_plan_id,
        t1c_earn_card_number: earnNo,
      },
    };
  };

  setEwallet = (paymentMethod, extension, earnNo) => {
    return {
      method: paymentMethod,
      extension_attributes: {
        payment_option: extension.payment_option,
        t1c_earn_card_number: earnNo,
      },
    };
  };

  setOntop = (paymentMethod, extension, earnNo) => {
    return {
      method: paymentMethod,
      extension_attributes: {
        promotion_id: extension.payment_ontop,
        t1c_earn_card_number: earnNo,
      },
    };
  };
}
