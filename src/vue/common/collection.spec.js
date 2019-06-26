import { Collection } from './collection'
// import { ErrorHandler } from '@/js/helpers/error-handler'

describe('Collection object', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  const response = {
    data: [1, 2],
    fetchNext: () => {},
  }

  describe('method', () => {
    describe('loadPage', () => {
      const loader = sinon.stub().resolves(response)
      const mapper = sinon.stub()

      it('loads data if called once and extends previously loaded data if called repeatedly', async () => {
        const collection = new Collection(loader)
        const fetchNext = sinon.stub(response, 'fetchNext').resolves(response)

        await collection.loadPage()

        expect(loader).to.have.been.calledOnce
        expect(fetchNext)
          .to.have.been.not.called

        await collection.loadPage()

        expect(fetchNext).to.have.been.calledOnce
      })

      it('calls mapper method if it was passed to object', async () => {
        const collection = new Collection(loader, mapper)

        await collection.loadPage()

        expect(collection._mapper).to.have.been.calledOnce
      })

      it('sets object properties if data succefully fetched', async () => {
        const collection = new Collection(loader)

        await collection.loadPage()

        expect(collection.isLoaded).to.be.true
        expect(collection.isFailed).to.be.false
        expect(collection.isLoading).to.be.false
      })

      it('sets isFail to true and handles error if error thrown', async () => {
        const error = new Error('Error')
        const errorThrownFn = sinon.stub().throws(error)
        const collection = new Collection(errorThrownFn)
        sinon.stub(collection, '_errorHandler')

        await collection.loadPage()

        expect(collection._errorHandler.withArgs(error)).to.have.been.calledOnce

        expect(collection.isFailed).to.be.true
        collection._errorHandler.restore()
      })
    })

    describe('reload', () => {
      it('calls loadPage method', async () => {
        const collection = new Collection()
        sinon.stub(collection, 'loadPage')

        collection.reload()

        expect(collection.loadPage).to.have.been.calledOnce
        collection.loadPage.restore()
      })
    })
  })
})
