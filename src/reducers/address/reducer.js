import types from './types';

const initialState = {
  addresses: [],
  regions: [],
  districts: [],
  subDistricts: [],
  saving: false,
  error: null,
  regionSuggest: null,
  regionSuggestError: null,
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case types.ADDRESS_CREATED: {
      return { ...state };
    }
    case types.ADDRESS_CREATING_FAILED:
      return {
        ...state,
        failed: true,
      };
    case types.ADDRESS_EDITED:
      return {
        ...state,
      };
    case types.ADDRESS_EDIT_FAILED:
      return {
        ...state,
        failed: true,
      };
    case types.ADDRESS_DELETED:
      return state;
    case types.ADDRESS_DELETE_FAILED:
      return {
        ...state,
        failed: true,
      };
    case types.ADDRESS_FETCHED:
      return {
        ...state,
        address: payload.address,
      };
    case types.FETCHING_ADDRESS_FAILED:
      return state;
    case types.FETCHING_ADDRESS_DATA_SUCCESS:
      return {
        ...state,
        ...payload.data,
      };
    case types.FETCHING_ADDRESS_DATA_FAILED:
      return state;
    case types.ADDRESSES_FETCHED:
      return { ...state, addresses: payload };
    case types.FETCHING_ADDRESSES_FAILED:
      return { ...state };

    // new types
    case types.FETCHING_REGION_SUCCESS:
      return {
        ...state,
        regions: payload.regions,
      };
    case types.FETCHING_DISTRICT_SUCCESS:
      return {
        ...state,
        districts: payload.districts,
      };
    case types.FETCHING_SUB_DISTRICT_SUCCESS:
      return {
        ...state,
        subDistricts: payload.subdistricts,
      };
    case types.SAVE_ADDRESS_START:
      return {
        ...state,
        saving: true,
        error: null,
      };
    case types.SAVE_ADDRESS_END:
      return {
        ...state,
        saving: false,
        error: payload.error,
      };
    case types.BY_POSTCODE_START:
      return {
        ...state,
        regionSuggest: null,
        regionSuggestError: null,
      };
    case types.BY_POSTCODE_SUCCESS:
      return {
        ...state,
        regionSuggest: payload.regionSuggest,
      };
    case types.BY_POSTCODE_FAIL:
      return {
        ...state,
        regionSuggest: null,
        regionSuggestError: payload.error,
      };
    default:
      return state;
  }
};
