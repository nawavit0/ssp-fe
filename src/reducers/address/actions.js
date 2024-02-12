//@flow
import { omit, get as prop } from 'lodash';
import types from './types';
import service from '../../ApiService';
import AddressType from '../../model/Address/AddressType';
import history from '../../history';
import { resolveUrl } from '../../utils/url';
import languages from '../../constants/languages';
import { fetchCustomer } from '../customer/actions';

const DataTypes = {
  REGIONS: 'regions',
  DISTRICTS: 'districts',
  SUBDISTRICTS: 'subDistricts',
};

export const saveAddress = address => async (dispatch, getState) => {
  const isAddressSaving = getState().address.saving;

  if (isAddressSaving) {
    return;
  }

  dispatch(saveAddressStart());
  const addressID = address.id;

  let savingAddress = address;

  if (!savingAddress.default_shipping) {
    savingAddress = omit(savingAddress, ['default_shipping']);
  }

  if (!savingAddress.default_billing) {
    savingAddress = omit(savingAddress, ['default_billing']);
  }

  try {
    let response;
    if (addressID) {
      response = await service.put(`/account/address/${addressID}`, {
        address: savingAddress,
      });
    } else {
      response = await service.post(`/account/address`, {
        address: savingAddress,
      });
    }

    await dispatch(fetchCustomer());

    dispatch(saveAddressEnd());
    return response;
  } catch (e) {
    const error = e?.response?.data?.message || e;
    dispatch(saveAddressEnd(error));
    return false;
  }
};

export const deleteAddress = addressID => async (dispatch, getState) => {
  const isAddressSaving = getState().address.saving;

  if (isAddressSaving) {
    return;
  }

  dispatch(saveAddressStart());

  try {
    let response;
    if (addressID) {
      response = await service.delete(`/account/address/${addressID}`);
    }

    await dispatch(fetchCustomer());

    dispatch(saveAddressEnd());
    return response;
  } catch (e) {
    const error = e.response.data.message;
    dispatch(saveAddressEnd(error));
    return false;
  }
};

export const saveAddressStart = () => ({
  type: types.SAVE_ADDRESS_START,
});

export const saveAddressEnd = error => ({
  type: types.SAVE_ADDRESS_END,
  payload: {
    error: error,
  },
});

export const fetchAddress = id => dispatch =>
  service
    .get(`/account/address/${id}`)
    .then(address => {
      dispatch(fetchAddressSuccess(address));
      return address;
    })
    .catch(() => {
      dispatch(fetchAddressFailed());
      return null;
    });

export const fetchAddresses = () => dispatch => {
  service
    .get('/account/addresses')
    .then(addresses => {
      dispatch(fetchAddressesSuccessful(addresses));
      return addresses;
    })
    .catch(() => {
      dispatch(fetchAddressesFailed());
      return null;
    });
};

export const create = (address, redirectOnSuccess = true) => async (
  dispatch,
  getState,
) => {
  return await service
    .post(`/account/address`, { address })
    .then(response => {
      dispatch(addressCreated(response));
      const { lang } = getState().locale;
      if (redirectOnSuccess) {
        createUrlToGo(address, lang);
      } else {
        dispatch(fetchCustomer(null));
      }
    })
    .catch(() => {
      dispatch(addressCreationFailed());
      return null;
    });
};

export const edit = (
  id,
  address,
  redirectOnSuccess = true,
  addressesNeedsToBeFetched = false,
) => async (dispatch, getState) => {
  return await service
    .put(`/account/address/${id}`, { address })
    .then(response => {
      dispatch(addressEdited(response));
      if (addressesNeedsToBeFetched) {
        dispatch(fetchAddresses());
      }
      const { lang } = getState().locale;
      if (redirectOnSuccess) {
        createUrlToGo(address, lang);
      } else {
        dispatch(fetchCustomer(null));
      }
    })
    .catch(() => {
      dispatch(addressEditFailed());
      return null;
    });
};

const createUrlToGo = (address, lang) => {
  let url;
  if (address.type === AddressType.SHIPPING) {
    url = '/account/delivery';
  } else {
    url = '/account/billing';
  }
  if (lang === languages.en) {
    url = resolveUrl('/en', url);
  } else if (lang === languages.th) {
    url = resolveUrl('/th', url);
  }
  history.push(url);
};

export const remove = (id, address) => async (dispatch, getState) =>
  service
    .delete(`/account/address/${id}`)
    .then(addresses => {
      addressRemoved();
      const { lang } = getState().locale;
      createUrlToGo(address, lang);
      return addresses;
    })
    .catch(() => {
      dispatch(addressRemoveFailed());
      return null;
    });

export const fetchRegions = () => async dispatch => {
  try {
    const { regions } = await service.get('/address/regions');
    dispatch(fetchRegionsSuccess(regions));
  } catch (e) {
    dispatch(fetchDataFailed(DataTypes.REGIONS));
  }
};

export const fetchDistricts = regionId => async dispatch => {
  try {
    const { districts } = await service.get(`/address/regions/${regionId}`);
    dispatch(fetchDistrictsSuccess(districts));
  } catch (e) {
    dispatch(fetchDataFailed(DataTypes.DISTRICTS));
  }
};

export const fetchSubDistricts = (regionId, districtId) => async dispatch => {
  try {
    const { subDistricts } = await service.get(
      `/address/regions/${regionId}/districts/${districtId}`,
    );
    dispatch(fetchSubDistrictsSuccess(subDistricts));
  } catch (e) {
    dispatch(fetchDataFailed(DataTypes.SUBDISTRICTS));
  }
};

export const fetchRegionByPostcode = postcode => async dispatch => {
  try {
    dispatch(fetchByPostcodeStart());
    const response = await service.get(`/address/postcode/${postcode}`);
    dispatch(fetchByPostcodeSuccess(response));
    return response;
  } catch (error) {
    const errorMsg = prop(error, 'response.data.error.message');
    dispatch(fetchByPostcodeFail(errorMsg));
    return null;
  }
};

export const fetchByPostcodeStart = () => ({
  type: types.BY_POSTCODE_START,
});

export const fetchByPostcodeSuccess = regionSuggest => ({
  type: types.BY_POSTCODE_SUCCESS,
  payload: {
    regionSuggest: regionSuggest,
  },
});

export const fetchByPostcodeFail = error => ({
  type: types.BY_POSTCODE_FAIL,
  payload: {
    error: error,
  },
});

export const fetchAddressSuccess = address => ({
  type: types.ADDRESS_FETCHED,
  payload: { address },
});

export const fetchAddressFailed = () => ({
  type: types.FETCHING_ADDRESS_FAILED,
});

export const fetchAddressesSuccessful = addresses => ({
  type: types.ADDRESSES_FETCHED,
  payload: { addresses },
});

export const fetchAddressesFailed = () => ({
  type: types.FETCHING_ADDRESSES_FAILED,
});

export const addressCreated = payload => {
  return {
    type: types.ADDRESS_CREATED,
    payload,
  };
};

export const addressCreationFailed = () => ({
  type: types.ADDRESS_CREATING_FAILED,
});

export const addressEdited = payload => ({
  type: types.ADDRESS_EDITED,
  payload,
});

export const addressEditFailed = () => ({
  type: types.ADDRESS_EDIT_FAILED,
});

export const addressRemoved = () => ({
  type: types.ADDRESS_DELETED,
});

export const addressRemoveFailed = () => ({
  type: types.ADDRESS_DELETE_FAILED,
});

export const fetchDataSuccess = (type, data) => ({
  type: types.FETCHING_ADDRESS_DATA_SUCCESS,
  payload: { type, data },
});

export const fetchDataFailed = type => ({
  type: types.FETCHING_ADDRESS_DATA_FAILED,
  payload: { type },
});

export const fetchRegionsSuccess = regions => ({
  type: types.FETCHING_REGION_SUCCESS,
  payload: { regions },
});

export const fetchDistrictsSuccess = districts => ({
  type: types.FETCHING_DISTRICT_SUCCESS,
  payload: { districts },
});

export const fetchSubDistrictsSuccess = subdistricts => ({
  type: types.FETCHING_SUB_DISTRICT_SUCCESS,
  payload: { subdistricts },
});
