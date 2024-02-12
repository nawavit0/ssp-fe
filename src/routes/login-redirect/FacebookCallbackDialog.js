import React from 'react';
import { compose } from 'redux';
import { unsetCookie } from '../../utils/cookie';
import withLocales from '../../utils/decorators/withLocales';
import t from './translation.json';

const redirectToHome = () => {
  const parent = window.opener;
  unsetCookie('lang');
  // check is opened in popup
  if (parent && parent.location.hostname === window.location.hostname) {
    try {
      parent.location.reload(true);
      window.close();
    } catch (e) {
      document.location.href = '/';
    }
  } else {
    document.location.href = '/';
  }
};

const dialog = props => {
  const { translate } = props;
  if (process.env.BROWSER) {
    setTimeout(redirectToHome, 800); // TODO: configured timeout?
  }
  return <p>{translate('logging_in')}</p>;
};

export default compose(withLocales(t))(dialog);
