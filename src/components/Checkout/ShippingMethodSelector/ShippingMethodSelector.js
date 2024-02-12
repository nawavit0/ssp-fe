import React from 'react';
import { connect } from 'react-redux';
import pt from 'prop-types';
import { map, get as prop, size } from 'lodash';
import ShippingOption from './ShippingOption';
import { getFormShippingAddress } from '../../../reducers/checkout/selectors';
import { getShippingSegment } from '../../../reducers/payment/selectors';

class ShippingMethodSelector extends React.PureComponent {
  static Proptypes = {
    items: pt.array.isRequired,
    onChange: pt.func,
    selectedItem: pt.object,
    title: pt.string,
  };

  static defaultProps = {
    items: [],
    selectedItem: null,
  };

  componentDidMount() {}

  handleChange = item => {
    // const { onChange, selectedItem } = this.props;
    // if (isFunction(onChange) && selectedItem !== item) {
    this.props.onChange(item);
    // }
  };

  getSelectedIndex() {
    const { items, selectedItem, getShippingSegment } = this.props;
    return selectedItem && getShippingSegment.value === selectedItem.amount
      ? items.indexOf(selectedItem)
      : -1;
  }

  renderShippingMethod(shipping, index) {
    const selectedIndex = this.getSelectedIndex();
    const isSelected = selectedIndex === index;
    const key = `${shipping.method_code}${shipping.carrier_code}`;

    return (
      <ShippingOption
        key={key}
        shipping={shipping}
        selected={isSelected}
        onClick={this.handleChange}
      />
    );
  }

  render() {
    const { items, getFormShippingAddress } = this.props;
    const renderMethod = this.renderShippingMethod.bind(this); // resolve `this`
    return (
      <div id="sl-ShippingMethodSelector">
        {getFormShippingAddress &&
          size(prop(getFormShippingAddress, 'postcode')) === 5 && (
            <div>{map(items, renderMethod)}</div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  getFormShippingAddress: getFormShippingAddress(state),
  getShippingSegment: getShippingSegment(state),
});
export default connect(mapStateToProps)(ShippingMethodSelector);
