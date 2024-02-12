import React from 'react';
import { withLocales } from '@central-tech/core-ui';
import styled from 'styled-components';
import pt from 'prop-types';
import { formatPrice } from '../../utils/formatPrice';

const PriceStyled = styled.div`
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  font-weight: ${props => props.fontWeight};
  line-height: 150%;
  ${props => props.customStyle || ''}
`;

@withLocales
class Price extends React.PureComponent {
  static propTypes = {
    price: pt.oneOfType([pt.number, pt.string]),
    space: pt.bool,
    digit: pt.number,
    isDiscount: pt.bool,
    isIconBaht: pt.bool,
    freeMessage: pt.bool,
    customStyle: pt.string,
    fontSize: pt.number,
    color: pt.string,
    fontWeight: pt.number,
    uniqueId: pt.string,
    className: pt.string,
  };

  static defaultProps = {
    price: 0,
    space: false,
    digit: 0,
    isDiscount: false,
    isIconBaht: true,
    freeMessage: false,
    fontSize: 23,
    color: '#DD0000',
    fontWeight: 500,
    uniqueId: '',
    className: '',
  };

  render() {
    const {
      space,
      isDiscount,
      isIconBaht,
      freeMessage,
      price,
      translate,
      fontSize,
      color,
      fontWeight,
      customStyle,
      uniqueId,
      digit,
      className,
    } = this.props;

    const priceId = uniqueId || '';

    return (
      <PriceStyled
        id={priceId}
        fontSize={fontSize}
        color={color}
        fontWeight={fontWeight}
        customStyle={customStyle}
        className={className ? className : 'product-detail-color'}
      >
        {freeMessage && Number(price) === 0 ? (
          <>{translate('free')}</>
        ) : (
          <>
            {isIconBaht ? (isDiscount ? `-฿` : '฿') : ''}
            {space && ' '}
            {formatPrice(price, digit, isDiscount)}
          </>
        )}
      </PriceStyled>
    );
  }
}

export default Price;
