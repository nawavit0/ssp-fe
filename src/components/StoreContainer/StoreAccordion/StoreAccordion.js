import React from 'react';
import pt from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import translateFile from '../../StoreContainer/translation.json';
import classes from './StoreAccordion.scss';
import classNames from 'classnames';
import Row from '../../Row/Row';
import Col from '../../Col/Col';
import { get } from 'lodash';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

@withStyles(classes)
@withLocales(translateFile)
class StoreAccordion extends React.PureComponent {
  static propTypes = {
    id: pt.string,
    isExpand: pt.bool,
    isHidden: pt.bool,
    storeDetail: pt.object.isRequired,
    selectedId: pt.any,
    onSelectedStore: pt.func,
    onSetStore: pt.func,
  };

  static defaultProps = {
    id: null,
  };

  handleButtonSelectStore() {
    const { storeDetail, selectedId, onSetStore } = this.props;
    if (Number(selectedId) === Number(storeDetail.id)) {
      onSetStore(null);
    } else {
      onSetStore(storeDetail);
    }
  }

  handleAccordion() {
    const { storeDetail, onSelectedStore, selectedId } = this.props;
    if (selectedId === storeDetail.id) {
      return false;
    }
    onSelectedStore(storeDetail);
  }

  render() {
    const {
      id,
      storeDetail,
      isExpand,
      isHidden,
      selectedId,
      translate,
    } = this.props;
    const {
      address_line1,
      postal_code,
      telephone,
      districtFull,
      provinceFull,
    } = storeDetail;

    const shortAddress = this.formatLine([districtFull, provinceFull]);
    const addressLine = this.formatLine([
      address_line1,
      districtFull,
      provinceFull,
      postal_code,
    ]);

    const storeDetailClass = classNames(classes.StoreAccordion, {
      [classes.StoreAccordionisExpand]: isExpand,
    });

    const buttonSelectClass = classNames(classes.ButtonSelectStore, {
      [classes.ButtonSelectStoreIsActive]: selectedId
        ? storeDetail.id === selectedId
        : false,
    });

    if (isHidden) {
      return null;
    }

    return (
      <div className={storeDetailClass} key={storeDetail.id}>
        <div
          id={id}
          className={classes.Header}
          onClick={() => this.handleAccordion()}
        >
          <Row>
            <Col lg={6} md={6} sm={12}>
              <h4 className={classes.Title}>{storeDetail.name}</h4>
            </Col>
            <Col lg={6} md={6} sm={12}>
              {!isExpand && (
                <div className={classes.Subtitle}>
                  <p title={shortAddress}>{shortAddress}</p>
                </div>
              )}
            </Col>
          </Row>
        </div>
        {isExpand && (
          <div className={classes.Body}>
            <Row>
              <Col lg={6} md={6} sm={12}>
                {addressLine}
                <p>
                  <strong>{translate('labelContact')}</strong>
                  <br />
                  {telephone}
                </p>
              </Col>
              <Col lg={6} md={6} sm={12}>
                <div className={classes.columnAction}>
                  <button
                    id={generateElementId(
                      ELEMENT_TYPE.BUTTON,
                      ELEMENT_ACTION.ADD,
                      'Store',
                      '',
                      get(storeDetail, 'id', null),
                    )}
                    type="button"
                    className={buttonSelectClass}
                    onClick={() => this.handleButtonSelectStore()}
                  >
                    {storeDetail.id === selectedId ? (
                      <span>{translate('buttonDeSelectStore')}</span>
                    ) : (
                      <span>{translate('buttonSelectStore')}</span>
                    )}
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }

  formatLine = (values = []) => values.filter(v => !!v).join(', ');
}

export default StoreAccordion;
