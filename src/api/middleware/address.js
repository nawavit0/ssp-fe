//@flow
import logger from '../logger';
// import { AddressType } from '../../model/Address/AddressType';
import { addressTransformer } from '../../utils/address';

const fetchOne = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await req.service.get(`/customers/addresses/${id}`);
    return res.json(addressTransformer(address));
  } catch (e) {
    logger('addressController.fetchAddress', e);
    return res.status(500).json({ status: 'error', error: e });
  }
};

const fetchAddresses = async (req, res) => {
  const { userToken = req.user.token } = req.query;
  try {
    const response = await req.service.get(
      '/customers/me',
      {},
      { authorizationToken: userToken },
    );
    return res.json(response.addresses);
  } catch (e) {
    return res.status(500).json({ status: 'error', error: e });
  }
};

const createAddress = async (req, res) => {
  const { address } = req.body;
  try {
    const customer = await req.service.get(
      '/customers/me',
      {},
      { authorizationToken: req.user.token },
    );

    if (parseInt(customer.id) !== parseInt(address.customer_id)) {
      throw new Error('this user have no permission to save this address.');
    }

    const response = await req.service.post(`/customers/addresses`, {
      address: address,
    });

    return res.json(response);
  } catch (e) {
    logger('addressController.createAddress', e);
    return res
      .status(500)
      .json({ status: 'error', message: 'can not save address' });
  }
};

const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  try {
    const customer = await req.service.get(
      '/customers/me',
      {},
      { authorizationToken: req.user.token },
    );

    if (parseInt(customer.id) !== parseInt(address.customer_id)) {
      throw new Error('this user have no permission to edit this address.');
    }

    const response = await req.service.put(`/customers/addresses/${id}`, {
      address: address,
    });

    return res.json(response);
  } catch (e) {
    logger('addressController.updateAddress', e);
    return res
      .status(500)
      .json({ status: 'error', message: 'can not edit address' });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await req.service.delete(`/addresses/${id}`);
    return res.status(201).json(response);
  } catch (e) {
    logger('addressController.deleteAddress', e);
    return res.status(500).json({ status: 'error', error: e });
  }
};

const fetchRegions = async (req, res) => {
  const regions = await req.service.get('/region/province');

  if (typeof req.redis !== 'undefined') {
    req.redis.set(
      req.redisKey,
      JSON.stringify({ regions }),
      'EX',
      process.env.REDIS_EXPIRE_CATEGORY,
    );
  }
  return res.json({ regions });
};

const fetchDistricts = async (req, res) => {
  const { regionId } = req.params;
  const districts = await req.service.get(
    `/region/province/${regionId}/district`,
  );

  if (typeof req.redis !== 'undefined') {
    req.redis.set(
      req.redisKey,
      JSON.stringify({ districts }),
      'EX',
      process.env.REDIS_EXPIRE_CATEGORY,
    );
  }
  return res.json({ districts });
};

const fetchSubDistricts = async (req, res) => {
  const { districtId, regionId } = req.params;
  const subDistricts = await req.service.get(
    `/region/province/${regionId}/district/${districtId}/subdistrict`,
  );

  if (typeof req.redis !== 'undefined') {
    req.redis.set(
      req.redisKey,
      JSON.stringify({ subDistricts }),
      'EX',
      process.env.REDIS_EXPIRE_CATEGORY,
    );
  }
  return res.json({ subDistricts });
};

const fetchRegionByPostcode = async (req, res) => {
  try {
    const { postcode } = req.params;

    if (!postcode) {
      throw new Error('your postcode is undefined;');
    }

    const response = await req.service.get(`/region/postcode/${postcode}`);

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify({ response }),
        'EX',
        process.env.REDIS_EXPIRE_CATEGORY,
      );
    }
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ status: 'error', error: error });
  }
};

export default {
  createAddress,
  updateAddress,
  deleteAddress,
  fetchRegions,
  fetchDistricts,
  fetchSubDistricts,
  fetchOne,
  fetchAddresses,
  fetchRegionByPostcode,
};

// const createMagentoAddress = (customer, address) => {
//   return {
//     address: {
//       id: address.id,
//       customer_id: customer.id,
//       firstname: address.firstName,
//       lastname: address.lastName,
//       postcode: address.zipCode,
//       telephone: address.phone,
//       street: ['n/a'],
//       city: address.region.name || address.region.region,
//       region: {
//         region: address.region.name || address.region.region,
//         region_id: address.region.region_id,
//         region_code: address.region.code || address.region.region_code,
//       },
//       region_id: address.region.region_id,
//       country_id: address.region.country_id,

//       [address.type === AddressType.BILLING
//         ? 'default_billing'
//         : 'default_shipping']: address.useAsDefault,
//       custom_attributes: [
//         {
//           attribute_code: 'address_name',
//           value: address.locationName,
//         },
//         {
//           attribute_code: 'remark',
//           value: address.remark,
//         },
//         {
//           attribute_code: 'district',
//           value: address.district.name || address.district.district,
//         },
//         {
//           attribute_code: 'district_id',
//           value: address.district.district_id,
//         },
//         {
//           attribute_code: 'subdistrict',
//           value: address.subDistrict.name || address.subDistrict.subDistrict,
//         },
//         {
//           attribute_code: 'subdistrict_id',
//           value: address.subDistrict.subdistrict_id,
//         },
//         {
//           attribute_code: 'customer_address_type',
//           value: address.type,
//         },
//         {
//           attribute_code: 'address_line',
//           value: address.address,
//         },
//         {
//           attribute_code: 'location_name',
//           value: address.locationName,
//         },
//       ],
//     },
//   };
// };
