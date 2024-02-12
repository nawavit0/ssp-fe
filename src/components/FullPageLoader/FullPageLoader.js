import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import pt from 'prop-types';
import s from './FullPageLoader.scss';

@withStyles(s)
class FullPageLoader extends React.PureComponent {
  static propTypes = {
    show: pt.bool,
  };

  static defaultProps = {
    show: false,
  };

  render() {
    const { show } = this.props;
    return (
      show && (
        <div id="full-page-loader" className={s.root}>
          <div className={s.background}>
            <div className={s.ldsFlickrBox} style={{ position: 'absolute' }}>
              <div className={s.ldsFlickr}>
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
}

export default FullPageLoader;
