import test from 'node:test';
import assert from 'node:assert/strict';
import { watchBackgroundRefresh } from '../src/utils/backgroundRefresh.mjs';

function surfaces() {
  const browserWindow = new EventTarget();
  const browserDocument = new EventTarget();
  browserDocument.visibilityState = 'visible';
  const sources = [];
  browserWindow.EventSource = class extends EventTarget {
    constructor(url) {
      super();
      assert.equal(url, '/api/updates');
      sources.push(this);
    }
    close() {
      this.closed = true;
    }
  };
  return { browserWindow, browserDocument, sources };
}
const flush = () => new Promise((resolve) => setImmediate(resolve));

test('server changes refresh immediately through one shared connection; no refresh timer', async () => {
  const s = surfaces();
  let first = 0;
  let second = 0;
  const stop1 = watchBackgroundRefresh(
    async () => {
      first += 1;
    },
    s.browserWindow,
    s.browserDocument,
  );
  const stop2 = watchBackgroundRefresh(
    async () => {
      second += 1;
    },
    s.browserWindow,
    s.browserDocument,
  );
  assert.equal(s.sources.length, 1);
  s.sources[0].dispatchEvent(new Event('change'));
  await flush();
  assert.equal(first, 1);
  assert.equal(second, 1);
  stop1();
  assert.equal(s.sources[0].closed, undefined);
  stop2();
  assert.equal(s.sources[0].closed, true);
});

test('hidden pages catch up on return and reconnects refresh missed changes', async () => {
  const s = surfaces();
  let calls = 0;
  const stop = watchBackgroundRefresh(
    async () => {
      calls += 1;
    },
    s.browserWindow,
    s.browserDocument,
  );
  s.browserDocument.visibilityState = 'hidden';
  s.sources[0].dispatchEvent(new Event('change'));
  await flush();
  assert.equal(calls, 0);
  s.browserDocument.visibilityState = 'visible';
  s.browserDocument.dispatchEvent(new Event('visibilitychange'));
  await flush();
  assert.equal(calls, 1);
  s.sources[0].dispatchEvent(new Event('ready'));
  await flush();
  assert.equal(calls, 2);
  stop();
  s.browserWindow.dispatchEvent(new Event('focus'));
  await flush();
  assert.equal(calls, 2);
});

test('a change during a slow read queues another read instead of being lost; failures recover', async () => {
  const s = surfaces();
  let finish;
  let calls = 0;
  const stop = watchBackgroundRefresh(
    () => {
      calls += 1;
      if (calls === 1)
        return new Promise((resolve) => {
          finish = resolve;
        });
      if (calls === 2) throw new Error('offline');
      return Promise.resolve();
    },
    s.browserWindow,
    s.browserDocument,
  );
  s.sources[0].dispatchEvent(new Event('change'));
  s.sources[0].dispatchEvent(new Event('change'));
  assert.equal(calls, 1);
  finish();
  await flush();
  assert.equal(calls, 2);
  s.browserWindow.dispatchEvent(new Event('online'));
  await flush();
  assert.equal(calls, 3);
  stop();
});
