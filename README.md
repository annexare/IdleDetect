# Idle Detect

[![IdleDetect Tests](https://github.com/annexare/IdleDetect/actions/workflows/tests.yml/badge.svg)](https://github.com/annexare/IdleDetect/actions/workflows/tests.yml)
[![Monthly Downloads](https://img.shields.io/npm/dm/idle-detect.svg)](https://www.npmjs.com/package/idle-detect)

A TypeScript library for inactivity timer, which utilises [IdleDetector API](https://developer.mozilla.org/en-US/docs/Web/API/IdleDetector) where possible or a fallback to `window.setTimeout` approach.

## Usage

```bash
npm install idle-detect
```

```ts
import IdleDetect from 'idle-detect'
// Or, if you don't want to use still experimental IdleDetector API:
// import { IdleDetect } from 'idle-detect/dist/IdleDetect'

const onInactive = () => {
  console.info('User is inactive now')
}
const idleDetect = new IdleDetect(15 * 60, onInactive)

// Start timer, e.g. when user is logged in
idleDetect.start()

// End timer, e.g. when user is logged out
idleDetect.cleanupAndStop()
```
