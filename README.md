# Idle Detect

A TypeScript library for inactivity timer, which utilises [IdleDetector API](https://developer.mozilla.org/en-US/docs/Web/API/IdleDetector) where possible or a fallback to `window.setTimeout` approach.

## Usage

```bash
npm install idle-detect
```

```ts
import IdleDetect from 'idle-detect'

const onInactive = () => {
  console.info('User is inactive now')
}
const timer = new IdleDetect(15 * 60, onInactive)

// Start timer, e.g. when user is logged in
timer.start()

// End timer, e.g. when user is logged out
timer.cleanupAndStop()
```
