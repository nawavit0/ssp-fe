import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Checkbox.scss';
import checkboxImg from '../../../public/images/checkbox@3x.png';

class InputCheckbox extends React.PureComponent {
  static propTypes = {
    input: pt.object.required,
    required: pt.bool,
    label: pt.string,
    className: pt.string,
  };

  static defaultProps = {
    required: false,
    label: '',
    className: '',
  };
  render() {
    const { label, input, required, className } = this.props;
    return (
      <label className={cx(className, s.checkboxPart)}>
        <input type="checkbox" name={name} required={required} {...input} />
        <div className={s.checkboxOnShape}>
          {input.value ? <img src={checkboxImg} /> : <span />}
        </div>
        {label}
      </label>
    );
  }
}

export default withStyles(s)(InputCheckbox);
