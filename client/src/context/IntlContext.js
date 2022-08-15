import React from 'react';
import English from '../lang/en.json';
import Polish from '../lang/pl.json';

export const languages = {
  en: {
    locale: 'en',
    messages: English,
  },
  pl: {
    locale: 'pl',
    messages: Polish,
  },
};

export const IntlContext = React.createContext();
