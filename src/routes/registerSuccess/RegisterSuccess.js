import React from 'react';
import { compose } from 'redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import RegistrationSuccess from '../../components/RegistrationSuccess';
import s from './RegisterSuccess.scss';

class RegisterSuccess extends React.PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <RegistrationSuccess />
        </div>
      </div>
    );
  }
}

export default compose(withStyles(s))(RegisterSuccess);
