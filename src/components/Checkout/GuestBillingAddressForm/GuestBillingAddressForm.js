import React from 'react';
import pt from 'prop-types';
import { withLocales } from '@central-tech/core-ui';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import withLocales from '../../../utils/decorators/withLocales';
import {
  isEmpty,
  map,
  get as prop,
  uniqBy,
  indexOf,
  filter,
  size,
  isUndefined,
} from 'lodash';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  formValueSelector,
  getFormValues,
  change,
  reset,
} from 'redux-form';
import FieldInput from '../../Form/FieldInput';
import FieldSelect from '../../Form/FieldSelect';
import Row from '../../Row';
import Col from '../../Col';
import s from './style.scss';
import {
  fetchRegions,
  fetchDistricts,
  fetchSubDistricts,
  fetchRegionByPostcode,
} from '../../../reducers/guestAddress/actions';
import { estimateGuestShipment } from '../../../reducers/checkout/actions';
import { explode } from '../../../utils/customAttributes';
import { normalizePhone } from '../../../utils/inputFormat';
import { validateIdCard, validateTaxId } from '../../../utils/validations';
import RadioButtonV2 from '../../RadioButtonV2/RadioButtonV2';
export const formName = 'guestBillingAddressForm';

const validate = values => {
  const requiredData = [
    'address_line',
    'postcode',
    'region_id',
    'district_id',
    'subdistrict_id',
    'full_tax_type',
    'vat_id',
  ];

  const numberData = ['vat_id'];

  if (values['full_tax_type'] === 'company') {
    requiredData.push('company', 'branch_id');
    numberData.push('branch_id');
  }

  const errors = requiredData.reduce((e, data) => {
    const valueData = values[data];

    if (
      valueData === null ||
      valueData === '' ||
      valueData === ' ' ||
      isUndefined(valueData) ||
      (size(valueData) > 0 && valueData[0] === ' ')
    ) {
      e[data] = 'address_book_form.required';
    } else if (indexOf(numberData, data) !== -1 && isNaN(Number(valueData))) {
      e[data] = 'address_book_form.number_format';
    } else if (data === 'postcode') {
      if (isNaN(Number(valueData))) {
        e[data] = 'address_book_form.postcode_format';
      } else if (valueData.length < 5) {
        e[data] = 'address_book_form.number_required_length';
      }
    } else if (data === 'vat_id') {
      let keyError, checkVatId;

      if (values['full_tax_type'] === 'company') {
        keyError = 'address_book_form.tax_id_invalid';
        checkVatId = validateTaxId(valueData);
      } else {
        keyError = 'address_book_form.id_card_invalid';
        checkVatId = validateIdCard(valueData);
      }

      if (!checkVatId) {
        e[data] = keyError;
      }
    }
    return e;
  }, {});

  return errors;
};

const renderField = ({
  input,
  label,
  type,
  placeholder,
  msgError,
  autoComplete,
  maxLength,
  className,
  meta: { touched, error },
}) => {
  const html = (
    <div className={className}>
      <div className={s.labelTitle}>
        <div className={s.labelTitleLeft}>{label}</div>
        {touched && error && (
          <div className={cx(s.validateAlert, s.labelTitleRight)}>
            {msgError(error)}
          </div>
        )}
      </div>
      <input
        {...input}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        className={touched && error ? s.validateInput : ''}
        maxLength={maxLength}
      />
    </div>
  );
  return html;
};

// eslint-disable-next-line react/no-multi-comp
@withStyles(s)
@withLocales
@reduxForm({
  form: formName,
  validate,
})
class GuestBillingAddressForm extends React.PureComponent {
  static propTypes = {
    className: pt.string,
  };

  state = {
    billingTypeCompany: false,
  };

  componentDidMount() {
    const { checkout } = this.props;
    this.props.fetchRegions();
    this.initialAddress();

    this.handleChangeBillingAddress();
    this.props.setValue('billing_type', 'personal');
    this.props.setValue('full_tax_type', 'personal');
    this.props.setValue('full_tax_request', '1');
    this.props.setValue(
      'billing_address_type',
      checkout.deliveryOption > 1 ? 'addnew_address' : 'use_shipping_address',
    );
  }

  componentDidUpdate(prevProps) {
    const { checkout } = this.props;
    if (prevProps.checkout.deliveryOption !== checkout.deliveryOption) {
      this.props.setValue(
        'billing_address_type',
        checkout.deliveryOption > 1 ? 'addnew_address' : 'use_shipping_address',
      );
    }
    if (prevProps.billing.regionSuggest !== this.props.billing.regionSuggest) {
      this.handleSuggestionByZipcode();
    }
  }

  initialAddress() {
    const { address, initialize } = this.props;
    if (!isEmpty(address)) {
      const values = explode(address);
      initialize({ ...values });
    }
  }

  handleSuggestionByZipcode = async () => {
    const { billing } = this.props;
    if (billing.regionSuggest) {
      const regionID = billing.regionSuggest.region_id;
      const districtID = prop(billing.regionSuggest, 'district[0].district_id');
      const districtName = prop(billing.regionSuggest, 'district[0].name');
      const subDistrictID = prop(
        billing.regionSuggest,
        'district[0].subdistrict[0].subdistrict_id',
      );
      const subDistrictName = prop(
        billing.regionSuggest,
        'district[0].subdistrict[0].name',
      );

      this.props.setValue('region_id', regionID);

      await this.props.fetchDistricts(regionID);
      this.props.setValue('district_id', districtID);
      this.props.setValue('district', districtName);

      await this.props.fetchSubDistricts(regionID, districtID);
      this.props.setValue('subdistrict_id', subDistrictID);
      this.props.setValue('subdistrict', subDistrictName);
    }
  };

  handleRegionChange = e => {
    this.props.fetchDistricts(e.target.value);
    this.props.setValue('subdistrict_id', null);
    this.props.setValue('subdistrict', null);
    this.props.setValue('district_id', null);
    this.props.setValue('district', null);
  };

  handleDistrictChange = async e => {
    const { billing } = this.props;
    if (billing.districtId === e.target.value) return;
    await this.props.fetchSubDistricts(
      prop(billing.regionSuggest, 'region_id', 0),
      e.target.value,
    );
    const getDistrictName = filter(
      billing.districts,
      dist => dist.district_id === e.target.value,
    );
    const districtName =
      getDistrictName.length > 0 ? getDistrictName[0].name : null;
    // this.props.fetchSubDistricts(billing.regionId, e.target.value);
    this.props.setValue('district', districtName);
    this.props.setValue('subdistrict_id', null);
    this.props.setValue('subdistrict', null);
  };
  handleSubDistrictChange = async e => {
    const { billing } = this.props;
    if (billing.subDistrictId === e.target.value) return;
    const getSubDistrictName = filter(
      billing.subDistricts,
      sub => sub.subdistrict_id === e.target.value,
    );
    const subDistrictName =
      getSubDistrictName.length > 0 ? getSubDistrictName[0].name : null;
    this.props.setValue('subdistrict', subDistrictName);
  };

  handleDetectDistrictClick = () => {
    const { billing } = this.props;

    if (billing.regionId && isEmpty(billing.districts)) {
      this.props.fetchDistricts(billing.regionId);
    }
  };

  handlePostcodeChange = event => {
    const postcode = event.target.value;

    if (postcode && postcode.length === 5) {
      this.props.fetchRegionByPostcode(postcode);
    }
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
      this.props.changeFieldValue('branch_id', '');
    }
    this.props.changeFieldValue('full_tax_type', type);
  };

  handleChangeBillingAddress = async (type = 'use_shipping_address') => {
    if (type === 'addnew_address') {
      this.props.setValue('address_line', '');
      this.props.setValue('building', '');
      this.props.setValue('district_id', '');
      this.props.setValue('district', '');
      this.props.setValue('postcode', '');
      this.props.setValue('region_id', '');
      this.props.setValue('subdistrict_id', '');
      this.props.setValue('subdistrict', '');
    } else {
      const shipping = this.props.shipping.form;
      if (!shipping) {
        return;
      }

      this.props.setValue('address_line', shipping.address_line);
      this.props.setValue('building', shipping.building);

      this.props.setValue('postcode', shipping.postcode);
      await this.props.fetchRegionByPostcode(shipping.postcode, false);
      this.props.setValue('region_id', shipping.region_id);
      this.props.setValue('region', shipping.region);

      await this.props.fetchDistricts(shipping.region_id);
      this.props.setValue('district_id', shipping.district_id);
      this.props.setValue('district', shipping.district);

      await this.props.fetchSubDistricts(
        shipping.region_id,
        shipping.district_id,
      );
      this.props.setValue('subdistrict_id', shipping.subdistrict_id);
      this.props.setValue('subdistrict', shipping.subdistrict);
    }
  };

  handleChangeBranchId = event => {
    this.handleInputChange(event);
  };

  handleInputChange = event => {
    const { currentTarget } = event;
    if (size(currentTarget.value) > 0 && currentTarget.value[0] === ' ') {
      event.preventDefault();
    }
  };

  render() {
    const {
      className,
      disabled,
      translate,
      handleSubmit,
      checkout,
    } = this.props;
    const { billing } = this.props;

    const uniqSubDistricts = uniqBy(billing.subDistricts, e => {
      return e.subdistrict_id;
    });

    return (
      <div className={cx(s.root, s.wrapper, className)}>
        <form onSubmit={handleSubmit}>
          <React.Fragment>
            <Row gutter={15}>
              <Col lg={6}>
                <Field
                  className={s.addressField}
                  name="billing_type"
                  type="radio"
                  label={translate('address_book_form.form.personal_invoice')}
                  value="personal"
                  component={RadioButtonV2}
                  background={'#ffffff'}
                  border={'#4A90E2'}
                  checkedColor={'#4A90E2'}
                  onChange={e => this.handleChangeBillingType(e.target.value)}
                  msgError={translate}
                />
              </Col>
              <Col lg={6}>
                <Field
                  className={s.addressField}
                  name="billing_type"
                  type="radio"
                  component={RadioButtonV2}
                  background={'#ffffff'}
                  border={'#4A90E2'}
                  checkedColor={'#4A90E2'}
                  label={translate('address_book_form.form.company_invoice')}
                  value="company"
                  onChange={e => this.handleChangeBillingType(e.target.value)}
                  msgError={translate}
                />
              </Col>
            </Row>

            <Row gutter={15}>
              {this.state.billingTypeCompany && (
                <Col className={s.addressGroup} lg={6} sm={12}>
                  <Field
                    className={s.addressField}
                    name="company"
                    type="text"
                    component={renderField}
                    label={translate('address_book_form.form.company_name')}
                    placeholder={translate(
                      'address_book_form.placeholder.company_name',
                    )}
                    autoComplete="off"
                    msgError={translate}
                  />
                </Col>
              )}
              <Col className={s.addressGroup} lg={6} sm={12}>
                <Field
                  className={s.addressField}
                  name="vat_id"
                  type="text"
                  component={renderField}
                  label={translate(
                    this.state.billingTypeCompany
                      ? 'address_book_form.form.tax_id'
                      : 'address_book_form.form.card_id',
                  )}
                  placeholder={translate(
                    this.state.billingTypeCompany
                      ? 'address_book_form.placeholder.tax_id'
                      : 'address_book_form.placeholder.card_id',
                  )}
                  autoComplete="off"
                  maxLength={13}
                  msgError={translate}
                  normalize={normalizePhone}
                />
              </Col>
              {this.state.billingTypeCompany && (
                <Col className={s.addressGroup} lg={6} sm={12}>
                  <Field
                    className={s.addressField}
                    name="branch_id"
                    type="text"
                    component={renderField}
                    label={translate('address_book_form.form.branch_id')}
                    placeholder={translate(
                      'address_book_form.placeholder.branch_id',
                    )}
                    autoComplete="off"
                    maxLength={5}
                    onChange={this.handleChangeBranchId}
                    msgError={translate}
                  />
                </Col>
              )}
            </Row>
            {/* {!this.state.billingTypeCompany ? (
              <Row gutter={15}>
                <Col lg={6} sm={12}>
                  <Field
                    className={s.addressField}
                    name="vat_id"
                    type="text"
                    component={FieldInput}
                    label={translate('billing.card_id')}
                    placeholder={translate('placeholder.card_id')}
                    autoComplete="off"
                    maxLength={13}
                    msgError={translate}
                  />
                </Col>
              </Row>
            ) : (
              <Row className={s.addressField} gutter={15}>
                <Col className={s.addressGroup} lg={6} sm={12}>
                  <Field
                    className={s.addressField}
                    name="company"
                    type="text"
                    component={renderField}
                    label={translate('billing.company_name')}
                    placeholder={translate('placeholder.company_name')}
                    autoComplete="off"
                    msgError={translate}
                  />
                </Col>
                <Col className={s.addressGroup} lg={6} sm={12}>
                  <Field
                    className={s.addressField}
                    name="vat_id"
                    type="text"
                    component={renderField}
                    label={translate('billing.tax_id')}
                    placeholder={translate('placeholder.tax_id')}
                    autoComplete="off"
                    maxLength={13}
                    msgError={translate}
                  />
                </Col>
                <Col className={s.addressGroup} lg={6} sm={12}>
                  <Field
                    className={s.addressField}
                    name="branch_id"
                    type="text"
                    component={renderField}
                    label={translate('billing.branch_id')}
                    placeholder={translate('placeholder.branch_id')}
                    autoComplete="off"
                    maxLength={5}
                    onChange={this.handleChangeBranchId}
                    msgError={translate}
                  />
                </Col>
              </Row>
            )} */}
          </React.Fragment>

          <Row>
            <Col
              lg={6}
              md={6}
              className={{ [s.hidden]: checkout.deliveryOption > 1 }}
            >
              <Field
                className={cx(s.addressField, {
                  [s.hidden]: checkout.deliveryOption > 1,
                })}
                name="billing_address_type"
                type="radio"
                label={translate('address_book_form.use_shipping_address')}
                value="use_shipping_address"
                component={RadioButtonV2}
                background={'#ffffff'}
                border={'#4A90E2'}
                checkedColor={'#4A90E2'}
                onChange={e => this.handleChangeBillingAddress(e.target.value)}
                msgError={translate}
              />
            </Col>
            <Col lg={6} md={6} className={s.addPadding}>
              <Field
                className={s.addressField}
                name="billing_address_type"
                type="radio"
                component={RadioButtonV2}
                background={'#ffffff'}
                border={'#4A90E2'}
                checkedColor={'#4A90E2'}
                label={translate('address_book_form.add_new_address')}
                value="addnew_address"
                onChange={e => this.handleChangeBillingAddress(e.target.value)}
                msgError={translate}
              />
            </Col>
          </Row>
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
                disabled={disabled}
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
                disabled={disabled}
                msgError={translate}
                onChange={this.handleInputChange}
              />
            </Col>
          </Row>

          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="postcode"
                type="text"
                component={renderField}
                label={translate('address_book_form.form.postcode')}
                placeholder={translate(
                  'address_book_form.placeholder.postcode',
                )}
                autoComplete="off"
                maxLength={5}
                disabled={disabled}
                onChange={this.handlePostcodeChange}
                msgError={translate}
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
                disabled={disabled}
                onChange={this.handleRegionChange}
                msgError={translate}
              >
                {map(billing.regions, region => {
                  const id = region.region_id;
                  return (
                    <option key={`region-${id}`} value={id}>
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
                onChange={this.handleDistrictChange}
                onClick={this.handleDetectDistrictClick}
                msgError={translate}
              >
                {map(billing.districts, district => {
                  const id = district.district_id;
                  const key = `${district.code}-${id}`;
                  return (
                    <option key={key} value={id}>
                      {district.name}
                    </option>
                  );
                })}
              </Field>
              <Field
                className={cx(s.addressField, s.hidden)}
                name="district"
                type="text"
                component={FieldInput}
              />
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
                onChange={this.handleSubDistrictChange}
                autoComplete="off"
                msgError={translate}
              >
                {map(uniqSubDistricts, subDistrict => {
                  const id = subDistrict.subdistrict_id;
                  const key = `${subDistrict.code}-${subDistrict.zip_code}`;
                  return (
                    <option key={key} value={id}>
                      {subDistrict.name}
                    </option>
                  );
                })}
              </Field>
              <Field
                className={cx(s.addressField, s.hidden)}
                name="subdistrict"
                type="text"
                component={FieldInput}
              />
              <Field
                className={cx(s.addressField, s.hidden)}
                name="full_tax_type"
                type="text"
                component={FieldInput}
              />
              <Field
                className={cx(s.addressField, s.hidden)}
                name="full_tax_request"
                type="text"
                component={FieldInput}
                value="1"
              />
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

const selector = formValueSelector(formName);

const mapStateToProps = state => {
  return {
    billing: {
      regions: state.guestAddress.regions,
      districts: state.guestAddress.districts,
      subDistricts: state.guestAddress.subDistricts,
      regionId: selector(state.guestAddress, 'region_id'),
      districtId: selector(state.guestAddress, 'district_id'),
      regionSuggest: state.guestAddress.regionSuggest,
      regionSuggestError: state.guestAddress.regionSuggestError,
    },
    shipping: {
      form: getFormValues('guestAddressForm')(state),
    },
    checkout: {
      deliveryOption: state.checkout.deliveryOption,
    },
  };
};

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field, value) =>
    dispatch(change('guestBillingAddressForm', field, value)),
  resetForm: name => dispatch(reset(name)),
  fetchRegions: () => dispatch(fetchRegions()),
  fetchDistricts: regionId => dispatch(fetchDistricts(regionId)),
  fetchSubDistricts: (regionId, districtId) => {
    dispatch(fetchSubDistricts(regionId, districtId));
  },
  setValue: (field, value) => dispatch(change(formName, field, value)),
  estimateGuestShipment: postcode => dispatch(estimateGuestShipment(postcode)),
  fetchRegionByPostcode: (postcode, suggest = true) =>
    dispatch(fetchRegionByPostcode(postcode, suggest)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GuestBillingAddressForm);
