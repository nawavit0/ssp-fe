import React, { Component } from 'react';
import pt from 'prop-types';
import { compose } from 'redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FreeGiftPanel.scss';
import t from './translation.json';
import withLocales from '../../utils/decorators/withLocales';
import Collapse from '../Select/Collapse';
import Image from '../Image';
import Price from '../Price';
import cx from 'classnames';
import { map } from 'lodash';

class FreeGiftPanel extends Component {
  static propTypes = {
    className: pt.string,
    title: pt.string,
    collapsible: pt.bool,
  };

  static defaultProps = {
    collapsible: true,
  };

  renderPanel = () => {
    const { items, translate, className } = this.props;
    return (
      <React.Fragment>
        {map(items, (item, index) => (
          <div className={cx(className, s.giftSectionWrap)} key={index}>
            <div className={s.giftImage}>
              <Image src={item.image} />
            </div>
            <div className={s.giftDescriptionSection}>
              <div>
                <strong>{item.brand_name_option}</strong>
              </div>
              <div>{item.name}</div>
              <div className={s.quantityGiftSection}>
                <div>{item.color_option}</div>
                <div className={s.productQuantity}>
                  <div>{translate('quantity')}</div>
                  <div>{item.qty}</div>
                </div>
                <div>
                  <Price
                    price={item.price}
                    freeMessage
                    format
                    size="tiny"
                    bold
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  };

  render() {
    const { className, title, collapsible } = this.props;
    return (
      <div className={className}>
        {collapsible ? (
          <Collapse
            title={title}
            titleClassName={s.collapseTitle}
            openedByDefault={false}
          >
            {this.renderPanel()}
          </Collapse>
        ) : (
          <React.Fragment>{this.renderPanel()}</React.Fragment>
        )}
      </div>
    );
  }
}

export default compose(
  withLocales(t),
  withStyles(s),
)(FreeGiftPanel);
