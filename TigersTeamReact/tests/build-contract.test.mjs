import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { resolveConfig } from 'vite';

test('production bundles expose API endpoint variables without exposing backend secrets', async () => {
  const config = await resolveConfig({}, 'build', 'production');
  assert.equal(config.define['process.env.REACT_APP_LOGIN_ENDPOINT'], '"/api/users/token"');
  assert.equal(config.define['process.env.SECRET_KEY'], undefined);
  assert.equal(config.define['process.env.MYSQL_PASSWORD'], undefined);
  const publicEnv = JSON.parse(config.define['process.env']);
  assert.equal(publicEnv.SECRET_KEY, undefined);
  assert.equal(publicEnv.REACT_APP_ADMIN_REPORTS_URL, undefined);
  assert.equal(config.build.outDir, 'build');
});

test('development forwards API calls to the backend without the public prefix', async () => {
  const config = await resolveConfig({}, 'serve', 'development');
  assert.equal(config.server.proxy['/api'].target, 'http://127.0.0.1:8081');
  assert.equal(config.server.proxy['/api'].rewrite('/api/users/current'), '/users/current');
});

test('HTML boots the React application and has no unresolved CRA placeholders', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.match(html, /type="module" src="\/src\/index.js"/);
  assert.doesNotMatch(html, /%PUBLIC_URL%/);
});


test('development proxies stream playlists, segments, and WebRTC to the media server', async () => {
  const config = await resolveConfig({}, 'serve', 'development');
  const hls = config.server.proxy['/hls'];
  assert.equal(hls.target, 'http://127.0.0.1:8080');
  assert.equal(hls.rewrite('/hls/live/OBS_Stream.m3u8'), '/live/OBS_Stream.m3u8');
  assert.equal(hls.rewrite('/hls/live/OBS_Stream-1.ts'), '/live/OBS_Stream-1.ts');
  assert.equal(config.server.proxy['/rtc/v1/whep'].target, 'http://127.0.0.1:1985');
});


test('lazy reservation dependencies are prebundled before navigation', async () => {
  const config = await resolveConfig({}, 'serve', 'development');
  assert.ok(config.optimizeDeps.include.includes('@mui/icons-material/DesktopWindowsRounded'));
});
