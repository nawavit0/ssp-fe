import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import s from './GuestOrderCompleteRegister.scss';
import t from './translation.json';
import GuestRegisterForm from '../../../components/GuestForm/GuestRegisterForm';
import Button from '../../../components/Button';

const GuestOrderCompleteRegister = ({
  translate,
  firstname,
  lastname,
  email,
  onSubmit,
  errorMsg,
}) => (
  <div className={s.root}>
    <div className={s.header}>
      <h3 className={s.title}>{translate('create_account_title')}</h3>
      <p className={s.desc}>{translate('create_account_description')}</p>
    </div>
    <div className={s.content}>
      <GuestRegisterForm
        firstname={firstname}
        lastname={lastname}
        email={email}
      />
      <div className={s.errorMsg}>{errorMsg && translate(errorMsg)}</div>
      <Button className={s.submitBtn} onClick={onSubmit}>
        {translate('register')}
      </Button>
    </div>
  </div>
);

export default withLocales(t)(withStyles(s)(GuestOrderCompleteRegister));
