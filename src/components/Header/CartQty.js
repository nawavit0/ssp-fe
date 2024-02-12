import { CartMiniWidget } from '@central-tech/core-ui';
import { get } from 'lodash';
import { MobileCartQty, DesktopCartQty } from './styled';
import React, { useState } from 'react';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../utils/generateElementId';

const RenderMiniCartQty = props => {
  const { isGuest, guestCartId, isMobile } = props;

  const [getGuestCartId, setGuestCartId] = useState(guestCartId);

  const handleGuestCartId = data => {
    const guestCartId = data?.cartMini?.guest_id || '';
    if (guestCartId) {
      setGuestCartId(guestCartId);
    }
  };

  return (
    <CartMiniWidget
      isGuest={isGuest}
      cartId={isGuest ? getGuestCartId : null}
      skip={isGuest && getGuestCartId === undefined}
      ssr={false}
      onCompleted={data => handleGuestCartId(data)}
    >
      {({ data, loading }) => {
        if (loading) return null;
        const cartMini = get(data, 'cartMini', {});
        const cartId = get(cartMini, 'id', '');
        if (!isGuest && cartId !== localStorage.getItem('user_cart_id')) {
          localStorage.setItem('user_cart_id', cartId);
        } else if (getGuestCartId !== localStorage.getItem('guest_cart_id')) {
          localStorage.setItem('guest_cart_id', getGuestCartId);
        }
        const qty = get(cartMini, 'items_qty', 0);
        if (qty !== 0) {
          return isMobile ? (
            <MobileCartQty>
              <div
                id={generateElementId(
                  ELEMENT_TYPE.MENU,
                  ELEMENT_ACTION.VIEW,
                  'MiniCartQty',
                  'MobileHeader',
                )}
              >
                {qty}
              </div>
            </MobileCartQty>
          ) : (
            <DesktopCartQty>
              <div
                id={generateElementId(
                  ELEMENT_TYPE.MENU,
                  ELEMENT_ACTION.VIEW,
                  'MiniCartQty',
                  'MobileHeader',
                )}
              >
                {qty}
              </div>
            </DesktopCartQty>
          );
        }
        return null;
      }}
    </CartMiniWidget>
  );
};

export default RenderMiniCartQty;
