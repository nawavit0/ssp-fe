import React, { useState, useEffect } from 'react';
import { withLocales, withRoutes } from '@central-tech/core-ui';
import ImageLazy from '../../Image/ImageLazy';
import MiniCartContainer from '../../MiniCart/MiniCartContainer';
import ClickOutside from '../../ClickOutside';
import { CartCollapse, CartArea } from '../styled';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../utils/generateElementId';
import { get } from 'lodash';
import propTypes from 'prop-types';
import RenderMiniCartQty from '../CartQty';
import history from '../../../history';

// eslint-disable-next-line no-unused-vars
let toggleOpenCart = false;

const OpenCart = (props, { customer }) => {
  const [isCollapseCart, setCollapseCart] = useState(false);
  const [isFirstTime, setFirstTime] = useState(false);

  useEffect(() => {
    return history.listen(() => {
      setCollapseCart(false);
    });
  }, []);

  useEffect(() => {
    toggleOpenCart = isCollapseCart;
  });

  const toggleLangCollapse = () => {
    toggleOpenCart = !toggleOpenCart;
    setCollapseCart(toggleOpenCart);
  };
  const isGuest = !get(customer, 'id', false);
  const guestCartId = get(customer, 'guest.cartId', '');

  return (
    <>
      <CartArea
        id={generateElementId(
          ELEMENT_TYPE.MENU,
          ELEMENT_ACTION.VIEW,
          'MiniCart',
          'Header',
        )}
      >
        <div
          onClick={() => {
            toggleLangCollapse();
            setFirstTime(true);
          }}
        >
          <RenderMiniCartQty
            isGuest={isGuest}
            guestCartId={guestCartId}
            isMobile={false}
          />
          <ImageLazy src={`/static/icons/ShoppingBag.svg`} width={'35px'} />
        </div>
        {isFirstTime ? (
          <CartCollapse visible={isCollapseCart}>
            <ClickOutside
              visible={isCollapseCart}
              fnCallback={() => setCollapseCart(false)}
            >
              <MiniCartContainer />
            </ClickOutside>
          </CartCollapse>
        ) : null}
      </CartArea>
    </>
  );
};

OpenCart.contextTypes = {
  customer: propTypes.object,
};

export default withLocales(withRoutes(OpenCart));
