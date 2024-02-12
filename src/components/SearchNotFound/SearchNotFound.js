import React from 'react';
import pt from 'prop-types';
import styled from 'styled-components';
import {
  withLocales,
  withSuggestion,
  Link,
  Button,
} from '@central-tech/core-ui';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchNotFound.scss';
import ImageV2 from '../Image/ImageV2';
import { withStoreConfig } from '@central-tech/core-ui';

const CustomButtonStyled = styled(Button)`
  line-height: normal;
  margin-bottom: 55px;
  height: auto;
  padding: 18px 93px;
  ${props =>
    props.isMobile &&
    `
    width: 100%;
    padding: 12px 0 12px 0;
    font-size: 12px;
  `}
`;
@withStoreConfig
@withLocales
@withSuggestion
@withStyles(s)
class SearchNotFound extends React.PureComponent {
  static propTypes = {
    title: pt.string,
  };

  state = {
    value: this.props.title,
    trandingSearch: [],
  };

  async componentDidMount() {
    const { getTrendingSuggestions, title } = this.props;
    const encodeTitle = encodeURIComponent(title);

    window.history.replaceState(
      null,
      null,
      `${encodeTitle}?NotFound1=${encodeTitle}`,
    );
    await getTrendingSuggestions().then(result => {
      this.setState({
        trandingSearch: result?.length ? result.slice(0, 3) : [],
      });
    });
  }
  handleCloseClick = () => {
    this.setState({
      value: '',
    });
  };

  handleInputChange = e => {
    const { value } = e.target;
    this.setState({ value });
  };

  searchValue = () => {
    const keyword = this.state.value;
    if (!keyword) return;
    this.setState({ value: keyword });
  };

  renderSearchButton = () => (
    <Button
      className={s.button}
      onClick={this.searchValue}
      id="btn-searchNotFound"
    >
      {/*<Ionicon icon="ios-search" fontSize="22px" />*/}
      Ionicon
    </Button>
  );

  renderCancelButton = () => (
    <Button
      className={s.button}
      onClick={this.handleCloseClick}
      id="btn-removeSearchNotFound"
    >
      {/*<Ionicon icon="ios-close" fontSize="34px" />*/}
      Ionicon
    </Button>
  );

  render() {
    const { translate, title, isMobile } = this.props;
    const { trandingSearch } = this.state;
    const resultTrendingSearch = trandingSearch.map((keyword, index) => (
      <Link
        key={index + keyword.text}
        to={`/search/${encodeURIComponent(keyword.text)}`}
        className={s.linkTrending}
      >
        {keyword.text}
      </Link>
    ));
    const iconSize = isMobile
      ? {
          width: '55px',
          height: '55px',
        }
      : {
          width: '93px',
          height: '93px',
        };
    return (
      <React.Fragment>
        <div className={s.searchWrapper}>
          <ImageV2
            src="/static/icons/SearchNotFound.svg"
            {...iconSize}
            className={s.iconSearchNotFound}
          />
          {translate('search_not_found.message_not_match', { keyword: title })}
          <div className={s.suggestion}>
            {translate('search_not_found.message_sugeestion')}
          </div>
          <div className={s.breakBorder} />
          <p className={s.titleTrending}>
            {translate('search_not_found.message_trending_search')}
          </p>
          {resultTrendingSearch}
          <CustomButtonStyled
            color="#13283F"
            textColor="#ffffff"
            size={16}
            isMobile={isMobile}
            onClick={() => (window.location.href = '/')}
          >
            {translate('search_not_found.goto_homepage')}
          </CustomButtonStyled>
        </div>
      </React.Fragment>
    );
  }
}

export default SearchNotFound;
