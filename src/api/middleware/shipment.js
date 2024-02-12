import Boom from 'boom';
import { get, reduce, values } from 'lodash';

const fetch = async (req, res) => {
  const { id } = req.params;
  const params = {
    order_id: id,
    page: 1,
    limit: 1000, // all shipments
  };

  try {
    const response = await req.service.get('/shipments', params);
    const { items } = response;

    const shipmentItems = reduce(items, (all, s) => all.concat(s.items), []);
    const groups = reduce(shipmentItems, groupByTrackNumber, {});
    // map object.keys to array
    const shipments = values(groups).map(shipment => {
      const orderItems = reduce(shipment.items, groupByItemId, {});
      shipment.items = values(orderItems); // replace
      return shipment;
    });

    return res.json(shipments);
  } catch (e) {
    return Boom.boomify(e, e.statusCode);
  }
};

const groupByTrackNumber = (groups, item) => {
  const trackNumber = get(item, 'extension_attributes.tracking_number') || '';
  const trackURL = get(item, 'extension_attributes.tracking_url') || '';
  const status = get(item, 'extension_attributes.delivery_status');
  const provider = get(item, 'extension_attributes.shipment_provider');

  groups[trackNumber] = groups[trackNumber] || {
    trackURL,
    trackNumber,
    status,
    provider,
    items: [],
  };
  groups[trackNumber].items.push(item);
  return groups;
};

/**
 * merge item.qty by order_item_id
 */
const groupByItemId = (orderItems, item) => {
  const { qty, id = item.order_item_id } = item;

  orderItems[id] = orderItems[id] || { ...item, qty: 0 };
  orderItems[id].qty += qty;

  return orderItems;
};

export default {
  fetch,
};
