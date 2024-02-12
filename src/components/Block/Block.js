import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import s from './Block.scss';

class Block extends React.PureComponent {
  static propTypes = {
    rootClassName: pt.string,
    className: pt.string,
    clearMargin: pt.bool,
    title: pt.string,
    titleClassName: pt.string,
    children: pt.node, // you can pass just one of: children, items, products, promotions, news
    metaTagH1: pt.bool,
    metaTagH2: pt.bool,
  };

  static defaultProps = {
    children: null,
    clearMargin: false,
  };

  render() {
    const {
      rootClassName,
      className,
      clearMargin,
      title,
      children,
      titleClassName,
      metaTagH1,
      metaTagH2,
    } = this.props;

    if (isEmpty(title))
      return <div className={cx(s.root, className)}>{children}</div>;

    return (
      <div className={cx(s.root, rootClassName)}>
        <div className={s.header}>
          <div
            className={cx(s.title, titleClassName, {
              [s.clearMargin]: clearMargin,
            })}
          >
            <div className={s.borderLines}>
              {metaTagH1 ? (
                <h1 className={s.title}>{title}</h1>
              ) : (
                <React.Fragment>
                  {metaTagH2 ? (
                    <h2 className={s.title}>{title}</h2>
                  ) : (
                    <span className={className}>{title}</span>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

export default withLocales(withStyles(s)(Block));
