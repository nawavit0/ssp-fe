import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { get } from 'lodash';

const HideTextStyled = styled.div`
  margin: 0;
  float: right;
  color: #0d0d0d;
  cursor: pointer;
`;
const ParagraphLabelStyled = styled.div`
  font-size: 14px;
  line-height: 150%;
  vertical-align: middle;
  margin: 0;
  p {
    margin-bottom: 0;
  }
`;
const ReadMoreStyled = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0;
  color: #0d0d0d;
  background: #fff;
  padding: 0 5px;
`;
const ShortDescriptionStyled = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #959595;
  .collapse-open:checked ~ .collapse-panel {
    display: block;
    visibility: visible;
    height: auto;
  }
  .collapse-open ~ .collapse-panel {
    visibility: hidden;
    height: 0;
    overflow: hidden;
  }
  .collapse-panel {
    max-height: 55px;
    transition: max-height 100ms, opacity: 0.3s;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    > .collapse-read {
      cursor: pointer;
      display: block;
      opacity: 1;
    }
    &[data-hide='false'] {
      max-height: 100%;
      > .collapse-read {
        display: none;
        opacity: 0;
      }
    }
  }
`;

const ShortDescriptionDesktop = ({ shortDescription, translate }) => {
  useEffect(() => {
    setProductDescriptionHeight(get(divContent, 'current.clientHeight', 0));
  }, [shortDescription]);

  const [hideDescriptionFlag, setHideDescriptionFlag] = useState(true);
  const divContent = useRef(null);
  const [productDescriptionHeight, setProductDescriptionHeight] = useState(0);
  const heightOfContent = productDescriptionHeight;

  return (
    <ShortDescriptionStyled>
      {shortDescription !== '' && (
        <div className={`collapse-panel`} data-hide={hideDescriptionFlag}>
          <div className={`collapse-inner`}>
            <ParagraphLabelStyled ref={divContent}>
              <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
            </ParagraphLabelStyled>
          </div>
          {heightOfContent > 48 && (
            <>
              <ReadMoreStyled
                onClick={() => setHideDescriptionFlag(false)}
                className={`collapse-read`}
              >
                {translate('product_detail.read_more')}
              </ReadMoreStyled>
              <HideTextStyled onClick={() => setHideDescriptionFlag(true)}>
                {translate('product_detail.hide_text')}
              </HideTextStyled>
            </>
          )}
        </div>
      )}
    </ShortDescriptionStyled>
  );
};

export default ShortDescriptionDesktop;
