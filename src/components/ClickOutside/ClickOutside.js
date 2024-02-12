import React, { useEffect, memo } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

const removeClassNonePointer = () => {
  document.querySelector('body').classList.remove('nonePointerEvents');
};

const ClickOutside = ({ children, visible = false, fnCallback = () => {} }) => {
  useEffect(() => {
    if (visible === true) {
      document.querySelector('body').classList.add('nonePointerEvents');
    } else {
      removeClassNonePointer();
    }
  });

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        removeClassNonePointer();
        fnCallback();
      }}
    >
      {children}
    </OutsideClickHandler>
  );
};

export default memo(ClickOutside);
