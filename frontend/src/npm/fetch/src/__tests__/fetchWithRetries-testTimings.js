// @flow

import lolex from 'lolex';

import fetch from '../fetch';
import fetchWithRetries from '../fetchWithRetries';

jest.mock('../fetch');

let handleResponse, handleCatch;
let clock;
beforeEach(() => {
  handleResponse = jest.fn();
  handleCatch = jest.fn();
  clock = lolex.install();
});

afterEach(() => {
  clock = clock.uninstall();
});

it('works with timeouts and retry delays correctly', () => {
  const DELTA = 1;

  fetchWithRetries('https://localhost', {
    fetchTimeout: 1500,
    retryDelays: [100, 200, 3000],
  })
    .then(handleResponse)
    .catch(handleCatch);

  expect(fetch.mock.calls.length).toBe(1);

  // Nothing happened within 1500ms => HTTP timeout. First retry was scheduled 1400ms ago
  // so the next call should be fired immediately after this (+- some time delta).
  clock.tick(1500 + DELTA);
  expect(fetch.mock.calls.length).toBe(2);

  // Timeouted after 1500ms again. We were supposed to retry after only 200ms
  // so the next call is going to be scheduled immediately.
  clock.tick(1500 + DELTA);
  expect(fetch.mock.calls.length).toBe(3);

  // Timeout again... 🙄 But this time the try should be performed after 3000ms
  // and we just burned 2000ms from it.
  clock.tick(2000 + DELTA);
  expect(fetch.mock.calls.length).toBe(3);
  clock.tick(1000 + DELTA); // this is the remaining time to 3000ms after the timeout
  fetch.mock.deferreds[2].resolve({status: 200});
  expect(fetch.mock.calls.length).toBe(4);
  clock.runAll();
  expect(fetch.mock.calls.length).toBe(4);

  // TODO: doesn't work for some reason (https://github.com/sinonjs/lolex/issues/97)
  // expect(handleCatch).not.toBeCalled();
  // expect(handleResponse).toBeCalledWith();
});
