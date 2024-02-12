import React from 'react';
import { compose } from 'redux';
import { withLocales, withRoutes, Link } from '@central-tech/core-ui';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withDeviceDetect from '../DeviceDetect/withDeviceDetect';
import ChangeLanguage from '../Header/Menu/ChangeLanguage';
import styled from 'styled-components';
import MdLock from 'react-ionicons/lib/MdLock';
import ImageV2 from '../Image/Image';
import s from './HeaderCheckout.scss';
import Col from '../Col';
import Row from '../Row';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../utils/generateElementId';

const ChangeLanguageStyled = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  color: #6a6969;
`;
const SelectLanguage = styled.select`
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  top: 0;
`;
const customImage = `
  margin-right: 4px;
`;
@withLocales
@withDeviceDetect
@withRoutes
class HeaderCheckout extends React.PureComponent {
  render() {
    const { translate, lang, location, isMobile } = this.props;

    return (
      <div className={s.wrapper}>
        <Col lg={12}>
          <Row className={s.root}>
            <Col lg={4} className={s.left}>
              <div className={s.labelSecure}>
                <MdLock
                  icon="md-lock"
                  fontSize="16px"
                  className={s.keyLockIcon}
                />
                <label>{translate('header_checkout.secure_checkout')}</label>
              </div>
            </Col>
            <Col lg={4} className={s.center}>
              <Link to="/" native>
                <ImageV2
                  src="/static/images/LogoBlueText.svg"
                  className={s.logoBlueText}
                />
              </Link>
            </Col>
            <Col lg={4} className={s.right}>
              {!isMobile ? (
                <ChangeLanguage color="#3B3B3B" />
              ) : (
                <ChangeLanguageStyled>
                  <SelectLanguage
                    value={lang}
                    id={generateElementId(
                      ELEMENT_TYPE.SELECT,
                      ELEMENT_ACTION.VIEW,
                      'Language',
                      'MobileHeaderMenu',
                    )}
                    onChange={e => {
                      if (lang !== e.target.value) {
                        window.handleChangeLanguage(e.target.value, location);
                      }
                    }}
                  >
                    <option value="th">
                      {translate('header.thai_language')}
                    </option>
                    <option value="en">
                      {translate('header.eng_language')}
                    </option>
                  </SelectLanguage>
                  <ImageV2
                    src={
                      lang === 'en'
                        ? `/static/icons/ThaiLanguage.svg`
                        : `/static/icons/EngLanguage.svg`
                    }
                    width="20px"
                    customStyle={customImage}
                  />{' '}
                  {lang === 'en'
                    ? translate('header.thai_language_sort')
                    : translate('header.eng_language')}
                </ChangeLanguageStyled>
              )}
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}

export default compose(withStyles(s))(HeaderCheckout);
