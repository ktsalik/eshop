i18next
  .use(ReactI18next.initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: {
      en: {
        translations: {
          foo: 'bar',
        },
      },
      el: {
        translations: {
          foo: 'μπαρ',
        },
      },
    },
  });