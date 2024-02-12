import React from 'react';
import { compose } from 'redux';
import pt from 'prop-types';
import cx from 'classnames';
import s from './ToggleSwitch.scss'; // eslint-disable-line css-modules/no-unused-class
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import Switch from 'react-switch';
import t from './translation.json';

/**
 * default switch styles
 */
const options = {
  boxShadow: '0 1px 3px rgba(0,0,0,.4)',
  height: 24,
  width: 51,
  onColor: '#78e723',
  offColor: '#ffffff',
};

const ToggleSwitch = ({ checked, className, onChange, translate }) => {
  return (
    <Switch
      className={cx(s.root, className)}
      checked={checked}
      checkedIcon={<span className={s.checked}>{translate('yes')}</span>}
      uncheckedIcon={<span className={s.unchecked}>{translate('no')}</span>}
      onChange={onChange}
      {...options}
    />
  );
};

ToggleSwitch.propTypes = {
  checked: pt.bool,
  onChange: pt.func,
};

export default compose(withStyles(s), withLocales(t))(ToggleSwitch);
