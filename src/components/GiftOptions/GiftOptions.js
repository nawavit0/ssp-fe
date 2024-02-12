import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { isEmpty, find, map, get } from 'lodash';
import withLocales from '../../utils/decorators/withLocales';
import Image from '../../components/Image';
import Price from '../../components/Price';
import Checkbox from '../../components/Checkbox';
import {
  putGiftWrapping,
  deleteGiftWrapping,
} from '../../reducers/cart/actions';
import s from './GiftOptions.scss';
import t from './translation.json';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

import {
  filterRetailProduct,
  findProductAllowGiftWrapping,
  findGiftWrappingInSegment,
} from '../../utils/helper/marketplace';

class GiftOptions extends React.PureComponent {
  state = {
    expand: false,
    giftMessage: '',
    giftWrapping: null,
    enabledGiftWrap: true,
  };

  componentDidMount() {
    this.initialGiftOptions();
  }

  componentDidUpdate(prevProps) {
    const { totalSegments, cart } = this.props;
    const prevGiftWrapping = find(
      prevProps.totalSegments,
      findGiftWrappingInSegment,
    );
    const currenctGiftWrapping = find(totalSegments, findGiftWrappingInSegment);

    if (
      prevGiftWrapping !== currenctGiftWrapping ||
      prevProps.cart.items !== cart.items
    ) {
      this.initialGiftOptions();
    }
  }

  initialGiftOptions = () => {
    const tempGiftWrapping = find(
      this.props.totalSegments,
      findGiftWrappingInSegment,
    );

    if (tempGiftWrapping) {
      this.setState(
        {
          giftWrapping: tempGiftWrapping,
        },
        () => {
          const { giftWrapping } = this.state;
          const { extension_attributes } = giftWrapping;
          const giftOrderId = get(extension_attributes, 'gw_order_id');
          const isHasGiftWrapping = giftWrapping && giftOrderId;

          if (isHasGiftWrapping) {
            this.setState({
              expand: true,
              selectedOption: +giftOrderId,
            });
          }
          this.handleEnabledGiftWrap(isHasGiftWrapping);
        },
      );
    }
  };

  handleEnabledGiftWrap(isHasGiftWrapping) {
    const { cart } = this.props;
    const items = get(cart, 'items');
    const retailProducts = items.filter(filterRetailProduct);
    const hasProductAllowGiftWrapping = retailProducts.find(
      findProductAllowGiftWrapping,
    );

    if (hasProductAllowGiftWrapping) {
      this.setState({ enabledGiftWrap: true });
    } else {
      this.setState({ enabledGiftWrap: false });
      if (isHasGiftWrapping) {
        this.handleDeleteGiftWrapping();
      }
    }
  }

  handleDeleteGiftWrapping() {
    this.props.deleteGiftWrapping();
    this.setState({
      expand: false,
      selectedOption: null,
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  };

  handleChange = event => {
    this.setState(
      {
        giftMessage: event.target.value,
      },
      () => {
        this.props.onChange(this.state.giftMessage);
      },
    );
  };

  handleCheckboxChange = () => {
    const { giftWrappingOptions } = this.props;

    if (!this.state.expand) {
      this.setState({
        selectedOption: giftWrappingOptions[0].wrapping_id,
      });

      this.props.putGiftWrapping(giftWrappingOptions[0].wrapping_id);
    } else {
      this.handleDeleteGiftWrapping();
    }

    this.setState({ expand: !this.state.expand });
  };

  handleOptionClick = option => {
    this.setState({ selectedOption: option.wrapping_id, giftMessage: '' });

    this.props.putGiftWrapping(option.wrapping_id);
  };

  renderCheckboxContent = () => {
    const { translate } = this.props;

    return (
      <div>
        <div className={s.giftWrapping}>{translate('gift_wrapping')}</div>
        <div>{translate('if_you_are_purchasing')}</div>
      </div>
    );
  };

  renderOption = (name, option) => (
    <div
      key={option.wrapping_id}
      className={cx(s.option, {
        [s.active]: option.wrapping_id === this.state.selectedOption,
      })}
      onClick={() => this.handleOptionClick(option)}
    >
      <div className={s.optionCheck}>
        <Image
          src={`/icons/radio-${
            option.wrapping_id === this.state.selectedOption ? '' : 'un'
          }checked.svg`}
        />
        <span className={s.optionName}>{name}</span>
      </div>
      <Price color="blue" price={option.base_price} />
    </div>
  );

  renderGiftWrapOptions = () => {
    const { translate, giftWrappingOptions } = this.props;

    if (isEmpty(giftWrappingOptions)) {
      return null;
    }

    return (
      <form onSubmit={this.handleSubmit} method="post">
        <div className={s.selectForm}>
          <div className={s.select}>
            <div className={cx(s.selectTitle, s.displayDayOne)}>
              {translate('select_gift_wrap_options')}
            </div>
            <div className={cx(s.selectOptions, s.displayDayOne)}>
              {map(giftWrappingOptions, option =>
                this.renderOption(
                  translate(`box_id_${option.wrapping_id}`),
                  option,
                ),
              )}
            </div>
            <div className={s.selectMessage}>
              <div className={s.selectMessageTitle}>
                <div>{translate('add_your_gift_message')}</div>
                <div className={s.charactersLeft}>
                  {270 - this.state.giftMessage.length}{' '}
                  {translate('characters_left')}
                </div>
              </div>
              <textarea
                id={generateElementId(
                  ELEMENT_TYPE.TEXT,
                  ELEMENT_ACTION.ADD,
                  'Gift',
                  '',
                  'message',
                )}
                className={s.selectTextarea}
                placeholder={translate('gift_message')}
                maxLength={270}
                value={this.state.giftMessage}
                name={'giftMessage'}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>
        <div className={s.separator} />
      </form>
    );
  };

  render() {
    const { translate } = this.props;
    const { expand, enabledGiftWrap } = this.state;
    if (!enabledGiftWrap) return null;
    return (
      <Fragment>
        <div className={s.title}>{translate('gift_options')}</div>
        <div className={s.root}>
          <div className={s.choice}>
            <div className={s.giftImageWrapper}>
              <Image src="/icons/gift-wrap.svg" />
            </div>
            <Checkbox
              id={generateElementId(
                ELEMENT_TYPE.CHECKBOX,
                ELEMENT_ACTION.ADD,
                'Gift',
                '',
              )}
              className={s.checkbox}
              checked={expand}
              content={this.renderCheckboxContent()}
              onClick={this.handleCheckboxChange}
            />
          </div>
          {expand && this.renderGiftWrapOptions()}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
  giftWrappingOptions: state.cart.giftWrappingOptions,
  totalSegments: state.payment.payment.totals.total_segments,
});

const mapDispatchToProps = dispatch => ({
  putGiftWrapping: optionId => dispatch(putGiftWrapping(optionId)),
  deleteGiftWrapping: () => dispatch(deleteGiftWrapping()),
});

export default compose(
  withLocales(t),
  withStyles(s),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(GiftOptions);
