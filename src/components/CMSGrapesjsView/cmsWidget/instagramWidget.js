import React from 'react';
import { renderToString } from 'react-dom/server';
import styled from 'styled-components';

const SlideMobileStyled = styled.div`
  position: relative;
  height: 28.57vw;
  min-height: 200px;
  > div {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-points-y: repeat(100%);
    scroll-snap-type: x mandatory;
    scroll-snap-destination: 100% 0%;
    display: flex;
  }
`;
const SlideItemStyled = styled.div`
  float: left;
  width: auto;
  height: 28.57vw;
  max-height: 100px;
  > a {
    border: 1px solid transparent;
    display: block;
    width: 28.57vw;
    margin: 0px 8px 8px 0px;
    height: 28.57vw;
    max-width: 100px;
    max-height: 100px;
  }
`;
const InstagramWidgetStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 0 0 100%;
  justify-content: center;
  .flexinner {
    max-width: 20%;
    overflow: hidden;
    width: 256px;
    height: 256px;
    margin: 6px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const renderInstagram = (instagram, isMobile) => {
  if (isMobile) {
    let count = 0;
    const resultFormat = instagram?.length
      ? instagram.slice(0, 10).reduce((formats, item) => {
          if (formats?.[count] && formats[count].length < 2) {
            formats[count].push(item);
            count++;
          } else {
            formats.push([item]);
          }

          return formats;
        }, [])
      : [];

    return (
      <SlideMobileStyled>
        <div>
          {resultFormat.map((instagramDatas, index) => {
            if (instagram?.[index]) {
              return (
                <SlideItemStyled
                  key={`${instagram[index].id}`}
                  className={`flexinner`}
                >
                  {instagramDatas.map(item => (
                    <a href={`${item.link}`} target={`_blank`} key={item.id}>
                      <img src={`${item.images.standard_resolution.url}`} />
                    </a>
                  ))}
                </SlideItemStyled>
              );
            }

            return null;
          })}
        </div>
      </SlideMobileStyled>
    );
  }
  return (
    <InstagramWidgetStyled>
      {instagram.slice(0, 10).map(instagramData => {
        return (
          <div key={`${instagramData.id}`} className={`flexinner`}>
            <a href={`${instagramData.link}`} target={`_blank`}>
              <img src={`${instagramData.images.standard_resolution.url}`} />
            </a>
          </div>
        );
      })}
    </InstagramWidgetStyled>
  );
};

const instagramWidget = (content, isMobile) => {
  if (
    typeof window !== 'undefined' &&
    window?.CmsSetting?.useInstagram === true
  ) {
    const { instagram } = content;
    if (instagram?.[0]) {
      const instagramWidgetElement = document.getElementsByClassName(
        'js-instagram-widget',
      );
      if (instagramWidgetElement[0]) {
        instagramWidgetElement[0].innerHTML = renderToString(
          renderInstagram(instagram, isMobile),
        );
      }
    }
  }
};

export default instagramWidget;
