import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withLocales } from '@central-tech/core-ui';
import { Field, reduxForm, change } from 'redux-form';
import { isEmpty, map, get as prop, uniqBy, size, isUndefined } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Switch from 'react-switch';
import FieldInput from '../../Form/FieldInput';
import FieldSelect from '../../Form/FieldSelect';
import AddressType from '../../../model/Address/AddressType';
import AddressModel from '../../../model/Address/AddressModel';
import CheckBoxV2 from '../../CheckBoxV2/CheckBoxV2';
import RadioButtonV2 from '../../RadioButtonV2/RadioButtonV2';
import Row from '../../Row';
import Col from '../../Col';
import s from './AddressForm.scss';
import { createCustomAttributes } from '../../../utils/customAttributes';
// import { phoneMask } from '../../../utils/inputFormat';
import {
  saveAddress,
  fetchRegions,
  fetchDistricts,
  fetchSubDistricts,
  fetchRegionByPostcode,
} from '../../../reducers/address/actions';

import {
  validateIdCard,
  validateTaxId,
  validateBranchId,
} from '../../../utils/validations';
import { normalizePhone } from '../../../utils/inputFormat';

const validate = values => {
  const errors = {};
  const requireData = [
    'firstname',
    'lastname',
    'customer_id',
    'country_id',
    'city',
    'street',
    'telephone',
    'address_line',
    'postcode',
    'region_id',
    'district_id',
    'subdistrict_id',
    'customer_address_type',
    'full_tax_type',
  ];

  map(requireData, data => {
    const fieldValue = values[data];
    if (
      fieldValue === '' ||
      fieldValue === null ||
      fieldValue === ' ' ||
      isUndefined(fieldValue) ||
      (fieldValue && fieldValue[0] === ' ')
    ) {
      errors[data] = 'address_book_form.required';
    } else if (data === 'postcode') {
      if (isNaN(Number(fieldValue))) {
        errors[data] = 'address_book_form.number_format';
      } else if (fieldValue.length < 5) {
        errors[data] = 'address_book_form.number_required_length';
      }
    } else if (data === 'telephone') {
      if (isNaN(Number(fieldValue))) {
        errors[data] = 'address_book_form.number_format';
      } else if (fieldValue.length < 9 || fieldValue.length > 10) {
        errors[data] = 'address_book_form.phone_number_format';
      }
    } else if (data === 'customer_address_type' && fieldValue === 'billing') {
      const vatId = values['vat_id'];
      let keyError, checkVatId;
      if (values['full_tax_type'] === 'company') {
        keyError = 'address_book_form.tax_id_invalid';
        checkVatId = validateTaxId(vatId);
      } else {
        keyError = 'address_book_form.id_card_invalid';
        checkVatId = validateIdCard(vatId);
      }

      if (!checkVatId) {
        errors['vat_id'] = keyError;
      }
    }
  });

  if (values.customer_address_type === AddressType.BILLING) {
    if (isEmpty(values.vat_id)) {
      errors.vat_id = 'address_book_form.required';
    } else if (isNaN(Number(values.vat_id))) {
      errors.vat_id = 'address_book_form.number_format';
    }

    if (values.billing_type === 'company') {
      if (isEmpty(values.company)) {
        errors.company = 'address_book_form.required';
      }

      if (isEmpty(values.branch_id)) {
        errors.branch_id = 'address_book_form.required';
      } else if (
        isNaN(Number(values.branch_id)) ||
        !validateBranchId(values.branch_id)
      ) {
        errors.branch_id = 'address_book_form.branch_id_format';
      }
    }
  }
  return errors;
};

@withLocales
@withStyles(s)
class AddressForm extends Component {
  state = {
    isbillingState: !!this.props.isBilling,
    selectedRegionID: null,
    selectedDistrictID: null,
    billingTypeCompany: false,
  };

  componentDidMount() {
    this.initialData();
    this.props.fetchRegions();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedRegionID !== this.state.selectedRegionID) {
      this.props.fetchDistricts(this.state.selectedRegionID);
    }

    if (prevState.selectedDistrictID !== this.state.selectedDistrictID) {
      this.props.fetchSubDistricts(
        this.state.selectedRegionID,
        this.state.selectedDistrictID,
      );
    }

    if (prevProps.regionSuggest !== this.props.regionSuggest) {
      this.handleSuggestionByZipcode();
    }
  }

  initialData = () => {
    const { address } = this.props;

    if (!isEmpty(address)) {
      // const explodeAddress = explode(address);
      const formatAddress = {
        ...address,
        ...address.custom_attributes,
      };

      const initialData = new AddressModel(formatAddress);
      this.props.initialize({
        ...initialData,
        ...formatAddress,
      });

      this.setState({
        selectedRegionID: formatAddress.region_id,
        selectedDistrictID: formatAddress.district_id,
      });

      if (formatAddress.customer_address_type === AddressType.BILLING) {
        this.setState({
          isbillingState: true,
        });
      }

      if (!isEmpty(formatAddress.company)) {
        this.setState({
          billingTypeCompany: true,
        });
        this.props.changeFieldValue('billing_type', 'company');
        this.props.changeFieldValue('full_tax_type', 'company');
      }
    } else {
      const initialData = new AddressModel();

      this.props.initialize({
        ...initialData,
        customer_address_type: this.props.isBilling
          ? AddressType.BILLING
          : AddressType.SHIPPING,
        customer_id: this.props.customer.id,
      });

      this.setState({
        selectedRegionID: null,
        selectedDistrictID: null,
      });
    }
  };

  handlePostcodeChange = event => {
    const postcode = event.target.value;

    if (postcode && postcode.length === 5) {
      this.props.fetchRegionByPostcode(postcode);
    }
  };

  handleSuggestionByZipcode = () => {
    const { regionSuggest } = this.props;

    if (regionSuggest) {
      const regionID = regionSuggest.region_id;
      const districtID = prop(regionSuggest, 'district[0].district_id');
      const subDistrictID = prop(
        regionSuggest,
        'district[0].subdistrict[0].subdistrict_id',
      );

      this.setState({
        selectedRegionID: regionID,
        selectedDistrictID: districtID,
      });

      this.props.changeFieldValue('region_id', regionID);
      this.props.changeFieldValue('district_id', districtID);
      this.props.changeFieldValue('subdistrict_id', subDistrictID);
    }
  };

  handleRegionChange = event => {
    const regionID = event.target.value;
    this.setState({
      selectedRegionID: regionID,
      selectedDistrictID: null,
    });
    this.props.changeFieldValue('district_id', '');
  };

  handleDistrictChange = event => {
    const districtID = event.target.value;
    this.setState({
      selectedDistrictID: districtID,
    });

    this.props.changeFieldValue('subdistrict_id', '');
  };

  handleAddressTypeChange = isChecked => {
    const currentType = this.state.isbillingState
      ? AddressType.SHIPPING
      : AddressType.BILLING;

    this.setState({
      isbillingState: isChecked,
    });

    this.props.changeFieldValue('customer_address_type', currentType);
    this.props.changeFieldValue('default_billing', 0);
  };

  handleChangeBillingType = type => {
    if (type === 'company') {
      this.setState({
        billingTypeCompany: true,
      });
    } else if (type === 'personal') {
      this.setState({
        billingTypeCompany: false,
      });
      this.props.changeFieldValue('company', '');
    }
    this.props.changeFieldValue('full_tax_type', type);
  };

  handleInputChange = event => {
    const { currentTarget } = event;
    if (size(currentTarget.value) > 0 && currentTarget.value[0] === ' ') {
      event.preventDefault();
    }
  };

  render() {
    const {
      handleSubmit,
      className,
      addressSaving,
      regions,
      districts,
      subDistricts,
      regionSuggestError,
      translate,
    } = this.props;

    const { billingTypeCompany } = this.state;
    const uniqSubDistricts = uniqBy(subDistricts, e => {
      return e.subdistrict_id;
    });

    return (
      <div id="address-form" className={cx(s.root, className)}>
        <form onSubmit={handleSubmit}>
          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="address_name"
                type="text"
                component={FieldInput}
                label={translate('address_book_form.form.address_name')}
                subLabel={translate('address_book_form.form.optional')}
                placeholder={translate(
                  'address_book_form.placeholder.address_name',
                )}
                autoComplete="off"
                maxLength={50}
                disabled={addressSaving}
                msgError={translate}
              />
            </Col>
          </Row>

          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="firstname"
                type="text"
                maxlength="30"
                component={FieldInput}
                label={translate('address_book_form.form.name')}
                placeholder={translate('address_book_form.placeholder.name')}
                autoComplete="off"
                disabled={addressSaving}
                msgError={translate}
                isRequire
              />
            </Col>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="lastname"
                type="text"
                maxlength="30"
                component={FieldInput}
                label={translate('address_book_form.form.lastname')}
                placeholder={translate(
                  'address_book_form.placeholder.lastname',
                )}
                autoComplete="off"
                disabled={addressSaving}
                msgError={translate}
                isRequire
              />
            </Col>
          </Row>

          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="telephone"
                type="text"
                component={FieldInput}
                label={translate('address_book_form.form.phone')}
                placeholder={translate('address_book_form.placeholder.phone')}
                autoComplete="off"
                maxLength={10}
                disabled={addressSaving}
                msgError={translate}
                normalize={normalizePhone}
                isRequire
              />
            </Col>
          </Row>

          <hr className={s.line} />

          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="building"
                type="text"
                component={FieldInput}
                label={translate('address_book_form.form.building')}
                subLabel={translate('address_book_form.form.optional')}
                placeholder={translate(
                  'address_book_form.placeholder.building',
                )}
                autoComplete="off"
                maxLength={100}
                disabled={addressSaving}
                msgError={translate}
              />
            </Col>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="address_line"
                type="text"
                component={FieldInput}
                label={translate('address_book_form.form.house_no')}
                placeholder={translate(
                  'address_book_form.placeholder.house_no',
                )}
                autoComplete="off"
                maxLength={200}
                disabled={addressSaving}
                msgError={translate}
                onChange={this.handleInputChange}
                isRequire
              />
            </Col>
          </Row>

          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="postcode"
                type="text"
                component={FieldInput}
                label={translate('address_book_form.form.postcode')}
                placeholder={translate(
                  'address_book_form.placeholder.postcode',
                )}
                autoComplete="off"
                maxLength={5}
                disabled={addressSaving}
                onChange={this.handlePostcodeChange}
                staticError={regionSuggestError}
                msgError={translate}
                normalize={normalizePhone}
                isRequire
              />
            </Col>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="region_id"
                type="text"
                component={FieldSelect}
                label={translate('address_book_form.form.province')}
                placeholder={translate(
                  'address_book_form.placeholder.province',
                )}
                autoComplete="off"
                disabled={addressSaving}
                onChange={this.handleRegionChange}
                msgError={translate}
                isRequire
              >
                {map(regions, region => {
                  return (
                    <option value={region.region_id} key={region.region_id}>
                      {region.name}
                    </option>
                  );
                })}
              </Field>
            </Col>
          </Row>

          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="district_id"
                type="text"
                component={FieldSelect}
                label={translate('address_book_form.form.district')}
                placeholder={translate(
                  'address_book_form.placeholder.district',
                )}
                autoComplete="off"
                disabled={addressSaving || !this.state.selectedRegionID}
                onChange={this.handleDistrictChange}
                msgError={translate}
                isRequire
              >
                {map(districts, district => {
                  return (
                    <option
                      value={district.district_id}
                      key={district.district_id}
                    >
                      {district.name}
                    </option>
                  );
                })}
              </Field>
            </Col>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="subdistrict_id"
                type="text"
                component={FieldSelect}
                label={translate('address_book_form.form.subdistrict')}
                placeholder={translate(
                  'address_book_form.placeholder.subdistrict',
                )}
                autoComplete="off"
                disabled={addressSaving || !this.state.selectedDistrictID}
                msgError={translate}
                isRequire
              >
                {map(uniqSubDistricts, subDistrict => {
                  return (
                    <option
                      value={subDistrict.subdistrict_id}
                      key={`${subDistrict.subdistrict_id}${subDistrict.zip_code}`}
                    >
                      {subDistrict.name}
                    </option>
                  );
                })}
              </Field>
            </Col>
          </Row>

          <Row className={s.addressGroup} gutter={15}>
            <Col lg={12}>
              <span className={s.fulltag}>
                {translate('address_book_form.form.same_invoice')}
                <Switch
                  className={s.toggle}
                  checked={this.state.isbillingState}
                  boxShadow="0 1px 3px rgba(0,0,0,.4)"
                  height={24}
                  width={51}
                  onColor="#78E723"
                  offColor="#ffffff"
                  checkedIcon={
                    <span className={s.toggleYes}>
                      {translate('address_book_form.form.yes')}
                    </span>
                  }
                  uncheckedIcon={
                    <span className={s.toggleNo}>
                      {translate('address_book_form.form.no')}
                    </span>
                  }
                  onChange={this.handleAddressTypeChange}
                  disabled={addressSaving}
                />
              </span>
            </Col>
          </Row>

          {this.state.isbillingState && (
            <React.Fragment>
              <Row gutter={15} className={s.radioTaxOption}>
                <Col lg={6} className={s.colRadio}>
                  <Field
                    className={s.addressField}
                    name="billing_type"
                    type="radio"
                    component={RadioButtonV2}
                    label={translate('address_book_form.form.personal_invoice')}
                    background={'#ffffff'}
                    border={'#4A90E2'}
                    checkedColor={'#4A90E2'}
                    disabled={addressSaving}
                    value="personal"
                    onChange={e => this.handleChangeBillingType(e.target.value)}
                    msgError={translate}
                  />
                </Col>
                <Col lg={6} className={s.colRadio}>
                  <Field
                    className={s.addressField}
                    name="billing_type"
                    type="radio"
                    background={'#ffffff'}
                    border={'#4185de'}
                    checkedColor={'#4185de'}
                    component={RadioButtonV2}
                    label={translate('address_book_form.form.company_invoice')}
                    disabled={addressSaving}
                    value="company"
                    onChange={e => this.handleChangeBillingType(e.target.value)}
                    msgError={translate}
                  />
                </Col>
                <Field
                  className={cx(s.addressField, s.hidden)}
                  name="full_tax_type"
                  type="text"
                  component={FieldInput}
                />
              </Row>

              <Row gutter={15}>
                {billingTypeCompany && (
                  <Col lg={6} md={12}>
                    <Field
                      className={s.addressField}
                      name="company"
                      type="text"
                      component={FieldInput}
                      label={translate('address_book_form.form.company_name')}
                      placeholder={translate(
                        'address_book_form.placeholder.company_name',
                      )}
                      autoComplete="off"
                      disabled={addressSaving}
                      msgError={translate}
                      isRequire
                    />
                  </Col>
                )}
                <Col lg={6} md={12}>
                  <Field
                    className={s.addressField}
                    name="vat_id"
                    type="text"
                    component={FieldInput}
                    label={translate(
                      billingTypeCompany
                        ? 'address_book_form.form.tax_id'
                        : 'address_book_form.form.card_id',
                    )}
                    placeholder={translate(
                      billingTypeCompany
                        ? 'address_book_form.placeholder.tax_id'
                        : 'address_book_form.placeholder.card_id',
                    )}
                    autoComplete="off"
                    maxLength={13}
                    disabled={addressSaving}
                    msgError={translate}
                    normalize={normalizePhone}
                    isRequire
                  />
                </Col>
                {billingTypeCompany && (
                  <Col lg={6} md={12}>
                    <Field
                      className={s.addressField}
                      name="branch_id"
                      type="text"
                      component={FieldInput}
                      label={translate('address_book_form.form.branch_id')}
                      placeholder={translate(
                        'address_book_form.placeholder.branch_id',
                      )}
                      autoComplete="off"
                      maxLength={5}
                      disabled={addressSaving}
                      msgError={translate}
                      onChange={this.handleInputChange}
                      isRequire
                    />
                  </Col>
                )}
              </Row>
            </React.Fragment>
          )}

          <hr className={s.line} />

          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="default_shipping"
                type="checkbox"
                component={CheckBoxV2}
                autoComplete="off"
                label={translate('address_book_form.form.default_shipping')}
                disabled={addressSaving}
                msgError={translate}
              />
            </Col>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="default_billing"
                type="checkbox"
                component={CheckBoxV2}
                autoComplete="off"
                label={translate('address_book_form.form.default_billing')}
                disabled={!this.state.isbillingState}
                msgError={translate}
              />
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

AddressForm = reduxForm({
  form: 'addressForm',
  validate,
  onSubmit: async (state, dispatch) => {
    const address = createCustomAttributes(state, [
      'address_name',
      'address_line',
      'district',
      'district_id',
      'subdistrict',
      'subdistrict_id',
      'customer_address_type',
      'branch_id',
      'building',
      'full_tax_type',
    ]);
    await dispatch(saveAddress(address));
  },
})(AddressForm);

const mapStateToProps = state => ({
  customer: state.customer.customer,
  regions: state.address.regions,
  districts: state.address.districts,
  subDistricts: state.address.subDistricts,
  regionSuggest: state.address.regionSuggest,
  regionSuggestError: state.address.regionSuggestError,
  addressSaving: state.address.saving,
  addressForm: state.form.addressForm,
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field, value) =>
    dispatch(change('addressForm', field, value)),
  fetchRegions: () => dispatch(fetchRegions()),
  fetchDistricts: regionID => dispatch(fetchDistricts(regionID)),
  fetchSubDistricts: (regionID, districtID) =>
    dispatch(fetchSubDistricts(regionID, districtID)),
  fetchRegionByPostcode: postcode => dispatch(fetchRegionByPostcode(postcode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressForm);
