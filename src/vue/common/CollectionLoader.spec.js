import CollectionLoader from './CollectionLoader'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { globalize } from '@/vue/filters/globalize'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { eventHandlerTest } from '@/js/helpers/test-helper'

const localVue = createLocalVue()
localVue.filter('globalize', globalize)

describe('CollectionLoader component test', () => {
  const firstPageLoader = sinon.stub().resolves({
    data: [],
    fetchNext: () => {}
  })
  afterEach(() => {
    sinon.restore()
  })

  it('loadPage calls provided loaderFn', async () => {
    const wrapper = shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader
      },
      localVue
    })
    const spy = sinon.stub().resolves({
      data: [],
      fetchNext: () => {}
    })

    await wrapper.vm.loadPage('some-event', spy)

    expect(spy.calledOnce).to.be.true
  })

  it('loadPage properly emits event with correct payload', async () => {
    const wrapper = shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader
      },
      localVue
    })
    const mockData = []
    const someEvent = 'some-event'
    await wrapper.vm.loadPage(someEvent, sinon.stub().resolves({
      data: mockData
    }))
    expect(eventHandlerTest(wrapper, someEvent, mockData)).to.be.true
  })

  it('loadPage saves fetchNext returned in response', async () => {
    const fetchNext = () => {}
    const wrapper = shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader
      },
      localVue
    })

    const spy = sinon.stub().resolves({
      fetchNext,
      data: []
    })

    await wrapper.vm.loadPage('some-event', spy)

    expect(wrapper.vm.nextPageLoader).to.equal(fetchNext)
  })

  it('isCollectionFetched false when data is not fully loaded', async () => {
    const fetchNext = () => {}
    const mockData = []
    const pageLimit = 10
    const wrapper = shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader: sinon.stub().resolves({
          data: mockData,
          fetchNext
        }),
        pageLimit
      },
      localVue
    })
    mockData.length = pageLimit + 1
    const spy = sinon.stub().resolves({
      fetchNext,
      data: mockData
    })

    await wrapper.vm.loadPage('some-event', spy)

    expect(wrapper.vm.isCollectionFetched).to.be.false
  })

  it('isCollectionFetched true when data is fully loaded', async () => {
    const fetchNext = () => {}
    const mockData = []
    const pageLimit = 10
    const wrapper = shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader: sinon.stub().resolves({
          data: mockData,
          fetchNext
        }),
        pageLimit
      },
      localVue
    })
    mockData.length = pageLimit - 1
    const spy = sinon.stub().resolves({
      fetchNext,
      data: mockData
    })

    await wrapper.vm.loadPage('some-event', spy)

    expect(wrapper.vm.isCollectionFetched).to.be.true
  })

  it('loadPage delegates error to ErrorHandler when got one', async () => {
    const wrapper = shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader
      },
      localVue
    })
    const error = new Error('Error')
    const spy = sinon.stub().throws(error)
    const spyError = sinon.stub(ErrorHandler, 'process')

    await wrapper.vm.loadPage('some-event', spy)

    expect(spyError.withArgs(error).calledOnce).to.be.true
  })

  it('loadFirstPage calls loadPage', () => {
    const firstPageLoader = sinon.stub().resolves({
      data: [],
      fetchNext: () => {}
    })
    const wrapper = shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader
      },
      localVue
    })

    const spy = sinon.stub(wrapper.vm, 'loadPage')

    wrapper.vm.loadFirstPage()

    expect(spy.withArgs('first-page-load', firstPageLoader).calledOnce)
      .to.be.true
  })

  it('loadNextPage calls loadPage', () => {
    const wrapper = shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader: () => { return { data: [] } }
      },
      localVue
    })

    const spy = sinon.stub(wrapper.vm, 'loadPage')
    const nextPageLoader = sinon.stub().resolves({})

    wrapper.setData({
      nextPageLoader
    })

    wrapper.vm.loadNextPage('next-page-load', nextPageLoader)

    expect(spy.withArgs('next-page-load', nextPageLoader).calledOnce)
      .to.be.true
  })

  it('button is displayed when not all data is loaded', async () => {
    const wrapper = shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader
      }
    })
    wrapper.setData({ isCollectionFetched: false })

    expect(wrapper.contains('button')).to.be.true
  })

  it('button is not displayed when all data is loaded', async () => {
    const wrapper = shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader
      }
    })
    wrapper.setData({ isCollectionFetched: true })

    expect(wrapper.contains('button')).to.be.false
  })
  it('calls firstPageLoader when creating a component', () => {
    const firstPageLoader = sinon.stub().resolves({ data: [] })
    shallowMount(CollectionLoader, {
      propsData: {
        firstPageLoader
      },
      localVue
    })

    expect(firstPageLoader.calledOnce).to.be.true
  })
})
