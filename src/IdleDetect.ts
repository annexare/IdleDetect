export const defaultEventTypes = ['mousedown', 'touchstart', 'keypress']
/** 15 minutes by default */
export const defaultIdleTime = 15 * 60 * 1000
export const defaultNoLog: (...messages: any[]) => void = () => {}
export const defaultNoop: () => void = () => {}

export class IdleDetect {
  /** List of tracket event types, bubbled to `window` and used for timeout */
  public eventTypes = defaultEventTypes
  /** Idle timeout in milliseconds */
  public idleTime = defaultIdleTime
  /** Event handler when user is idle for specified time */
  public handleIdle: () => void = defaultNoop

  protected timeout?: number

  public error: (...messages: any[]) => void = defaultNoLog
  public log: (...messages: any[]) => void = defaultNoLog

  constructor(
    /** Number of seconds for idle detection, 15 minutes by default */
    idleSeconds: number = defaultIdleTime,
    /** Event handler when user is idle for specified time */
    onIdle: () => void = defaultNoop,
    enableLogs = false,
    eventTypes: string[] = defaultEventTypes,
  ) {
    this.eventTypes = eventTypes
    this.setIdleTime(idleSeconds)
    this.handleIdle = onIdle
    this.setLogs(enableLogs)
  }

  cleanupAndStop = () => {
    this.log('IdleDetect: cleanupAndStop()')
    window.clearTimeout(this.timeout)

    for (const eventType of this.eventTypes) {
      window.removeEventListener(eventType, this.redoTimeout)
    }
  }

  // [perf] Use debounce here?
  redoTimeout = () => {
    this.log('IdleDetect: redoTimeout()')
    window.clearTimeout(this.timeout)

    this.timeout = window.setTimeout(() => {
      this.cleanupAndStop()
      this.handleIdle()
    }, this.idleTime)
  }

  setIdleTime = (idleSeconds: number = defaultIdleTime) => {
    this.log('IdleDetect: setIdleTime()', idleSeconds)
    this.idleTime = idleSeconds * 1000
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
      window.addEventListener(eventType, this.redoTimeout)
    }

    // Reset
    this.redoTimeout()
  }

  start = () => {
    if (!this.idleTime) {
      this.error('IdleDetect: idleTime is must be a positive number to start')
      return
    }

    this.startTimeout()
  }
}
