import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import pt from 'prop-types';
import s from './Sticky.scss';

class Sticky extends React.PureComponent {
  stickyRef = React.createRef();
  targetPosition = 0;
  isMobile = false;
  previousScroll = 0;
  elementHeightTarget = 0;

  static propTypes = {
    otherTopHeightDesktopInClude: pt.number,
    otherTopHeightMobileInClude: pt.number,
    onStickyWorking: pt.func,
    backgroundColoBar: pt.string,
    className: pt.string,
  };

  static defaultProps = {
    otherTopHeightDesktopInClude: 0,
    otherTopHeightMobileInClude: 0,
    onStickyWorking: value => value,
    backgroundColoBar: '',
  };

  state = {
    isSticky: false,
  };

  componentDidMount() {
    this.isMobile = window.outerWidth <= 768;
    this.previousScroll = window.scrollTop;

    window.addEventListener('resize', this.updateWindowDimensions, false);
    window.addEventListener('scroll', this.onScrollSticky, false);
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.updateWindowDimensions, false);
    window.removeEventListener('scroll', this.onScrollSticky, false);
  }

  updateWindowDimensions = () => {
    this.isMobile = window.outerWidth <= 768;
  };

  onScrollSticky = e => {
    const {
      otherTopHeightDesktopInClude,
      otherTopHeightMobileInClude,
      onStickyWorking,
    } = this.props;
    const { isSticky } = this.state;

    this.targetPosition = this.stickyRef.current.offsetTop; // Get current target position
    const scrollEvent = e.target.scrollingElement; // Get currerScroll position
    const isScrollUp = this.previousScroll > scrollEvent.scrollTop; // Check currerScroll direction
    const isResultForCheckDelayHideTarget =
      this.previousScroll - scrollEvent.scrollTop; // get value space between scroll position & previous position for add more space to remove sticky when scroll Down.
    const otherHeight = this.isMobile
      ? otherTopHeightMobileInClude
      : otherTopHeightDesktopInClude;
    const lastKnownScrollPosition = scrollEvent.scrollTop + otherHeight; // Get position scroll plus height of other element.

    if (
      isScrollUp &&
      lastKnownScrollPosition > this.targetPosition &&
      !isSticky
    ) {
      this.elementHeightTarget = this.stickyRef.current.clientHeight;
      this.setState(
        {
          isSticky: true,
        },
        () => onStickyWorking(true),
      );
    } else if (
      (!isScrollUp && isResultForCheckDelayHideTarget <= -5) ||
      (lastKnownScrollPosition <= this.targetPosition && isSticky)
    ) {
      this.elementHeightTarget = 0;
      this.setState({ isSticky: false }, () => onStickyWorking());
    }

    this.previousScroll = scrollEvent.scrollTop;
  };

  render() {
    const {
      children,
      otherTopHeightDesktopInClude,
      otherTopHeightMobileInClude,
      backgroundColoBar,
      className,
    } = this.props;
    const { isSticky } = this.state;

    return (
      <div
        style={isSticky ? { height: this.elementHeightTarget } : {}}
        ref={this.stickyRef}
      >
        <div
          style={
            isSticky
              ? {
                  backgroundColor: backgroundColoBar,
                  position: 'fixed',
                  zIndex: 1,
                  top: this.isMobile
                    ? otherTopHeightMobileInClude
                    : otherTopHeightDesktopInClude,
                  right: 0,
                  left: 0,
                }
              : {}
          }
          className={className}
        >
          <div
            className={
              this.isMobile ? s.mobileHandleProps : s.desktopHandleProps
            }
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Sticky);
