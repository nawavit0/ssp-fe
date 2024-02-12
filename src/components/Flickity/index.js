import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const FlickityComponent = props => {
  const { flickityRef, options, children, callback } = props;
  let flkty = null;
  let carousel = null;

  if (options.prevNextButtons === true || options.arrowShape) {
    options.arrowShape =
      'M 530.566406 1075.927734 L 82.275391 627.636719 L 533.203125 176.708984 M 95.898438 625 L 1215.527344 625 ';
  }

  const renderPortal = () => {
    const mountNode = carousel.querySelector('.flickity-slider');
    if (mountNode) return createPortal(children, mountNode);
  };

  const initFlickity = () => {
    flkty = new Flickity(carousel, options);
    if (flickityRef) flickityRef(flkty);
    if (callback) {
      callback(flkty);
    }
  };

  useEffect(() => {
    if (typeof Flickity !== 'undefined' && typeof window !== 'undefined') {
      initFlickity();
    } else {
      setTimeout(function() {
        initFlickity();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flickityRef]);

  return React.createElement(
    props.elementType,
    {
      className: props.className,
      ref: c => {
        carousel = c;
      },
    },
    props.static ? props.children : renderPortal(),
  );
};

FlickityComponent.propTypes = {
  className: PropTypes.string,
  elementType: PropTypes.string,
  flickityRef: PropTypes.func,
  options: PropTypes.object,
  static: PropTypes.bool,
};

FlickityComponent.defaultProps = {
  className: '',
  elementType: 'div',
  options: {},
  static: false,
};

export default FlickityComponent;
