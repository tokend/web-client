import { shallowMount, createLocalVue } from '@vue/test-utils'
import CollectionLoader from './CollectionLoader'
import { globalize } from '../filters/globalize'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.filter('globalize', globalize)
let wrapper
const someData = []
const requestPerPage = 10
const someEvent = 'some-event'

beforeEach(() => {
  wrapper = shallowMount(CollectionLoader, {
    propsData: {
      firstPageLoader: sinon.stub().resolves({ data: someData }),
      requestPerPage
    },
    localVue
  })
})
afterEach(() => {
  sinon.restore()
})
describe('CollectionLoader component test', () => {
  it('loadPage correctly load loader fn', async () => {
    const spy = sinon.stub().resolves({ data: someData })

    await wrapper.vm.loadPage(someEvent, spy)

    expect(spy.calledOnce).to.be.true
  })

  it('loadPage correctly emit event with data', async () => {
    await wrapper.vm.loadPage(someEvent, sinon.stub().resolves({
      data: someData
    }))

    expect(wrapper.emitted()[someEvent]).to.exist
    expect(wrapper.emitted()[someEvent].length).to.equal(1)
    expect(wrapper.emitted()[someEvent][0][0]).to.equal(someData)
  })

  it('nextPageLoader correctly saved fetchNext', async () => {
    const fetchNext = () => {}

    const spy = sinon.stub().resolves({
      fetchNext,
      data: someData
    })

    await wrapper.vm.loadPage(someEvent, spy)

    expect(wrapper.vm.nextPageLoader).to.equal(fetchNext)
  })

  it('isCollectionFetched false when data is fully loaded', async () => {
    const fetchNext = () => {}
    someData.length = requestPerPage + 1
    const spy = sinon.stub().resolves({
      fetchNext,
      data: someData
    })

    await wrapper.vm.loadPage(someEvent, spy)

    expect(wrapper.vm.isCollectionFetched).to.be.false
  })

  it('isCollectionFetched true when data is not fully loaded', async () => {
    const fetchNext = () => {}
    someData.length = requestPerPage - 1
    const spy = sinon.stub().resolves({
      fetchNext,
      data: someData
    })

    await wrapper.vm.loadPage(someEvent, spy)

    expect(wrapper.vm.isCollectionFetched).to.be.true
  })

  it('ErrorHandler correctly processed the error', async () => {
    const error = new Error('Error')
    const spy = sinon.stub().throws(error)
    const spyError = sinon.stub(ErrorHandler, 'process')

    await wrapper.vm.loadPage(someEvent, spy)

    expect(spyError.withArgs(error).calledOnce).to.be.true
  })

  it('loadFirstPage calls loadPage', () => {
    const spy = sinon.stub(wrapper.vm, 'loadPage')

    wrapper.vm.loadFirstPage()

    expect(spy.calledOnce).to.be.true
  })

  it('loadNextPage calls loadPage', () => {
    const spy = sinon.stub(wrapper.vm, 'loadPage')

    wrapper.vm.loadNextPage()

    expect(spy.calledOnce).to.be.true
  })

  it('button is not displayed when all data is loaded', async () => {
    wrapper.setData({ isCollectionFetched: true })

    expect(wrapper.contains('button')).to.be.false
  })
})
