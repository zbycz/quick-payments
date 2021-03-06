// @flow

import fetch from '../fetch';
import fetchWithRetries from '../fetchWithRetries';

jest.mock('../fetch');

function mockResponse(status) {
  return {status};
}

let handleNext;
beforeEach(() => {
  handleNext = jest.fn();
});

it('retries the request if the previous attempt failed', () => {
  const failedResponse = mockResponse(500);
  fetchWithRetries('https://localhost', {}).then(handleNext);
  expect(fetch.mock.calls.length).toBe(1);
  fetch.mock.deferreds[0].resolve(failedResponse);
  for (let ii = 0; ii < 100; ii++) {
    if (fetch.mock.calls.length < 2) {
      jest.runOnlyPendingTimers();
    } else {
      break;
    }
  }
  // Resolved with `failedResponse`, next run is scheduled
  expect(fetch.mock.calls.length).toBe(2);
  const successfulResponse = mockResponse(200);
  fetch.mock.deferreds[1].resolve(successfulResponse);
  expect(handleNext).not.toBeCalled();
  jest.runAllTimers();
  expect(handleNext).toBeCalledWith(successfulResponse);
});
