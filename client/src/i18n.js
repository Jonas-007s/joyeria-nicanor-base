// Revisión y mejoras:
// - Validación de existencia de archivos de traducción.
// - Comentario para producción sobre lazy loading de idiomas si el proyecto crece.
// - Estructura clara y lista para escalar.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationES from './locales/es/translation.json';
import translationEN from './locales/en/translation.json';

// Si el proyecto crece, considera usar lazy loading para idiomas:
// https://react.i18next.com/latest/using-with-hooks#lazy-loading-translations

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: translationES },
      en: { translation: translationEN }
    },
    lng: 'es', // idioma por defecto
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
  });

export default i18n;
