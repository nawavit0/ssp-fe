import React, { memo } from 'react';
import styled from 'styled-components';
import pt from 'prop-types';
import { get as prop } from 'lodash';
import ProductPreview from '../ProductPreview';
import moment from 'moment';

export const DisplayColumnStyled = styled.div`
  margin: 0 0;
  max-width: 248px;
  width: 100%;
  ${props =>
    props.fontColor
      ? `
    .product-detail-color {
      color: ${props.fontColor}
      h4 {
        color: ${props.fontColor}
      }
    }
  `
      : ''};
`;

class ProductGrid extends React.PureComponent {
  static propTypes = {
    updateStatusConfigurableProduct: pt.func,
  };

  transformFlashDealProducts = product => {
    const dateTimeNow = moment();
    return (
      parseInt(prop(product, 'flash_deal_enable', 0)) === 1 &&
      moment(product.flash_deal_from)
        .add(25200000, 'ms')
        .valueOf() <= dateTimeNow &&
      moment(product.flash_deal_to)
        .add(25200000, 'ms')
        .valueOf() >= dateTimeNow
    );
  };

  render() {
    const {
      product,
      updateStatusConfigurableProduct,
      sectionName,
      fontColor = '',
      index,
    } = this.props;
    return (
      <DisplayColumnStyled className={`product-grid`} fontColor={fontColor}>
        <ProductPreview
          product={product}
          countdown={this.transformFlashDealProducts(product)}
          typeSection={
            this.transformFlashDealProducts(product) ? 'flashDeal' : ''
          }
          index={index}
          sectionName={sectionName}
          updateStatusConfigurableProduct={updateStatusConfigurableProduct}
        />
      </DisplayColumnStyled>
    );
  }
}

export default memo(ProductGrid);
