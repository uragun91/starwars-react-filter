import { screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';

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
        results: [{ name: 'Luke Skywalker' }],
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

  await waitFor(
    () => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    },

    { timeout: 500 }
  );
  // // after some time, the user should be received
  // expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
});
