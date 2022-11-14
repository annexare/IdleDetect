import { IdleDetectIsomorph, isIdleDetectorSupported } from '../src/IdleDetectIsomorph'

describe('IdleDetectIsomorph: 1 second idle check', () => {
  let idleCount = 0
  const onIdle = () => {
    idleCount++
  }

  const idle = new IdleDetectIsomorph(1, onIdle, true)

  beforeEach(async () => {
    cy.spy(idle, 'handleIdle')
    cy.spy(idle, 'startTimeout')

    if (isIdleDetectorSupported()) {
      // @ts-ignore
      cy.spy(window.IdleDetector, 'requestPermission')
    }

    idleCount = 0
    await idle.start()
  })

  afterEach(() => {
    idle.cleanupAndStop()
  })

  it('Wait less than a second', () => {
    expect(idle.handleIdle).not.to.be.called
    expect(idleCount).to.eq(0)

    cy.wait(100).should(() => {
      expect(idle.handleIdle).not.to.be.called
      expect(idleCount).to.eq(0)
    })
  })

  it('Wait a second', () => {
    cy.log('isIdleDetectorSupported()', isIdleDetectorSupported())
    cy.wait(1000).should(() => {
      if (isIdleDetectorSupported()) {
        // TODO: Test cases depending on this premission mock
        // @ts-ignore
        expect(window.IdleDetector.requestPermission).to.be.called
      }

      // Regular timeout behaviour
      expect(idle.startTimeout).to.be.called
      expect(idle.handleIdle).to.be.called
      expect(idleCount).to.eq(1)
    })
  })
})
