export const defaultEventTypes = ['click', 'mousedown', 'touchstart', 'keypress']
/** 15 minutes by default */
export const defaultIdleTime = 15 * 60 * 1000
export const defaultNoLog: (...messages: any[]) => void = () => {}
export const defaultOnIdle: () => void = () => {}

export class IdleDetect {
  /** List of tracket event types, bubbled to `window` and used for timeout */
  public eventTypes = defaultEventTypes
  /** Idle timeout in milliseconds */
  public idleTime = defaultIdleTime
  /** Event handler when user is idle for specified time */
  public handleIdle: () => void = defaultOnIdle

  protected timeout?: number

  public error: (...messages: any[]) => void = defaultNoLog
  public log: (...messages: any[]) => void = defaultNoLog

  constructor(
    /** Number of seconds for idle detection, 15 minutes by default */
    idleSeconds: number,
    /** Event handler when user is idle for specified time */
    onIdle: () => void = defaultOnIdle,
    eventTypes: string[] = defaultEventTypes,
    enableLogs = false,
  ) {
    this.eventTypes = eventTypes
    this.idleTime = idleSeconds * 1000 || defaultIdleTime
    this.handleIdle = onIdle
    this.setLogs(enableLogs)
  }

  cleanupAndStop = () => {
    this.log('IdleDetect: cleanupAndStop()')
    window.clearTimeout(this.timeout)

    for (const eventType of this.eventTypes) {
      window.removeEventListener(eventType, this.resetTimeout)
    }
  }

  // [perf] Use debounce here?
  resetTimeout = () => {
    this.log('IdleDetect: resetTimeout()')
    window.clearTimeout(this.timeout)
    this.timeout = window.setTimeout(() => {
      this.cleanupAndStop()
      this.handleIdle()
    }, this.idleTime)
  }

  setLogs = (enableLogs = false) => {
    if (enableLogs) {
      this.error = console.error
      this.log = console.log
    } else {
      this.error = defaultNoLog
      this.log = defaultNoLog
    }
  }

  startTimeout = () => {
    this.log('IdleDetect: startTimeout()')

    // Event listeners
    for (const eventType of this.eventTypes) {
      window.addEventListener(eventType, this.resetTimeout)
    }

    // Reset
    this.resetTimeout()
  }

  start = () => {
    this.cleanupAndStop()
    this.startTimeout()
  }
}
