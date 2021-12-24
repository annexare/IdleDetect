export const defaultEventTypes: string[] = ['click', 'mousedown', 'touchstart', 'keypress']
// 15 minutes by default
export const defaultInactivityTime = 15 * 60 * 1000
export const defaultOnInactive: () => void = () => {}

export class IdleDetect {
  public eventTypes = defaultEventTypes
  public inactivityTime = defaultInactivityTime
  public timeout?: number
  public handleInactive = defaultOnInactive

  constructor(
    seconds: number,
    onInactive: () => void = defaultOnInactive,
    eventTypes: string[] = defaultEventTypes,
  ) {
    this.eventTypes = eventTypes
    this.inactivityTime = seconds * 1000 || defaultInactivityTime
    this.handleInactive = onInactive
  }

  cleanupAndStop = () => {
    window.clearTimeout(this.timeout)

    for (const eventType of this.eventTypes) {
      window.removeEventListener(eventType, this.resetTimeout)
    }
  }

  // [perf] Use debounce here?
  resetTimeout = () => {
    console.info(' -- resetTimeout()')
    window.clearTimeout(this.timeout)
    this.timeout = window.setTimeout(() => {
      this.cleanupAndStop()
      this.handleInactive()
    }, this.inactivityTime)
  }

  startTimeout = () => {
    // Event listeners
    for (const eventType of this.eventTypes) {
      window.addEventListener(eventType, this.resetTimeout)
    }

    // Reset interval
    this.resetTimeout()
  }

  start = () => {
    this.cleanupAndStop()
    this.startTimeout()
  }
}
