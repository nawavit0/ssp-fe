import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import { isEmpty } from 'lodash';
import s from './AccountOverview.scss';
import t from './translation.json';
import Link from '../../../components/Link';
import Button from '../../../components/Button';
import Row from '../../../components/Row';
import Col from '../../../components/Col';
import CheckoutAddress from '../../../components/Checkout/CheckoutAddress';
import The1AccountModal from '../../../components/Account/The1AccountModal';
import { getStorage, clearStorage } from '../../../utils/localStorage';
import cx from 'classnames';
import OrderList from '../../../components/Account/OrderList';
import ImageV2 from '../../../components/Image/ImageV2';

@withStyles(s)
@withLocales(t)
class AccountOverviewContainer extends PureComponent {
  state = {
    showThe1AccountModal: false,
  };

  handleShowThe1AccountModal = () =>
    this.setState({
      showThe1AccountModal: true,
    });

  handleCloseThe1AccountModal = () => {
    this.setState({
      showThe1AccountModal: false,
    });
  };

  handleDisconnectT1 = () => {
    clearStorage();
    window.location.reload();
  };

  renderOverviewCard = (dataInfo, title) => {
    const { translate } = this.props;
    const renderLink = dataInfo ? (
      <div className={s.editBtn}>
        <Link to="/account/address">{translate('change')}</Link>
      </div>
    ) : null;
    const renderHeader = (
      <div
        className={cx(s.header, {
          [s.noData]: !dataInfo,
          [s.hasData]: dataInfo,
        })}
      >
        <div className={s.title}>{title}</div>
        {renderLink}
      </div>
    );
    const renderContent = !dataInfo && (
      <div className={s.noMsg}>
        {translate('add_new_address_now')}
        <Link to="/account/address">
          <ImageV2
            src="/static/icons/AddCircleOutline.svg"
            className={s.iconPlus}
          />
        </Link>
      </div>
    );

    return (
      <div
        className={cx(s.accountContent, {
          [s.hasData]: dataInfo,
        })}
      >
        {renderHeader}
        <div className={s.content}>
          {dataInfo ? <CheckoutAddress address={dataInfo} /> : renderContent}
        </div>
      </div>
    );
  };

  render() {
    const {
      translate,
      customer,
      defaultShipping,
      defaultBilling,
      orders,
      loading,
    } = this.props;

    const email = customer?.email || '-';
    const firstName = customer?.firstname || '';
    const lastName = customer?.lastname || '';
    const customAttributes = customer?.custom_attributes || {};
    const phoneNumber = customAttributes?.phone || '-';

    let t1Account;
    if (!isEmpty(getStorage('t1-overview'))) {
      t1Account = getStorage('t1-overview');
    }

    return (
      <div className={s.root}>
        <div className={s.AccountHeader}>
          <h3 className={s.AccountTitle}>{translate('overview')}</h3>
        </div>
        <div className={s.trackMyOrderLink}>
          <Link to={`/account/orders`}>
            <ImageV2
              width={`24px`}
              src={`/static/icons/TrackOrder.svg`}
              className={s.trackOrderIcon}
            />
            {translate('track_my_order')}
            <ImageV2
              width={`14px`}
              src={`/static/icons/ArrowLink.svg`}
              className={s.arrowLink}
            />
          </Link>
        </div>
        <Row gutter={16}>
          <Col lg={6} sm={12}>
            <div className={s.accountContent}>
              <div className={s.header}>
                <div className={s.title}>{translate('personal_info')}</div>
                <div className={s.editBtn}>
                  <Link to="/account/profile">{translate('edit')}</Link>
                </div>
              </div>
              <div className={s.content}>
                <div className={s.contentRow}>
                  <div className={s.left}>{translate('name')}:</div>
                  <div className={s.right}>{firstName}</div>
                </div>
                <div className={s.contentRow}>
                  <div className={s.left}>{translate('last_name')}:</div>
                  <div className={s.right}>{lastName}</div>
                </div>
                <div className={s.contentRow}>
                  <div className={s.left}>{translate('email')}:</div>
                  <div className={s.right}>{email}</div>
                </div>
                <div className={s.contentRow}>
                  <div className={s.left}>{translate('phone')}</div>
                  <div className={s.right}>{phoneNumber}</div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6} sm={12}>
            <div className={s.accountT1Content}>
              <div className={s.header}>
                <div className={s.titleT1}>
                  <ImageV2 className={s.logoT1} src="/icons/t-1-c-logo.svg" />
                  <label className={s.labelT1}>{translate('the1_info')}</label>
                </div>
                {!isEmpty(t1Account) && (
                  <div className={s.disconnctBtn}>
                    <Link onClick={this.handleDisconnectT1}>
                      {translate('disconnect_t1')}
                    </Link>
                  </div>
                )}
              </div>
              <div className={s.content}>
                {!isEmpty(t1Account) ? (
                  <>
                    <div className={s.contentRow}>
                      <div className={s.left}>{translate('t1_no')}</div>
                      <div className={s.right}>{t1Account.card_no}</div>
                    </div>
                    <div className={s.contentRow}>
                      <div className={s.left}>{translate('points')}:</div>
                      <div className={s.right}>
                        <span>{translate('you_have')}</span>
                        <span className={s.pointsAmount}>
                          {translate('points_amount', {
                            points: (+t1Account.points).toLocaleString(
                              'en-US',
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              },
                            ),
                          })}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={s.contentRow}>
                    <div className={s.right}>
                      <span>{translate('connect_your_the1')}</span>
                      <Button
                        className={s.t1cConnect}
                        onClick={this.handleShowThe1AccountModal}
                      >
                        {translate('connect_t1_account')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col lg={6} sm={12}>
            {this.renderOverviewCard(
              defaultShipping,
              translate('default_shipping'),
            )}
          </Col>
          <Col lg={6} sm={12}>
            {this.renderOverviewCard(
              defaultBilling,
              translate('full_tax_invoice'),
            )}
          </Col>
        </Row>
        <Row>
          <Col lg={12} sm={12}>
            <div className={s.header}>
              <div className={s.title}>{translate('latest_order')}</div>
              <div className={cx(s.editBtn, s.gray, s.viewAllOrder)}>
                <Link to="/account/orders">{translate('view_all_order')}</Link>
              </div>
            </div>
            <OrderList order={orders?.[0] || []} loading={loading} />
          </Col>
        </Row>

        <The1AccountModal
          show={this.state.showThe1AccountModal}
          onSubmit
          onCloseClick={this.handleCloseThe1AccountModal}
        />
      </div>
    );
  }
}

export default AccountOverviewContainer;
