import test from 'node:test';
import assert from 'node:assert/strict';
import { safeRedirect, apiErrorMessage } from '../src/utils/authData.mjs';
import { filterHelp, helpTopics } from '../src/utils/helpData.mjs';

test('login redirects preserve local booking and cart destinations', () => {
  assert.equal(safeRedirect('/products'), '/products');
  assert.equal(
    safeRedirect('/reservations/room-selector?session=1'),
    '/reservations/room-selector?session=1',
  );
  for (const value of [
    undefined,
    'undefinedundefined',
    '//outside.example',
    'https://outside.example',
    '/\\outside.example',
    '/bad\npath',
  ])
    assert.equal(safeRedirect(value), '/');
});

test('API errors support validation lists without rendering raw objects', () => {
  assert.equal(
    apiErrorMessage({ detail: 'Incorrect password' }, 'Fallback'),
    'Incorrect password',
  );
  assert.match(
    apiErrorMessage(
      { detail: [{ loc: ['body', 'password'], msg: 'Too short' }] },
      'Fallback',
    ),
    /password: Too short/,
  );
  assert.equal(apiErrorMessage({}, 'Fallback'), 'Fallback');
});

test('help search handles case, empty results, and topic filters', () => {
  assert.equal(filterHelp(helpTopics).length, helpTopics.length);
  assert.ok(
    filterHelp(helpTopics, '  PASSWORD  ').every((topic) =>
      /password/i.test(topic.question + topic.answer),
    ),
  );
  assert.ok(
    filterHelp(helpTopics, '', 'Live').every((topic) => topic.group === 'Live'),
  );
  assert.deepEqual(filterHelp(helpTopics, 'no-such-topic-123'), []);
  assert.deepEqual(filterHelp([], ''), []);
  assert.equal(
    new Set(helpTopics.map((topic) => topic.id)).size,
    helpTopics.length,
  );
});
