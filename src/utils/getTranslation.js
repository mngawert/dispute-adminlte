import translations from "../contexts/translations";

const getTranslation = (key, language = 'en', params = {}) => {
  let translation = translations[language][key] || translations['en'][key];
  Object.keys(params).forEach(param => {
    translation = translation.replace(`{${param}}`, params[param]);
  });
  return translation;
};

export default getTranslation;
