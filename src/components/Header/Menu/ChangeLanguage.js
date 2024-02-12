import React, { Fragment, useState, useEffect } from 'react';
import { withLocales, withRoutes } from '@central-tech/core-ui';
import ImageV2 from '../../Image/ImageV2';
import ClickOutside from '../../ClickOutside';
import {
  ButtonLanguageStyled,
  LangCollapse,
  ChangeLanguageStyled,
} from '../styled';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../utils/generateElementId';

let toggleChangeLang = false;

const handleChangeLanguage = (lang, location, pageName = '') => {
  window.handleChangeLanguage(lang, location, pageName);
};

const ChangeLanguage = props => {
  const { translate, lang, location, color, pageName } = props;
  const [isCollapseLang, setCollapseLang] = useState(false);

  useEffect(() => {
    toggleChangeLang = isCollapseLang;
  });

  const toggleLangCollapse = () => {
    toggleChangeLang = !toggleChangeLang;
    setCollapseLang(toggleChangeLang);
  };

  return (
    <Fragment>
      <ButtonLanguageStyled
        color={color}
        id={generateElementId(
          ELEMENT_TYPE.MENU,
          ELEMENT_ACTION.VIEW,
          'ChangeLanguage',
          'Header',
        )}
        onClick={() => {
          toggleLangCollapse();
        }}
      >
        <ImageV2
          src={`/static/icons/${
            lang === 'th' ? 'EngLanguage.svg' : 'ThaiLanguage.svg'
          }`}
          width={18}
        />
        <span>
          {translate(`header.${lang === 'th' ? 'eng' : 'thai'}_language`)}
        </span>
      </ButtonLanguageStyled>
      {isCollapseLang && (
        <LangCollapse visible>
          <ClickOutside
            visible={isCollapseLang}
            fnCallback={() => setCollapseLang(false)}
          >
            <ChangeLanguageStyled
              customStyle={'padding: 0 0 10px 0;'}
              onClick={() => handleChangeLanguage('en', location, pageName)}
              id={generateElementId(
                ELEMENT_TYPE.MENU,
                ELEMENT_ACTION.VIEW,
                'ChangeLanguageToEng',
                'Header',
              )}
            >
              <ImageV2
                className={lang === 'en' ? 'active' : ''}
                src={`/static/icons/EngLanguage.svg`}
                width={30}
              />
              <span>{translate(`header.eng_language`)}</span>
            </ChangeLanguageStyled>
            <ChangeLanguageStyled
              onClick={() => handleChangeLanguage('th', location, pageName)}
              id={generateElementId(
                ELEMENT_TYPE.MENU,
                ELEMENT_ACTION.VIEW,
                'ChangeLanguageToThai',
                'Header',
              )}
            >
              <ImageV2
                className={lang === 'th' ? 'active' : ''}
                src={`/static/icons/ThaiLanguage.svg`}
                width={30}
              />
              <span>{translate(`header.thai_language`)}</span>
            </ChangeLanguageStyled>
          </ClickOutside>
        </LangCollapse>
      )}
    </Fragment>
  );
};

export default withLocales(withRoutes(ChangeLanguage));
