import React from 'react';
import {
  get as prop,
  template,
  templateSettings,
  merge,
  isEmpty,
  cloneDeep,
} from 'lodash';
import { connect } from 'react-redux';

const wrapComponent = (WrappedComponent, componentTranslation = {}) => {
  class LocalizedComponent extends React.PureComponent {
    translate = (key, data) => {
      const commonTranslation = merge(
        cloneDeep(this.props.translation),
        componentTranslation,
      );

      const translationValue = prop(
        commonTranslation,
        `${this.props.lang}.${key}`,
      );

      if (!translationValue) {
        return `Wrong translation key: ${key}`;
      }

      if (isEmpty(data)) {
        return translationValue;
      }

      templateSettings.interpolate = /{([\s\S]+?)}/g;
      const compiled = template(translationValue);
      return compiled(data);
    };

    render() {
      const { children, ...props } = this.props;

      return (
        <WrappedComponent {...props} translate={this.translate}>
          {children}
        </WrappedComponent>
      );
    }
  }

  return connect(mapStateToProps)(LocalizedComponent);
};

// you can wrap in 2 ways: withLocales(Component) or withLocales(componentTranslation)(Component)
const withLocales = arg => {
  if (typeof arg === 'function') {
    // if argument is the wrapped component
    return wrapComponent(arg);
  }

  // else if argument is the component translation
  return wrappedComponent => wrapComponent(wrappedComponent, arg);
};

const mapStateToProps = state => ({
  lang: state.locale.lang,
  translation: state.locale.translation,
});

export default withLocales;
