import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { noop } from 'lodash';
import Container from '../Container';
import s from './ElementWithPopupMenu.scss';

const TIMEOUT = 300;

@withStyles(s)
class ElementWithPopupMenu extends React.PureComponent {
  static propTypes = {
    id: pt.string,
    popupMenu: pt.node.isRequired,
    element: pt.node.isRequired,
    fullScreen: pt.bool,
    wrapperClassName: pt.string,
    className: pt.string,
    onMouseEnter: pt.func,
    onMouseLeave: pt.func,
    timeout: pt.number,
    closeOnClick: pt.bool,
    eventType: pt.string,
    arrow: pt.bool,
    close: pt.bool, // pass true if you want to close menu immediately
    top: pt.string,
    closeOnLeave: pt.bool,
    showMenu: pt.bool,
    showOnHover: pt.bool,
    onMenuActive: pt.func,
    isBaseWidth: pt.bool,
    onHoverMenuActive: pt.func,
    isHoverMenuActive: pt.bool,
  };

  static defaultProps = {
    id: '',
    fullScreen: true,
    onMouseEnter: noop,
    onMouseLeave: noop,
    timeout: TIMEOUT,
    closeOnClick: false,
    eventType: 'hover',
    arrow: true,
    top: '72',
    closeOnLeave: true,
    showOnHover: true,
    onMenuActive: noop,
    isBaseWidth: true,
    onHoverMenuActive: () => {},
    isHoverMenuActive: false,
  };

  node = null;

  state = {
    showMenu: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.close && !this.props.close) {
      this.setState({ showMenu: false });
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  componentDidUpdate(prevProps) {
    /* CASE: Click Menu will close,when Other menu is actived */
    if (
      prevProps.isHoverMenuActive !== this.props.isHoverMenuActive &&
      this.props.isHoverMenuActive
    ) {
      this.setState({ showMenu: false });
    }
  }

  setMenu = () => {
    this.timeoutId = setTimeout(() => {
      this.props.onMenuActive(true);
      this.props.onMouseEnter();
      this.setState({ showMenu: true }, () =>
        this.props.onHoverMenuActive(true),
      );
    }, this.props.timeout);
  };

  unsetMenu = () => {
    this.timeoutId = setTimeout(() => {
      this.props.onMenuActive(false);
      this.setState({ showMenu: false }, () => this.props.onHoverMenuActive());
      this.props.onMouseLeave();
    }, this.props.timeout);
  };

  handleElementMouseEnter = () => {
    clearTimeout(this.timeoutId);

    if (!this.state.showMenu && this.props.eventType === 'hover') {
      this.setMenu();
    }
  };

  handleElementMouseLeave = () => {
    clearTimeout(this.timeoutId);
    if (this.state.showMenu) {
      this.unsetMenu();
    }
  };

  handleMenuMouseEnter = () => clearTimeout(this.timeoutId);

  handleMenuMouseLeave = () => this.unsetMenu();

  handleOnClick = () => {
    if (this.props.closeOnClick) {
      this.handleMenuMouseLeave;
    }

    if (this.props.eventType === 'click') {
      this.props.onMenuActive(true);
      if (this.state.showMenu) {
        this.setState({ showMenu: false });
      } else {
        this.setState({ showMenu: true });
      }
    }
  };

  handleClick = e => {
    if (this.node.contains(e.target)) {
      return;
    }

    if (this.state.showMenu) {
      this.unsetMenu();
    }
  };

  render() {
    const {
      id,
      popupMenu,
      element,
      fullScreen,
      wrapperClassName,
      className,
      closeOnClick,
      arrow,
      top,
      arrowClassName,
      closeOnLeave,
      showOnHover,
      isBaseWidth,
    } = this.props;

    const showMenu = showOnHover ? this.state.showMenu : this.props.showMenu;

    return (
      <div id={id} ref={node => (this.node = node)}>
        <div
          onMouseEnter={this.handleElementMouseEnter}
          onMouseLeave={closeOnLeave ? this.handleElementMouseLeave : null}
          onClick={this.handleOnClick}
        >
          {element}
        </div>
        {showMenu && (
          <React.Fragment>
            {arrow && (
              <div
                className={cx(s.popupMenuWrapper, {
                  [s.active]: showMenu,
                })}
              >
                <div className={cx(s.triangleWithShadow, arrowClassName)} />
              </div>
            )}
            <div
              style={{ top: `${top}px` }}
              className={cx(s.containerWrapper, {
                [s.notFullScreen]: !fullScreen,
                [s.active]: showMenu,
              })}
            >
              <Container
                padding="none"
                wrapperClassName={wrapperClassName}
                className={cx(s.container, className)}
                fullScreen={fullScreen}
                onMouseEnter={this.handleMenuMouseEnter}
                onMouseLeave={closeOnLeave ? this.handleMenuMouseLeave : null}
                onClick={closeOnClick ? this.handleMenuMouseLeave : null}
                isBaseWidth={isBaseWidth}
              >
                {popupMenu}
              </Container>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default ElementWithPopupMenu;
