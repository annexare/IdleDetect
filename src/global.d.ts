/**
 * Currently those typings do not exist for TypeScript,
 * but it's already supported by some browsers, like Google Chrome.
 *
 * @todo Remove unnecessary typing overrides in future.
 */

declare global {
  enum UserIdleState {
    active = 'active',
    idle = 'idle',
  }

  enum ScreenIdleState {
    locked = 'locked',
    unlocked = 'unlocked',
  }

  interface IdleDetector {
    userState?: UserIdleState
    screenState?: ScreenIdleState

    new ()
    addEventListener(eventType: string, callback: () => void): void
    requestPermission(): Promise<'granted' | 'denied'>
    start(options?: any): Promise<void>
  }

  interface Window {
    IdleDetector: IdleDetector
  }
}

export {}
