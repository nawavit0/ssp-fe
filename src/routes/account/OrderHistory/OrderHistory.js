import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { map, isEmpty, isUndefined } from 'lodash';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import t from './translation.json';
import s from './OrderHistory.scss';
import p from './Pagination.scss';
import { fetchOrderHistory } from '../../../reducers/order/actions';
import FullPageLoader from '../../../components/FullPageLoader';
import OrderList from '../../../components/Account/OrderList';
import OrderEmpty from '../../../components/Account/OrderEmpty';
import Input from '../../../components/Input';
import ReactPaginate from 'react-paginate';
import withRoutes from '../../../utils/decorators/withRoutes';
import ImageV2 from '../../../components/Image/ImageV2';

@withLocales(t)
@withStyles(s, p)
class OrderHistory extends React.PureComponent {
  state = {
    search: '',
    filters: {
      dateTo: '',
      dateFrom: '',
      sku: '',
    },
    startDate: '',
    endDate: '',
    pageSize: 5,
    page: 1,
  };

  componentDidMount() {
    let currentPage = this.state.page;
    if (!isUndefined(this.props.location.queryParams.page)) {
      currentPage = this.props.location.queryParams.page;
      this.setState({
        page: currentPage,
      });
    }

    this.props.fetchOrderHistory(
      currentPage,
      this.state.pageSize,
      this.state.filters,
    );
  }

  setQuery = query => {
    const { location } = this.props;
    location.push(location.pathname, {
      ...location.queryParams,
      ...query,
    });
  };

  handlePageChange = page => {
    const { selected } = page;
    const { fetchOrderHistory } = this.props;
    const { pageSize } = this.state;
    const currentPage = selected + 1;

    this.setQuery({ page: currentPage });
    this.setState({
      page: currentPage,
    });

    fetchOrderHistory(currentPage, pageSize, this.state.filters);
  };

  filterOrderChanged = () => {
    const { fetchOrderHistory } = this.props;
    const { search, startDate, endDate, pageSize } = this.state;

    this.setState(
      {
        page: 1,
        filters: {
          dateFrom: startDate
            ? moment(startDate).format('YYYY-MM-DD 00:00:01')
            : '',
          dateTo: startDate
            ? moment(endDate).format('YYYY-MM-DD 23:59:59')
            : '',
          incrementId: search,
        },
      },
      () => {
        this.setQuery({ page: 1 });
        fetchOrderHistory(1, pageSize, this.state.filters);
      },
    );
  };

  inputChanged(e) {
    const {
      target: { checked, value, type },
    } = e;
    const val = type === 'checkbox' ? checked : value;

    this.setState({ search: val });
  }

  handleChangeFromDate = date => {
    this.setState(
      {
        startDate: date,
      },
      () => {
        this.filterOrderChanged();
      },
    );
  };

  handleChangeToDate = date => {
    this.setState(
      {
        endDate: date,
      },
      () => {
        this.filterOrderChanged();
      },
    );
  };

  handleSubmit = event => {
    event.preventDefault();
    this.filterOrderChanged();
  };

  render() {
    const { translate, orderHistory, loading, total } = this.props;
    return (
      <div className={s.root}>
        <div className={s.OrderHeader}>
          <h3 className={s.OrderTitle}>{translate('title')}</h3>
        </div>
        <hr />
        <div className={s.filterWrapper}>
          <div className={s.searchWrapper}>
            <ImageV2
              className={s.iconSearch}
              src={`/static/icons/Searching.svg`}
              alt={`search`}
              width={`17px`}
            />
            <form onSubmit={this.handleSubmit} method="post">
              <Input
                wrapperClassName={s.searchOrderNo}
                type="text"
                name="orderNo"
                value={this.state.search}
                placeholder={translate('placeholder_search')}
                onChange={e => this.inputChanged(e)}
              />
            </form>
          </div>
          <div className={s.filterDateWrapper}>
            <label className={s.labelFilterDate}>
              {translate('filter_by_date')}
            </label>
            <div className={s.datepickerWrapper}>
              <ImageV2
                className={s.iconDatepicker}
                src={`/static/icons/DatePicker.svg`}
                alt={`datepicker`}
                width={`17px`}
              />
              <DatePicker
                className={s.fromDate}
                dateFormat="DD/MM/YYYY"
                placeholderText={translate('placeholder_from_date')}
                selected={this.state.startDate}
                onChange={this.handleChangeFromDate}
              />
            </div>
            <div className={s.datepickerWrapper}>
              <ImageV2
                className={s.iconDatepicker}
                src={`/static/icons/DatePicker.svg`}
                alt={`datepicker`}
                width={`17px`}
              />
              <DatePicker
                className={s.toDate}
                popperClassName={s.poperEndDateCalendar}
                popperPlacement="bottom-end"
                dateFormat="DD/MM/YYYY"
                placeholderText={translate('placeholder_to_date')}
                selected={this.state.endDate}
                onChange={this.handleChangeToDate}
              />
            </div>
          </div>
        </div>
        {loading && <FullPageLoader show={loading} />}
        {!isEmpty(orderHistory) &&
          map(orderHistory, val => {
            return <OrderList key={val.increment_id} order={val} />;
          })}

        <div>
          {total > 5 && (
            <ReactPaginate
              pageCount={total / 5} //The total number of pages total / limit per page
              initialPage={this.state.page - 1} //The initial page selected start with 0
              forceSelected={this.state.page - 1}
              pageRangeDisplayed={3} //The range of pages displayed
              marginPagesDisplayed={1} //The number of pages to display for margins.
              disableInitialCallback
              onPageChange={this.handlePageChange}
              breakLabel={<span className={p.paginationBreak}>...</span>}
              containerClassName={p.paginationWrap}
              breakClassName={p.paginationList}
              previousClassName={p.previousArrow}
              nextClassName={p.nextArrow}
              activeClassName={p.activePaginationNumber}
              previousLabel={`<`}
              nextLabel={`>`}
            />
          )}
        </div>

        {!loading && isEmpty(orderHistory) && <OrderEmpty />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accountInfo: state.account.accountInfo,
  customer: state.customer.customer,
  loading: state.order.loading,
  orderHistory: state.order.orderHistory,
  searchCriteria: state.order.searchCriteria,
  total: state.order.totalCount,
});

const matchDispatchToProps = dispatch => ({
  fetchOrderHistory: (page, limit, filters) =>
    dispatch(fetchOrderHistory(page, limit, filters)),
});

export default compose(
  withRoutes,
  connect(mapStateToProps, matchDispatchToProps),
)(OrderHistory);
