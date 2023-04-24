import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { CharacterPage } from './features/characters/components/CharacterPage/CharacterPage';
import { CharactersPage } from './features/characters/components/CharactersPage/CharactersPage';
import reportWebVitals from './reportWebVitals';
import { store } from './store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <CharactersPage />,
  },
  {
    path: '/:id',
    element: <CharacterPage />,
  },
]);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

root.render(
  <ThemeProvider theme={darkTheme}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ThemeProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
