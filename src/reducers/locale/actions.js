import types from './types';
import { setActiveConfig } from '../storeConfig/actions';
import languages from '../../constants/languages';

export const setLocale = lang => async dispatch => {
  const locale = languages[lang];
  await dispatch(setActiveConfig(locale));
  dispatch(setActiveLanguage(locale, lang));

  if (typeof document !== 'undefined') {
    document.cookie = `lang=${lang}; path=/;`;
  }
};

export const setActiveLanguage = (lang, langCode) => ({
  type: types.SET_ACTIVE_LANGUAGE,
  payload: { lang, langCode },
});

export const loadTranslation = translation => ({
  type: types.LOAD_TRANSLATION,
  payload: { translation },
});
