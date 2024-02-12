import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import s from './OrderFailHeader.scss';
import t from './translation.json';
import IosCloseCircle from 'react-ionicons/lib/IosCloseCircle';
import Row from '../../../components/Row';
import Col from '../../../components/Col';
import trackBlue from '../../../../public/images/blue@3x.png';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const moduleName = 'OrderFail';

const OrderFailHeader = ({ orderId, isGuest, email, translate }) => (
  <div className={s.root}>
    <Row className={s.printHeader}>
      <Col className={s.colPrint} lg={6} md={12}>
        <div className={s.thankYouMessage}>
          <div className={s.icon}>
            <IosCloseCircle
              icon="ios-close-circle"
              fontSize="48px"
              color="#9f3a38"
            />
          </div>
          <div className={s.text}>
            <h3
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                moduleName,
                '',
                'status_title',
              )}
              className={s.title}
            >
              {translate('status_title')}
            </h3>
            <p
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                moduleName,
                '',
                'status_description',
              )}
              className={s.title}
            >
              {translate('status_description')}
            </p>
          </div>
        </div>
      </Col>
      <Col className={s.colPrint} lg={6} md={12}>
        <div className={s.orderNumberContainer}>
          <p className={s.labelOrderNo}>
            {translate('order_no')}{' '}
            <span
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                moduleName,
                '',
                'order_no',
              )}
              className={s.orderId}
            >
              {orderId}
            </span>
          </p>
          {isGuest ? (
            <p>
              {translate('guest_order_tacking')}
              <span
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  moduleName,
                  '',
                  'email',
                )}
                className={s.email}
              >
                {email}
              </span>
              <p>
                {translate('you_can')}
                <a
                  id={generateElementId(
                    ELEMENT_TYPE.INFO,
                    ELEMENT_ACTION.VIEW,
                    moduleName,
                    '',
                    'track_your_order',
                  )}
                  href="javascript:;"
                  className={s.linkTrackOrder}
                >
                  <img src={trackBlue} className={s.iconTrack} />
                  {translate('track_your_order')}
                </a>
                {translate('at_homepage_header')}
              </p>
            </p>
          ) : (
            <p
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                moduleName,
                '',
                'order_tacking',
              )}
            >
              {translate('order_tacking')}
            </p>
          )}
        </div>
      </Col>
    </Row>
  </div>
);

export default withLocales(t)(withStyles(s)(OrderFailHeader));
