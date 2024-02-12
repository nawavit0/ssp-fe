import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { CmsData } from '../CMSGrapesjsView';
import FlickitySlide from '../Flickity';
import styled from 'styled-components';

const FlickitySlideStyled = styled(FlickitySlide)`
  .flickity-slider {
    transform: none !important;
    div {
      left: 0 !important;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      z-index: -1;
      &.is-selected {
        opacity: 1;
        z-index: 0
      }
    }
    a {
      left: 0 !important;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      z-index: -1;
      &.is-selected {
        opacity: 1;
        z-index: 0
      }
    }
  }
}
`;

const initFlickity = ({ html }) => {
  const content = ReactHtmlParser(html);
  return (
    <FlickitySlideStyled
      className={'js-flickity-slide'}
      options={{
        autoPlay: 5000,
        pageDots: false,
        wrapAround: true,
        prevNextButtons: false,
      }}
      reloadOnUpdate
      static
    >
      {content}
    </FlickitySlideStyled>
  );
};
const RunningText = ({ identifier }) => (
  <CmsData
    identifier={identifier}
    ssr={false}
    wrapper={false}
    callback={initFlickity}
  />
);

export default RunningText;
