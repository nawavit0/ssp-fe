import types from './types';
import languages from '../../constants/languages';

const initialState = {
  lang: languages.th,
  langCode: 'th',
  translation: {},
};

export default function locale(state = initialState, action) {
  switch (action.type) {
    case types.SET_ACTIVE_LANGUAGE:
      return {
        ...state,
        lang: action.payload.lang,
        langCode: action.payload.langCode,
      };
    case types.LOAD_TRANSLATION:
      return {
        ...state,
        translation: action.payload.translation,
      };
    default:
      return state;
  }
}
