import React from 'react';
import cx from 'classnames';
import { isEmpty, map, concat, compact, range } from 'lodash';
import { compose } from 'redux';
import t from './translation.json';
import s from './AlphabeticBrandsIndexDesktop.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import Row from '../../components/Row';
import Col from '../../components/Col';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Container from '../../components/Container';
import Sticky from '../../components/Sticky';
import { Link } from '@central-tech/core-ui';
import { Cms } from '../../components/CMSGrapesjsView';

class AlphabeticBrandsIndex extends React.PureComponent {
  state = {
    brandList: [],
    brandLetters: [],
    brandsCollectionsByLetters: {},
    activeLetter: null,
  };

  getBreadcrumbs = () => [
    {
      name: this.props.translate('brands'),
      url_path: '/brands',
    },
  ];

  mutateBrandList = () => {
    const { brandList } = this.props;
    const { brandsCollectionsByLetters, activeLetter } = this.state;
    if (
      brandList &&
      isEmpty(brandsCollectionsByLetters) &&
      !isEmpty(brandList)
    ) {
      const sortBrandLetters = this.parseBrandsAndExtractFirstLetter(
        brandList.characters,
      );
      let character = compact(
        map(sortBrandLetters, alphabet => {
          if (!Number(alphabet)) return alphabet;
        }),
      );
      if (character.length !== sortBrandLetters.length) {
        character = concat(character, '0-9');
      }
      this.setState({
        brandList,
        brandLetters: character,
        activeLetter: !isEmpty(activeLetter)
          ? activeLetter
          : this.props.translate('all'),
        brandsCollectionsByLetters: brandList.groups,
      });
    }
  };
  componentDidMount() {
    this.mutateBrandList();
  }
  componentDidUpdate() {
    const { brandList } = this.props;
    if (brandList !== this.state.brandList) {
      this.mutateBrandList();
    }
  }
  parseBrandsAndExtractFirstLetter(brandLetters) {
    return concat([this.props.translate('all')], brandLetters.sort());
  }

  handleLetterClick(letter) {
    const scrollToComponent = require('react-scroll-to-component');
    const { brandList } = this.props;
    let arrayNumber = [];
    for (let i = 0; i < 10; i++) {
      if (!isEmpty(brandList.groups[i])) {
        arrayNumber = {
          ...arrayNumber,
          [i]: brandList.groups[i],
        };
      }
    }
    if (letter === '0-9') {
      this.setState({
        activeLetter: letter,
        brandsCollectionsByLetters:
          letter !== this.props.translate('all')
            ? arrayNumber
            : brandList.groups,
      });
    } else {
      this.setState({
        activeLetter: letter,
        brandsCollectionsByLetters:
          letter !== this.props.translate('all')
            ? brandList.groups[letter]
            : brandList.groups,
      });
    }

    scrollToComponent(this[letter], {
      offset: -100,
      align: 'top',
      duration: 1500,
    });
  }

  renderLetters() {
    const { brandLetters, activeLetter, isStickyWorking } = this.state;
    const { translate } = this.props;
    return (
      <Sticky
        otherTopHeightDesktopInClude={73}
        backgroundColoBar={'#ffffff'}
        className={isStickyWorking ? s.handleStickyProps : ''}
        onStickyWorking={this.onStickyWorking}
      >
        <ul className={s.letters}>
          {brandLetters && brandLetters.length
            ? brandLetters.map(letter => {
                return (
                  <li
                    key={letter}
                    onClick={() => this.handleLetterClick(letter)}
                    data-active={activeLetter === letter}
                  >
                    {letter}
                  </li>
                );
              })
            : translate('wait_to_loading_brands')}
        </ul>
      </Sticky>
    );
  }

  handleLetterSelect = event => {
    window.scrollTo(0, 0);
    this.handleLetterClick(event.target.value);
  };

  onStickyWorking = value => this.setState({ isStickyWorking: value });

  renderMobileSelectClick() {
    const { brandLetters, isStickyWorking } = this.state;
    return (
      <Sticky
        otherTopHeightMobileInClude={60}
        backgroundColoBar={'#ffffff'}
        className={isStickyWorking ? s.handleStickyProps : ''}
        onStickyWorking={this.onStickyWorking}
      >
        <select onChange={this.handleLetterSelect}>
          <option value="" selected disabled>
            {this.props.translate('all_brand')}
          </option>
          {brandLetters.map(letter => {
            return (
              <option key={letter} value={letter}>
                {letter}
              </option>
            );
          })}
        </select>
      </Sticky>
    );
  }

  renderBrandsCollectionsByLetters() {
    const {
      activeLetter,
      brandLetters,
      brandsCollectionsByLetters,
    } = this.state;
    const { translate } = this.props;

    if (activeLetter !== translate('all')) {
      if (activeLetter !== '0-9') {
        return (
          !isEmpty(brandsCollectionsByLetters) && (
            <section key={activeLetter}>
              <h2 className={s.letterIndicator} data-active>
                {activeLetter}
              </h2>
              <Row>
                {map(brandsCollectionsByLetters, (brandSort, index) => (
                  <Col lg={3} md={6} key={index} className={s.paddingList}>
                    <Link
                      to={`/${brandSort.url_key}`}
                      key={brandSort.brand_id}
                      native
                    >
                      {brandSort.name}
                    </Link>
                  </Col>
                ))}
              </Row>
            </section>
          )
        );
      }
      return (
        !isEmpty(brandsCollectionsByLetters) && (
          <section key={activeLetter}>
            <h2 className={s.letterIndicator} data-active>
              {activeLetter}
            </h2>
            <Row>
              {map(brandsCollectionsByLetters, brand09 => (
                <React.Fragment>
                  {map(brand09, (brandarr, indexr) => (
                    <Col lg={3} md={6} key={indexr} className={s.paddingList}>
                      <Link
                        to={`/${brandarr.url_key}`}
                        key={brandarr.brand_id}
                        native
                      >
                        {brandarr.name}
                      </Link>
                    </Col>
                  ))}
                </React.Fragment>
              ))}
            </Row>
          </section>
        )
      );
    }

    if (!isEmpty(brandsCollectionsByLetters)) {
      return map(
        brandLetters,
        letter =>
          letter !== translate('all') && (
            <section key={letter}>
              <h2 className={s.letterIndicator} data-active>
                {letter}
              </h2>
              {letter !== '0-9' ? (
                <Row>
                  {brandsCollectionsByLetters[letter].map((brandAll, index) => (
                    <Col lg={3} md={6} className={s.paddingList} key={index}>
                      <Link
                        to={`/${brandAll.url_key}`}
                        key={brandAll.brand_id}
                        native
                      >
                        <h3>{brandAll.name}</h3>
                      </Link>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Row>
                  {map(range(0, 10), val => {
                    return (
                      brandsCollectionsByLetters &&
                      brandsCollectionsByLetters[val] &&
                      brandsCollectionsByLetters[val].map((brandAll, index) => (
                        <Col
                          lg={3}
                          md={6}
                          className={s.paddingList}
                          key={index}
                        >
                          <Link
                            to={`/${brandAll.url_key}`}
                            key={brandAll.brand_id}
                            native
                          >
                            <h3>{brandAll.name}</h3>
                          </Link>
                        </Col>
                      ))
                    );
                  })}
                </Row>
              )}
            </section>
          ),
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Breadcrumbs
            breadcrumbsData={this.getBreadcrumbs()}
            marginBottom={false}
          />
        </Container>
        <div className={s.root}>
          <Cms identifier="ALL_BRAND_BANNER" ssr />
          <div className={s.container}>
            <div className={cx(s.fix)}>
              <div className={s.desktop}>{this.renderLetters()}</div>
              <div className={s.mobile}>{this.renderMobileSelectClick()}</div>
            </div>
            <div className={s.alphabeticBrandsListWrap}>
              <React.Fragment>
                {this.renderBrandsCollectionsByLetters()}
              </React.Fragment>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default compose(withStyles(s), withLocales(t))(AlphabeticBrandsIndex);
