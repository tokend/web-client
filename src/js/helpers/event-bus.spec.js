import { Bus } from '@/js/helpers/event-bus'

describe('event-bus unit test', () => {
  beforeEach(() => {
    const eventList = {
      'my-event': 'my-event',
    }

    sinon.stub(Bus, 'eventList').get(_ => eventList)
  })

  afterEach(() => {
    sinon.restore()
    Bus.reset()
  })

  it('emits proper listeners attached to event', () => {
    const handlerFn = sinon.spy()

    Bus.on('my-event', handlerFn)

    const payload = { 'some': 'payload' }

    Bus.emit('my-event')
    Bus.emit('my-event', payload)

    expect(handlerFn.calledTwice).to.be.true
    expect(handlerFn.withArgs(payload).calledOnce).to.be.true
  })

  it('emits preset events with correct payload', () => {
    sinon.restore()

    const warningFn = sinon.spy()
    const successFn = sinon.spy()
    const infoFn = sinon.spy()
    const errFn = sinon.spy()

    Bus.on('warning', warningFn)
    Bus.on('success', successFn)
    Bus.on('info', infoFn)
    Bus.on('error', errFn)

    Bus.warning('Warning!')
    Bus.success('Success!')
    Bus.info('Some info')
    Bus.error('Some error')

    expect(warningFn.withArgs('Warning!').calledOnce).to.be.true
    expect(successFn.withArgs('Success!').calledOnce).to.be.true
    expect(infoFn.withArgs('Some info').calledOnce).to.be.true
    expect(errFn.withArgs('Some error').calledOnce).to.be.true
  })

  it('throws an error when trying to emit not listed event', () => {
    expect(() => Bus.emit('my-another-event'))
      .to
      .throw('EventBus.list has no my-another-event event')
  })

  it('backlogs an event with missing handler at the moment of emit', () => {
    Bus.emit('my-event', 'some-payload')

    expect(Bus._backlog).to.deep.equal([{
      name: 'my-event',
      payload: 'some-payload',
    }])
  })

  it('calls handler immediately for backlogged event', () => {
    const handlerFn = sinon.spy()

    Bus._backlog = ['my-event']

    Bus.emit('my-event', 'some-payload')
    Bus.on('my-event', handlerFn)

    expect(handlerFn.withArgs('some-payload').calledOnce).to.be.true
  })
})
