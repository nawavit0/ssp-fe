import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import IosClose from 'react-ionicons/lib/IosClose';
import s from './Modal.scss';

const Modal = ({
  show,
  header,
  footer,
  children,
  className,
  classNameModal,
  classNameModalHeader,
  classNameModalBody,
  classNameModalFooter,
  classNameBackdrop,
  onModalClose,
  classNameBTClose,
  closeIconSize,
}) => (
  <div>
    {show && (
      <div className={cx(s.root, className)}>
        <div className={cx(s.modalContainer, classNameModal)}>
          <div className={cx(s.close, classNameBTClose)}>
            <IosClose
              icon="ios-close"
              fontSize={closeIconSize || '55px'}
              onClick={onModalClose}
            />
          </div>
          {header && (
            <div className={cx(s.modalHeader, classNameModalHeader)}>
              {header}
            </div>
          )}
          <div className={cx(s.modalBody, classNameModalBody)}>{children}</div>
          {footer && (
            <div className={cx(s.modalFooter, classNameModalFooter)}>
              {footer}
            </div>
          )}
        </div>
        <div
          className={cx(s.backdropContainer, classNameBackdrop)}
          onClick={onModalClose}
        />
      </div>
    )}
  </div>
);

export default withStyles(s)(Modal);
