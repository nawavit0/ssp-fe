import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { get } from 'lodash';

const HideTextStyled = styled.span`
  position: absolute;
  bottom: 0px;
  right: 0;
  color: rgb(28, 60, 192);
  background: #fff;
  padding: 0 5px;
  font-size: 14px;
`;
const ParagraphLabelStyled = styled.div`
  font-size: 14px;
  line-height: 150%;
  vertical-align: middle;
  margin: 0;
  p {
    margin: 0;
  }
`;
const ReadMoreStyled = styled.div`
  position: absolute;
  bottom: 1px;
  right: 0;
  color: rgb(28, 60, 192);
  background: #fff;
  padding: 0 5px;
  font-size: 14px;
`;
const ShortDescriptionStyled = styled.div`
  padding: 8px 0;
  position: relative;
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
    max-height: 42px;
    transition: max-height 100ms, opacity 300ms;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    > .collapse-inner {
      padding-bottom: 30px;
    }
    > .collapse-read {
      cursor: pointer;
      display: block;
      opacity: 1;
    }
    &[data-hide='true'] {
      > .collapse-hide {
        display: none;
        opacity: 0;
      }
    }
    &[data-hide='false'] {
      max-height: 100%;
      overflow: auto;
      > .collapse-read {
        display: none;
        opacity: 0;
      }
      > .collapse-hide {
        display: inline-block;
        opacity: 1;
      }
    }
  }
`;

const handleDescription = (setHideDescriptionFlag, isHide) => {
  setHideDescriptionFlag(isHide);
};

const ShortDescriptionMobile = ({ shortDescription, translate }) => {
  const [hideDescriptionFlag, setHideDescriptionFlag] = useState(true);
  const [elHeight, setElHeight] = useState(0);
  const divContent = useRef(null);
  const heightOfContent = elHeight.toString();

  useEffect(() => {
    setElHeight(get(divContent, 'current.clientHeight', 0));
  }, [elHeight]);

  return (
    <ShortDescriptionStyled>
      {shortDescription !== '' && (
        <div className={`collapse-panel`} data-hide={hideDescriptionFlag}>
          <div className={`collapse-inner`}>
            <ParagraphLabelStyled ref={divContent}>
              <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
              {heightOfContent > 48 && (
                <HideTextStyled
                  onClick={() =>
                    handleDescription(setHideDescriptionFlag, true)
                  }
                  className={`collapse-hide`}
                >
                  {translate('product_detail.hide_text')}
                </HideTextStyled>
              )}
            </ParagraphLabelStyled>
          </div>
          {heightOfContent > 48 && (
            <>
              <ReadMoreStyled
                onClick={() => handleDescription(setHideDescriptionFlag, false)}
                className={`collapse-read`}
              >
                {translate('product_detail.read_more')}
              </ReadMoreStyled>
            </>
          )}
        </div>
      )}
    </ShortDescriptionStyled>
  );
};

export default ShortDescriptionMobile;
