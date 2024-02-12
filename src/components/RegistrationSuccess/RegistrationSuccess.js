import React from 'react';
import s from './RegistrationSuccess.scss';
import withLocales from '../../utils/decorators/withLocales';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ImageV2 from '../Image/Image';
import t from './translation';

class RegistrationSuccess extends React.PureComponent {
  static propTypes = {};

  componentDidMount() {
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  }

  render() {
    const { translate } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.lineWrapper}>
            <div className={s.icon}>
              <ImageV2
                src="/static/icons/Completed.svg"
                width="120"
                hegiht="120"
              />
            </div>
            <div className={s.titleWrapper}>
              <div className={s.title}>
                <span>{translate('title')}</span>
              </div>
              <div className={s.subTitle}>
                <span>{translate('subTitle')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withLocales(t)(withStyles(s)(RegistrationSuccess));
