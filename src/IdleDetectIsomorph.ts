import { IdleDetect, defaultEventTypes, defaultOnInactive } from './IdleDetect'

export const isIdleDetectorSupported = () => 'IdleDetector' in window

export class IdleDetectIsomorph extends IdleDetect {
  protected isIdleDetectorAPI = false

  // Native API
  private controller: AbortController = null
  private detector: IdleDetector = null

  constructor(
    seconds: number,
    onInactive: () => void = defaultOnInactive,
    eventTypes: string[] = defaultEventTypes,
  ) {
    super(seconds, onInactive, eventTypes)

    if (isIdleDetectorSupported()) {
      this.controller = new AbortController()
    }
  }

  cleanupAndStop = () => {
    super.cleanupAndStop()

    if (this.detector) {
      this.detector = null
    }
  }

  handleIdleChange = () => {
    const userState = this.detector.userState
    const screenState = this.detector.screenState

    console.info(`IdleDetector change: ${userState}, ${screenState}`)

    if (userState === 'idle' || screenState === 'locked') {
      this.handleInactive()
    }
  }

  startIdleDetector = async () => {
    if (!this.detector) {
      this.detector = new window.IdleDetector()
      this.detector.addEventListener('change', this.handleIdleChange)
    }

    await this.detector.start({
      threshold: this.inactivityTime,
      signal: this.controller.signal,
    })

    console.info('IdleDetector is active')
  }

  start = async () => {
    // Cleanup
    this.cleanupAndStop()

    // Check if native API can be used
    this.isIdleDetectorAPI =
      isIdleDetectorSupported() && (await window.IdleDetector.requestPermission()) === 'granted'

    if (this.isIdleDetectorAPI) {
      console.error('Idle detection permission denied.')

      return this.startIdleDetector()
    } else {
      this.startTimeout()
    }
  }
}
