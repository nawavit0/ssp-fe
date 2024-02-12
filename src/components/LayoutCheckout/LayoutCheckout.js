import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import normalizeCss from 'normalize.css';
import s from './LayoutCheckout.scss';
import HeaderCheckout from '../HeaderCheckout';

@withStyles(normalizeCss, s)
class LayoutCheckout extends React.PureComponent {
  static propTypes = {
    children: pt.node.isRequired,
  };

  static defaultProps = {};

  state = {
    isHeaderFixed: false,
  };

  render() {
    return (
      <div id="layout-checkout">
        <HeaderCheckout />
        <div
          className={cx(s.contentWrapper, {
            [s.margin]: this.state.isHeaderFixed,
          })}
        >
          {this.props.children}
        </div>
        <div className={s.desktop}>{/*<Footer />*/}</div>
      </div>
    );
  }
}

export default LayoutCheckout;
