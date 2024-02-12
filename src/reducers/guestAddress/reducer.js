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
  billing: {
    addresses: [],
    regions: [],
    districts: [],
    subDistricts: [],
    saving: false,
    error: null,
    regionSuggest: null,
    regionSuggestError: null,
  },
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case types.BILLING_ADDRESS_FETCHED:
      return {
        ...state,
        address: payload.address,
      };
    case types.BILLING_FETCHING_ADDRESS_FAILED:
      return state;
    case types.BILLING_FETCHING_ADDRESS_DATA_SUCCESS:
      return {
        ...state,
        ...payload.data,
      };
    case types.BILLING_FETCHING_ADDRESS_DATA_FAILED:
      return state;
    case types.BILLING_ADDRESSES_FETCHED:
      return { ...state, addresses: payload };
    case types.BILLING_FETCHING_ADDRESSES_FAILED:
      return { ...state };

    // new types
    case types.BILLING_FETCHING_REGION_SUCCESS:
      return {
        ...state,
        regions: payload.regions,
      };

    case types.BILLING_FETCHING_DISTRICT_SUCCESS:
      return {
        ...state,
        districts: payload.districts,
      };
    case types.BILLING_FETCHING_SUB_DISTRICT_SUCCESS:
      return {
        ...state,
        subDistricts: payload.subdistricts,
      };
    case types.BILLING_BY_POSTCODE_START:
      return {
        ...state,
        regionSuggest: null,
        regionSuggestError: null,
      };
    case types.BILLING_BY_POSTCODE_SUCCESS:
      return {
        ...state,
        regionSuggest: payload.regionSuggest,
      };
    case types.BILLING_BY_POSTCODE_FAIL:
      return {
        ...state,
        regionSuggest: null,
        regionSuggestError: payload.error,
      };
    default:
      return state;
  }
};
