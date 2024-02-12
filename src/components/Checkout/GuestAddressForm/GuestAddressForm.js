import React from 'react';
import { withLocales } from '@central-tech/core-ui';
import pt from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import withLocales from '../../../utils/decorators/withLocales';
import {
  isEmpty,
  map,
  get as prop,
  uniqBy,
  filter,
  size,
  isUndefined,
} from 'lodash';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
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
} from '../../../reducers/address/actions';
import {
  getDistrict,
  getSubDistrict,
} from '../../../reducers/address/selectors';
import { estimateGuestShipment } from '../../../reducers/checkout/actions';
import { explode } from '../../../utils/customAttributes';

export const formName = 'guestAddressForm';

const validate = values => {
  const requiredData = [
    'address_line',
    'postcode',
    'region_id',
    'district_id',
    'subdistrict_id',
  ];
  const errors = requiredData.reduce((e, data) => {
    if (
      !values[data] ||
      values[data] === '' ||
      values[data] === ' ' ||
      isUndefined(values[data]) ||
      (size(values[data]) > 0 && values[data][0] === ' ')
    ) {
      e[data] = 'address_book_form.required';
    } else if (data === 'postcode') {
      if (isNaN(Number(values[data]))) {
        e[data] = 'address_book_form.number_format';
      } else if (values[data].length < 5) {
        e[data] = 'address_book_form.number_required_length';
      }
    }
    return e;
  }, {});
  return errors;
};

@withStyles(s)
@withLocales
@reduxForm({
  form: formName,
  validate,
})
class GuestAddressForm extends React.PureComponent {
  static propTypes = {
    className: pt.string,
    disabled: pt.bool,
    regions: pt.arrayOf(pt.object),
    districts: pt.arrayOf(pt.object),
    subDistricts: pt.arrayOf(pt.object),
    regionId: pt.oneOfType([pt.string, pt.number]),
    districtId: pt.oneOfType([pt.string, pt.number]),
    address: pt.object,
  };

  componentDidMount() {
    this.props.fetchRegions();
    this.initialAddress();
  }

  initialAddress() {
    const { address, initialize } = this.props;
    if (!isEmpty(address)) {
      const values = explode(address);
      initialize({ ...values });

      if (values.postcode && values.postcode.length >= 5) {
        this.props.fetchRegionByPostcode(values.postcode);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.regionSuggest !== this.props.regionSuggest) {
      this.handleSuggestionByZipcode();
    }
  }

  handleSuggestionByZipcode = async () => {
    const { regionSuggest, postcode } = this.props;

    if (regionSuggest) {
      const regionID = regionSuggest.region_id;
      const districtID = prop(regionSuggest, 'district[0].district_id');
      const districtName = prop(regionSuggest, 'district[0].name');
      const subDistrictID = prop(
        regionSuggest,
        'district[0].subdistrict[0].subdistrict_id',
      );
      const subDistrictName = prop(
        regionSuggest,
        'district[0].subdistrict[0].name',
      );

      this.props.setValue('region_id', regionID);

      await this.props.fetchDistricts(regionID);
      this.props.setValue('district_id', districtID);
      this.props.setValue('district', districtName);

      await this.props.fetchSubDistricts(regionID, districtID);
      this.props.setValue('subdistrict_id', subDistrictID);
      this.props.setValue('subdistrict', subDistrictName);

      this.props.estimateGuestShipment(postcode);
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
    const { regionId, districtId, getDistrict } = this.props;
    if (districtId === e.target.value) return;
    await this.props.fetchSubDistricts(regionId, e.target.value);
    const getDistrictName = filter(
      getDistrict,
      dist => dist.district_id === e.target.value,
    );
    const districtName =
      getDistrictName.length > 0 ? getDistrictName[0].name : null;
    this.props.setValue('district', districtName);
    this.props.setValue('subdistrict_id', null);
    this.props.setValue('subdistrict', null);
  };
  handleSubDistrictChange = async e => {
    const { subDistrictId, getSubDistrict } = this.props;
    if (subDistrictId === e.target.value) return;
    const getSubDistrictName = filter(
      getSubDistrict,
      sub => sub.subdistrict_id === e.target.value,
    );
    const subDistrictName =
      getSubDistrictName.length > 0 ? getSubDistrictName[0].name : null;
    this.props.setValue('subdistrict', subDistrictName);
  };

  handleDetectDistrictClick = () => {
    const { regionId, districts } = this.props;

    if (regionId && isEmpty(districts)) {
      this.props.fetchDistricts(regionId);
    }
  };

  handlePostcodeChange = event => {
    const postcode = event.target.value;

    if (postcode && postcode.length === 5) {
      this.props.fetchRegionByPostcode(postcode);
    }

    if (postcode && postcode.length > 5) {
      event.preventDefault();
    }
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
      regions,
      disabled,
      districts,
      subDistricts,
      regionId,
      districtId,
      handleSubmit,
      translate,
    } = this.props;

    const uniqSubDistricts = uniqBy(subDistricts, e => {
      return e.subdistrict_id;
    });

    return (
      <div className={cx(s.root, className)}>
        <form onSubmit={handleSubmit}>
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
                component={FieldInput}
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
                {map(regions, region => {
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
                disabled={disabled || !regionId}
                onChange={this.handleDistrictChange}
                onClick={this.handleDetectDistrictClick}
                msgError={translate}
              >
                {map(districts, district => {
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
                autoComplete="off"
                disabled={disabled || !districtId}
                onChange={this.handleSubDistrictChange}
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
    regions: state.address.regions,
    districts: state.address.districts,
    subDistricts: state.address.subDistricts,
    regionId: selector(state, 'region_id'),
    districtId: selector(state, 'district_id'),
    subDistrictId: selector(state, 'subdistrict_id'),
    postcode: selector(state, 'postcode'),
    getDistrict: getDistrict(state),
    getSubDistrict: getSubDistrict(state),
    regionSuggest: state.address.regionSuggest,
    regionSuggestError: state.address.regionSuggestError,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchRegions: () => dispatch(fetchRegions()),
  fetchDistricts: regionId => dispatch(fetchDistricts(regionId)),
  fetchSubDistricts: (regionId, districtId) => {
    dispatch(fetchSubDistricts(regionId, districtId));
  },
  setValue: (field, value) => dispatch(change(formName, field, value)),
  estimateGuestShipment: postcode => dispatch(estimateGuestShipment(postcode)),
  fetchRegionByPostcode: postcode => dispatch(fetchRegionByPostcode(postcode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GuestAddressForm);
