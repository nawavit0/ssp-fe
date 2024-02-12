import React from 'react';
import pt from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DeliveryOption.scss';
import cx from 'classnames';
export class DeliveryOption extends React.PureComponent {
  static propTypes = {
    id: pt.string,
    fee: pt.string,
    hint: pt.string,
    icon: pt.string,
    title: pt.string,
    onClick: pt.func,
    selected: pt.bool,
    elementRef: pt.any,
  };

  static defaultProps = {
    id: null,
  };

  render() {
    const {
      id,
      children,
      fee,
      hint,
      icon,
      title,
      selected,
      elementRef,
      iconFullpath,
    } = this.props;
    const contentClass = selected ? cx(s.content, s.selected) : s.content;

    return (
      <div className={s.accordion} ref={elementRef}>
        <div id={id} className={s.header} onClick={this.props.onClick}>
          <div className={s.icon}>
            {(icon || iconFullpath) && (
              <img
                src={iconFullpath ? iconFullpath : `/icons/${icon}`}
                alt="delivery"
              />
            )}
          </div>
          <div className={s.radioBox}>
            <input
              name="delivery-option"
              readOnly
              type="radio"
              checked={selected}
            />
          </div>
          <div className={s.labelBox}>
            <label>{title}</label>
            <span className={s.hint}>{hint}</span>
            <span className={s.feeLabel}>{fee}</span>
          </div>
          <div className={s.fee}>
            <span>{fee}</span>
          </div>
        </div>
        <div className={contentClass}>{children}</div>
      </div>
    );
  }
}

export default withStyles(s)(DeliveryOption);
