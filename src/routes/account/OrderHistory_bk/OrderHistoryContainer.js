import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import t from './translation.json';
import s from './OrderHistory.scss';
import p from './Pagination.scss';
import OrderList from '../../../components/Account/OrderList';
import Input from '../../../components/Input';
import ReactPaginate from 'react-paginate';
import ImageV2 from '../../../components/Image/ImageV2';

@withLocales(t)
@withStyles(s, p)
class OrderHistory extends React.PureComponent {
  handlePageChange = page => {
    const { searchFilter, setSearchFilter } = this.props;
    const { selected } = page;
    return setSearchFilter({ ...searchFilter, page: selected + 1 });
  };

  filterOrderChanged = (date, type) => {
    const { searchFilter, setSearchFilter } = this.props;
    if (type === 'to') {
      return setSearchFilter({
        ...searchFilter,
        page: 1,
        dateTo: searchFilter.startDate
          ? moment(date).format('YYYY-MM-DD 23:59:59')
          : '',
        endDate: date,
      });
    }
    return setSearchFilter({
      ...searchFilter,
      page: 1,
      dateFrom: date ? moment(date).format('YYYY-MM-DD 00:00:01') : '',
      startDate: date,
    });
  };

  inputChanged(e) {
    const {
      target: { checked, value, type },
    } = e;
    const { searchFilter, setSearchFilter } = this.props;
    const val = type === 'checkbox' ? checked : value;

    return setSearchFilter({
      ...searchFilter,
      page: 1,
      incrementId: val,
    });
  }

  handleChangeFromDate = date => {
    this.filterOrderChanged(date, 'from');
  };

  handleChangeToDate = date => {
    this.filterOrderChanged(date, 'to');
  };

  renderPagination() {
    const { total, searchFilter } = this.props;
    return (
      <div>
        <ReactPaginate
          pageCount={total / 5} //The total number of pages total / limit per page
          initialPage={searchFilter.page - 1} //The initial page selected start with 0
          forcePage={searchFilter.page - 1}
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
          previousLabel={'Ionicon'}
          nextLabel={'Ionicon'}
        />
      </div>
    );
  }

  render() {
    const { translate, loading, total, orders, searchFilter } = this.props;
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
            <Input
              wrapperClassName={s.searchOrderNo}
              type="text"
              name="orderNo"
              value={searchFilter.incrementId}
              placeholder={translate('placeholder_search')}
              onChange={e => this.inputChanged(e)}
            />
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
                selected={searchFilter.startDate}
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
                selected={searchFilter.endDate}
                onChange={this.handleChangeToDate}
              />
            </div>
          </div>
        </div>
        <OrderList orders={orders} loading={loading} />
        {total > 5 && this.renderPagination()}
      </div>
    );
  }
}

export default OrderHistory;
