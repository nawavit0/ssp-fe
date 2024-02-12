import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import onClickOutside from 'react-onclickoutside';
import { map, find, get as prop, isEqual } from 'lodash';
import keyCodes from '../../../constants/keyCodes';
import Image from '../../Image';
import s from './SelectDefault.scss';

class SelectDefault extends React.PureComponent {
  static propTypes = {
    options: pt.array.isRequired, // [{ key: '', value: '' }]
    onChange: pt.func.isRequired,
    value: pt.any,
    placeholder: pt.string,
    height: pt.oneOf(['custom', 'small', 'medium', 'large']), // use 'custom' to avoid default value 'medium'
    borderRadius: pt.oneOf(['small', 'medium']),
    className: pt.string,
    rowClassName: pt.string,
    panelClassName: pt.string,
    optionsClassName: pt.string,
    optionClassName: pt.string,
    filledArrow: pt.bool,
    id: pt.string,
    showActiveOption: pt.bool,
    isDisable: pt.bool,
    isCheckQtyItem: pt.bool,
  };

  static defaultProps = {
    height: 'large',
    filledArrow: false,
    showActiveOption: false,
    isDisable: false,
    isCheckQtyItem: false,
  };

  optionRefs = {};

  preventOpeningOnFocus = false;

  state = {
    open: false,
  };

  // UNSAFE_componentWillMount() {
  //   this.setSelectedOption();
  // }

  componentDidMount() {
    this.setSelectedOption();
    this.scrollToOption();
  }

  componentDidUpdate(prevProps) {
    // console.log('set selected', this.props.options);
    // console.log('props', this.props);
    if (
      prevProps.value !== this.props.value ||
      !isEqual(prevProps.options, this.props.options)
    ) {
      this.setSelectedOption(this.props);
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (
  //     nextProps.value !== this.props.value ||
  //     !isEqual(nextProps.options, this.props.options)
  //   ) {
  //     this.setSelectedOption(nextProps);
  //   }
  // }

  setSelectedOption = (props = this.props) => {
    return this.setState({
      selectedOption: find(props.options, o => o.key === props.value),
    });
  };
  open = () => {
    this.setState({ open: true });
    this.optionWhenOpened = this.state.selectedOption;
  };

  getIndex = () =>
    this.state.selectedOption
      ? this.props.options.findIndex(
          o => o.key === this.state.selectedOption.key,
        )
      : -1;

  scrollToOption = (key = prop(this.state.selectedOption, 'key')) => {
    if (key) {
      this.options.scrollTop = this.optionRefs[key].offsetTop;
    }
  };

  alignOption = key => {
    const { scrollTop } = this.options;
    const { offsetTop } = this.optionRefs[key];
    if (offsetTop < scrollTop) {
      this.options.scrollTop = offsetTop;
      return;
    }

    const optionsHeight = this.options.getBoundingClientRect().height;
    const optionHeight = this.optionRefs[key].getBoundingClientRect().height;
    if (offsetTop > scrollTop + optionsHeight - optionHeight) {
      this.options.scrollTop = offsetTop - optionsHeight + optionHeight + 1;
    }
  };

  selectPrev = () => {
    const index = this.getIndex();
    if (index > 0) {
      const option = this.props.options[index - 1];
      this.setState({ selectedOption: option });
      this.alignOption(option.key);
    }
  };

  selectNext = () => {
    const index = this.getIndex();
    if (index < this.props.options.length - 1) {
      const option = this.props.options[index + 1];
      this.setState({ selectedOption: option });
      this.alignOption(option.key);
    }
  };

  select = (option = this.state.selectedOption) => {
    this.setState({ selectedOption: option, open: false });

    if (prop(option, 'key') !== prop(this.optionWhenOpened, 'key')) {
      option && this.props.onChange && this.props.onChange(option);
    }
  };

  handleClickOutside = () => {
    if (this.state.open) {
      this.select();
    }
  };

  handlePanelClick = () => {
    if (this.state.open) {
      this.select();
    } else {
      this.open();
      // this.input.focus();
    }
  };

  handleOptionClick = option => {
    this.select(option);
    // this.preventOpeningOnFocus = true;
    // this.input.focus();
  };

  handleInputFocus = () => {
    if (this.preventOpeningOnFocus) {
      return (this.preventOpeningOnFocus = false);
    }
    this.open();
  };

  handleKeyDown = event => {
    const { keyCode } = event;

    if (keyCode === keyCodes.ENTER || keyCode === keyCodes.SPACE) {
      if (this.state.open) {
        this.select();
      } else {
        this.open();
      }
    } else if (keyCode === keyCodes.TAB || keyCode === keyCodes.ESCAPE) {
      this.select();
    } else if (keyCode === keyCodes.UP) {
      if (this.state.open) {
        this.selectPrev();
      } else {
        this.open();
      }
    } else if (keyCode === keyCodes.DOWN) {
      if (this.state.open) {
        this.selectNext();
      } else {
        this.open();
      }
    }
  };

  renderPanel() {
    const {
      placeholder,
      height,
      borderRadius,
      panelClassName,
      rowClassName,
      filledArrow,
      showActiveOption,
      id,
      isCheckQtyItem,
    } = this.props;
    const { open, selectedOption } = this.state;

    return (
      <div
        className={cx(
          s.panel,
          s.row,
          s[height],
          s[`border-radius-${borderRadius}`],
          panelClassName,
          rowClassName,
          {
            [s.open]: open,
          },
        )}
        id={id}
        onClick={!this.props.isDisable && this.handlePanelClick}
      >
        {selectedOption ? (
          <div className={s.text}>
            <span>{selectedOption.custom}</span>
            <span
              className={cx({
                [s.isOutStock]:
                  selectedOption.label &&
                  selectedOption.isOutOfStock &&
                  isCheckQtyItem,
              })}
            >
              {/*{selectedOption.label || selectedOption.value}*/}
              {selectedOption.value}
            </span>
          </div>
        ) : (showActiveOption && this.props.value > 10) ||
          this.props.isDisable ? (
          <div className={s.text}>
            <span>{this.props.value}</span>
          </div>
        ) : (
          <div className={s.text}>{placeholder}</div>
        )}
        <Image
          className={s.arrow}
          src={`/icons/${filledArrow ? 'android-arrow-drop' : 'arrow-'}${
            open ? 'up' : 'down'
          }.svg`}
        />
      </div>
    );
  }

  renderOptions() {
    const {
      options,
      height,
      borderRadius,
      optionsClassName,
      rowClassName,
      optionClassName,
      showActiveOption,
      isCheckQtyItem,
    } = this.props;
    const { open, selectedOption } = this.state;

    return (
      <div
        className={cx(s.optionsWrapper, {
          [s.open]: open,
        })}
      >
        <div
          ref={options => (this.options = options)}
          className={cx(
            s.options,
            optionsClassName,
            s[height],
            s[`border-radius-${borderRadius}`],
          )}
        >
          {map(options, option => {
            // let productdetailQty = 0;
            // if (option.productdetail && option.productdetail.length > 0) {
            //   productdetailQty = prop(
            //     option.productdetail[0],
            //     'extension_attributes.stock_item.qty',
            //     0,
            //   );
            // }
            // option.isOutOfStock = !!productdetailQty;

            const isOutStock = option.emergencyOutOfStock;
            option.isOutOfStock = isOutStock;

            return (
              <div
                key={option.key}
                ref={el => (this.optionRefs[option.key] = el)}
                className={cx(
                  s.option,
                  s.row,
                  s[height],
                  rowClassName,
                  optionClassName,
                  {
                    [s.active]: option.key === prop(selectedOption, 'key'),
                  },
                )}
                onClick={() => this.handleOptionClick(option)}
              >
                <div className={s.text}>
                  <span>{option.custom}</span>
                  <span
                    className={cx({
                      [s.isOutStock]:
                        option.label && isOutStock && isCheckQtyItem,
                    })}
                  >
                    {option.label || option.value}
                  </span>
                </div>
              </div>
            );
          })}
          {showActiveOption && this.props.value > 10 && (
            <div
              key={this.props.value}
              ref={el => (this.optionRefs[this.props.value] = el)}
              className={cx(
                s.option,
                s.row,
                s[height],
                rowClassName,
                optionClassName,
                {
                  [s.active]: this.props.value > 10,
                },
              )}
            >
              <div className={s.text}>
                <span>{this.props.value}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  render = () => (
    <div className={cx(s.root, this.props.className)}>
      <input
        ref={input => (this.input = input)}
        className={s.hiddenInput}
        onFocus={this.handleInputFocus}
        onBlur={this.handleInputBlur}
        onKeyDown={this.handleKeyDown}
      />
      {this.renderPanel()}
      {this.renderOptions()}
    </div>
  );
}

export default withStyles(s)(onClickOutside(SelectDefault));
