import { IdleDetect } from '../src/IdleDetect'

describe('IdleDetect: 1 second idle check', () => {
  let idleCount = 0
  const onIdle = () => {
    idleCount++
  }

  const idle = new IdleDetect(1, onIdle, true)

  beforeEach(() => {
    cy.spy(idle, 'handleIdle')
    idleCount = 0
    idle.start()
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
    cy.wait(1000).should(() => {
      expect(idle.handleIdle).to.be.called
      expect(idleCount).to.eq(1)
    })
  })
})
