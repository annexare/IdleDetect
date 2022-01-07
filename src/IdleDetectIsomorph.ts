import { IdleDetect, defaultEventTypes, defaultNoop } from './IdleDetect'

export const isIdleDetectorSupported = () => 'IdleDetector' in window

export class IdleDetectIsomorph extends IdleDetect {
  // Native API
  protected controller?: AbortController = null
  protected detector?: IdleDetector = null

  constructor(
    /** Number of seconds for idle detection, 15 minutes by default */
    idleSeconds: number,
    /** Event handler when user is idle for specified time */
    onIdle: () => void = defaultNoop,
    enableLogs = false,
    eventTypes: string[] = defaultEventTypes,
  ) {
    super(idleSeconds, onIdle, enableLogs, eventTypes)

    if (isIdleDetectorSupported()) {
      this.controller = new AbortController()
    }
  }

  cleanupAndStop = () => {
    super.cleanupAndStop()

    // Need to check if it's fine with next start()
    // this.controller.abort()
    this.detector = null

    this.log('IdleDetector: Inactive')
  }

  handleIdleChange = () => {
    const userState = this.detector?.userState
    const screenState = this.detector?.screenState

    this.log(`IdleDetector: User is ${userState}, screen is ${screenState}`)

    if (userState === UserIdleState.idle || screenState === ScreenIdleState.locked) {
      this.handleIdle()
    }
  }

  startIdleDetector = async () => {
    this.log('IdleDetect: startIdleDetector()')

    if (!this.detector) {
      this.detector = new window.IdleDetector()
      this.detector.addEventListener('change', this.handleIdleChange)
    }

    await this.detector.start({
      threshold: this.idleTime,
      signal: this.controller.signal,
    })

    this.log('IdleDetector: Active')
  }

  start = async () => {
    if (isIdleDetectorSupported()) {
      if ((await window.IdleDetector.requestPermission()) === 'granted') {
        return this.startIdleDetector()
      } else {
        this.error('IdleDetector: Permission denied')
      }
    }

    return this.startTimeout()
  }
}
