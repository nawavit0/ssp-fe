import React from 'react';
import cx from 'classnames';
import s from './Popup.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { get as prop, isUndefined } from 'lodash';
import { setCookie, getCookie } from '../../utils/cookie';
import { compose } from 'redux';
// import Ionicon from 'react-ionicons';
import { CmsSearchBlockWidget, withStoreConfig } from '@central-tech/core-ui';

@withStoreConfig
class Popup extends React.PureComponent {
  state = {
    hidePopup: false,
  };

  closePopup = name => {
    setCookie(name, name, 1);
    this.setState({ hidePopup: name });
  };

  popupGenerator = (name, index) => {
    const { hidePopup } = this.state;
    const { activeConfig } = this.props;
    return (
      <CmsSearchBlockWidget
        identifier={name}
        ssr={false}
        storeId={prop(activeConfig, 'id')}
        key={index}
        skip={!isUndefined(getCookie(name))}
      >
        {({ data }) => {
          const blockContent = prop(data, 'cmsBlocks[0].content', '');

          if (blockContent) {
            return (
              <div
                key={index}
                className={cx(
                  { [s.popoverHover]: name === 'global_popover' },
                  { [s.hide]: hidePopup === name },
                )}
              >
                <div
                  className={cx(
                    { [s.popoverContainer]: name === 'global_popover' },
                    {
                      [s.notificationConainer]: name === 'global_notification',
                    },
                  )}
                >
                  <div
                    id="btn-popup-close"
                    className={s.close}
                    onClick={() => this.closePopup(name)}
                  >
                    {/*<Ionicon*/}
                    {/*  fontSize="30px" //{name === 'global_popover' ? '50px' : '30px'}*/}
                    {/*  icon="ios-close"*/}
                    {/*/>*/}
                    Ionicon
                  </div>

                  <div
                    className={s.popoverMessage}
                    dangerouslySetInnerHTML={{
                      __html: blockContent,
                    }}
                  />
                </div>
              </div>
            );
          }

          return <React.Fragment />;
        }}
      </CmsSearchBlockWidget>
    );
  };

  render() {
    const popupNames = ['global_popover', 'global_notification'];
    return (
      <div className={s.root}>
        {popupNames.map((name, index) => {
          if (isUndefined(getCookie(name))) {
            return this.popupGenerator(name, index);
          }
        })}
      </div>
    );
  }
}

export default compose(withStyles(s))(Popup);
