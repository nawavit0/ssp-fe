import React, { useState, useEffect } from 'react';
import { withLocales, withRoutes } from '@central-tech/core-ui';
import DesktopTrackOrder from './DesktopTrackOrder';
import { TrackMyOrderArea, TrackMyOrderCollapse } from '../styled';
import ClickOutside from '../../ClickOutside';
import ImageV2 from '../../Image/ImageV2';

let toggleOpenTrackOrder = false;

const OpenDesktopTrackOrder = props => {
  const { translate } = props;
  const [isCollapseTrackOrder, setCollapseTrackOrder] = useState(false);
  const [isFirstTime, setFirstTime] = useState(false);

  const toggleTrackOrderCollapse = () => {
    toggleOpenTrackOrder = !toggleOpenTrackOrder;
    setCollapseTrackOrder(toggleOpenTrackOrder);
  };

  useEffect(() => {
    toggleOpenTrackOrder = isCollapseTrackOrder;
  });

  const handleCloseTrackOrder = () => {
    setCollapseTrackOrder(false);
  };

  return (
    <TrackMyOrderArea>
      <div
        className="link-track"
        onClick={() => {
          toggleTrackOrderCollapse();
          setFirstTime(true);
        }}
      >
        <ImageV2
          src={'/static/icons/TrackYourOrderDesktop.svg'}
          width={'18px'}
          height={'18px'}
        />
        {translate('header.track_my_order')}
      </div>
      {isFirstTime ? (
        <TrackMyOrderCollapse visible={isCollapseTrackOrder}>
          <ClickOutside
            visible={isCollapseTrackOrder}
            fnCallback={() => setCollapseTrackOrder(false)}
          >
            <DesktopTrackOrder handleCloseTrackOrder={handleCloseTrackOrder} />
          </ClickOutside>
        </TrackMyOrderCollapse>
      ) : null}
    </TrackMyOrderArea>
  );
};

export default withLocales(withRoutes(OpenDesktopTrackOrder));
