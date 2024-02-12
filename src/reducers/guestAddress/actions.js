//@flow
import { get as prop } from 'lodash';
import types from './types';
import service from '../../ApiService';

const DataTypes = {
  REGIONS: 'regions',
  DISTRICTS: 'districts',
  SUBDISTRICTS: 'subDistricts',
};

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

export const fetchRegionByPostcode = (
  postcode,
  suggest = true,
) => async dispatch => {
  try {
    dispatch(fetchByPostcodeStart());
    const response = await service.get(`/address/postcode/${postcode}`);
    if (suggest) {
      dispatch(fetchByPostcodeSuccess(response));
    }
    return response;
  } catch (error) {
    const errorMsg = prop(error, 'response.data.error.message');
    dispatch(fetchByPostcodeFail(errorMsg));
    return null;
  }
};

export const fetchByPostcodeStart = () => ({
  type: types.BILLING_BY_POSTCODE_START,
});

export const fetchByPostcodeSuccess = regionSuggest => ({
  type: types.BILLING_BY_POSTCODE_SUCCESS,
  payload: {
    regionSuggest: regionSuggest,
  },
});

export const fetchByPostcodeFail = error => ({
  type: types.BILLING_BY_POSTCODE_FAIL,
  payload: {
    error: error,
  },
});

export const fetchDataSuccess = (type, data) => ({
  type: types.BILLING_FETCHING_ADDRESS_DATA_SUCCESS,
  payload: { type, data },
});

export const fetchDataFailed = type => ({
  type: types.BILLING_FETCHING_ADDRESS_DATA_FAILED,
  payload: { type },
});

export const fetchRegionsSuccess = regions => ({
  type: types.BILLING_FETCHING_REGION_SUCCESS,
  payload: { regions },
});

export const fetchDistrictsSuccess = districts => ({
  type: types.BILLING_FETCHING_DISTRICT_SUCCESS,
  payload: { districts },
});

export const fetchSubDistrictsSuccess = subdistricts => ({
  type: types.BILLING_FETCHING_SUB_DISTRICT_SUCCESS,
  payload: { subdistricts },
});
