import { findByText, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { renderWithProviders } from '../../../../utils/test.utils';
import { CharactersPage } from './CharactersPage';

// We're using our own custom render function and not RTL's render.
// We use msw to intercept the network request during the test,
// and return the response 'John Smith' after 150ms
// when receiving a get request to the `/api/user` endpoint
export const handlers = [
  rest.get('https://swapi.dev/api/people', (req, res, ctx) => {
    return res(
      ctx.json({
        results: [
          { name: 'Luke Skywalker', url: 'asd/1/' },
          { name: 'Leya Organa', url: 'asd/2/' },
          { name: 'Jabba Hatta', url: 'asd/3/' },
          { name: 'ASdasd', url: 'asd/4/' },
          { name: 'AAAAAAAAAAA', url: 'asd/5/' },
          { name: 'BBBBBBBBBBB', url: 'asd/6/' },
          { name: 'CCCCCCCCCCC', url: 'asd/7/' },
        ],
        count: 89,
      }),
      ctx.delay(0)
    );
  }),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test('fetches & receives a characters when initializing the page', async () => {
  renderWithProviders(<CharactersPage />);

  // we should see loading when initialized component
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  expect(screen.getByText(/Loading.../i)).toHaveStyle({
    visibility: 'visible',
  });

  const loadingPaper = await screen.findByText(
    /Loading.../i,
    {},
    { timeout: 500 }
  );
  const lukeSkywaler = await screen.findByText(/Luke Skywalker/i);

  // loading is hidden
  expect(loadingPaper).toHaveStyle({ visibility: 'hidden' });
  // Luke Skywalker is in the document
  expect(lukeSkywaler).toBeInTheDocument();
});

test('Check for pagination', async () => {
  renderWithProviders(<CharactersPage />);

  const lukeSkywalker = await screen.findByText(/Luke Skywalker/i);

  const paginator = screen.getByTestId('paginator');

  const first = await findByText(paginator, /1/i);
  const second = await findByText(paginator, /2/i);
  // First page is selected
  expect(first).toHaveClass('Mui-selected');
  // Second page is inactive
  expect(second).not.toHaveClass('Mui-selected');

  // Click on second page
  act(async () => {
    await userEvent.click(second);
    const loading = await screen.findByText(/Loading.../i);
    expect(loading).toHaveStyle({ visibily: 'visible' });
  });
});
