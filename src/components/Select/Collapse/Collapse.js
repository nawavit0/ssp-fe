import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import Image from '../../Image';
import s from './Collapse.scss';
import t from './translation.json';

const HEIGHT_TO_SHOW_LESS = 234;

class Collapse extends React.PureComponent {
  static propTypes = {
    wrapperClassName: pt.string,
    className: pt.string,
    titleClassName: pt.string,
    title: pt.string,
    children: pt.node,
    buttonContent: pt.node,
    onButtonClick: pt.func,
    openedByDefault: pt.bool,
  };

  static defaultProps = {
    openedByDefault: true,
  };

  state = {
    open: this.props.openedByDefault,
    showLess: false,
  };

  componentDidMount() {
    this.setChildrenHeight();
  }

  componentDidUpdate() {
    this.setChildrenHeight();
  }

  setChildrenHeight = () => {
    if (this.children) {
      this.setState({
        childrenHeight: this.children.getBoundingClientRect().height,
      });
    }
  };

  handlePanelClick = () => this.setState({ open: !this.state.open });

  handleButtonClick = event => {
    event.stopPropagation();
    this.props.onButtonClick && this.props.onButtonClick();
  };

  render() {
    const {
      wrapperClassName,
      className,
      titleClassName,
      title,
      children,
      buttonContent,
      translate,
    } = this.props;
    const { open, showLess, childrenHeight } = this.state;

    return (
      <div className={wrapperClassName}>
        <div
          className={cx(s.panel, className)}
          data-anchor="collapse-panel"
          onClick={this.handlePanelClick}
        >
          <div className={titleClassName}>{title}</div>
          <div className={s.controls}>
            {buttonContent && (
              <span className={s.button} onClick={this.handleButtonClick}>
                {buttonContent}
              </span>
            )}
            <Image
              className={cx({ [s.hide]: !open })}
              src="/icons/arrow-up.svg"
              width="20"
              height="20"
            />
            <Image
              className={cx({ [s.hide]: open })}
              src="/icons/arrow-down.svg"
              width="20"
              height="20"
            />
          </div>
        </div>
        {open && (
          <div
            className={cx(s.childrenWrapper, { [s.less]: showLess })}
            ref={children => (this.children = children)}
          >
            {children}
          </div>
        )}
        {open &&
          !showLess &&
          childrenHeight > HEIGHT_TO_SHOW_LESS && (
            <div
              className={s.showLess}
              onClick={() => this.setState({ showLess: true })}
            >
              {translate('show_less')}
            </div>
          )}
      </div>
    );
  }
}

export default compose(
  withLocales(t),
  withStyles(s),
)(Collapse);
