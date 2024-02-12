import React from 'react';
import cx from 'classnames';
import MdHelpCircle from 'react-ionicons/lib/MdHelpCircle';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import Row from '../../Row';
import Col from '../../Col';
// import Image from '../../Image/';
// import Button from '../../Button';
import s from './OrderCollector.scss';
import t from './translation.json';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const OrderCollector = ({
  firstname,
  lastname,
  email,
  tel,
  translate,
  handleShowModalCollect,
}) => (
  <div>
    <Row gutter={30} className={s.fixMobileGutter}>
      <Col className={cx(s.marginCol, s.contactInfo)} lg={4} md={12}>
        <div className={s.collectorInfo}>
          <h3 className={s.titleColumnCollector}>
            {translate('collectorInfoTitle')}
          </h3>
          <p
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'Customer',
              '',
              'name',
            )}
          >{`${firstname} ${lastname}`}</p>
          <p
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'Customer',
              '',
              'email',
            )}
          >{`${email}`}</p>
          <p
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'Customer',
              '',
              'telephone',
            )}
          >{`${tel}`}</p>
        </div>
      </Col>
      <Col className={s.marginCol} lg={8} md={12}>
        <div className={s.collectorInfo}>
          <h3 className={s.titleColumnCollector}>
            {translate('collectorConditionTitle')}
          </h3>
          <p>{translate('collectorConditionDesc')}</p>
          <p>
            {translate('collectorConditionDesc2')}
            {/* <button
              onClick={handleShowModalCollect}
              className={s.pickupClickInfo}
            >
              {translate('detail')}
            </button> */}
            <MdHelpCircle
              className={s.iconHelp}
              onClick={handleShowModalCollect}
              icon="md-help-circle"
              fontSize="22px"
              color="#c1c1c1"
            />
          </p>
          <p>
            {translate('collectorConditionLastline')}
            <span className={s.boldHilightText}>
              {translate('collectorConditionHilightDay')}
            </span>
          </p>
        </div>
      </Col>
      {/* Remove from comment: wating for api return url link */}
      {/* <Col className={s.getDirectionWrapper}>
        <Image src="/images/get-direction-map.png" />
        <Button className={s.getDirectionButton}>
          <Image
            className={s.getDirectionImage}
            src="/icons/get-direction-icon.png"
          />
          <label className={s.getDiscountText}>
            {translate('get_direction')}
          </label>
        </Button>
      </Col> */}
    </Row>
    <hr className={s.marginLine} />
  </div>
);

export default withLocales(t)(withStyles(s)(OrderCollector));
