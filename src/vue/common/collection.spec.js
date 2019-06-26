import { Collection } from './collection'

describe('Collection', () => {
  const response = {
    data: [],
    fetchNext: () => {},
  }
  let sandbox
  let loader
  let mapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    loader = sandbox.stub().resolves(response)
    mapper = sandbox.stub()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('methods', () => {
    describe('loadPage', () => {
      it('loads data if called once and extends previously loaded data if called repeatedly', async () => {
        const collection = new Collection(loader)
        const fetchNext = sandbox.stub(response, 'fetchNext').resolves(response)

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
        const errorThrownFn = sandbox.stub().throws(error)
        const collection = new Collection(errorThrownFn)
        sandbox.stub(collection, '_errorHandler')

        await collection.loadPage()

        expect(collection._errorHandler.withArgs(error)).to.have.been.calledOnce

        expect(collection.isFailed).to.be.true
        collection._errorHandler.restore()
      })
    })

    describe('reload', () => {
      it('calls loadPage method as fetched first', async () => {
        const collection = new Collection()
        sandbox.stub(collection, 'loadPage')

        collection.reload()

        expect(collection.loadPage).to.have.been.calledOnce
        collection.loadPage.restore()
      })
    })
  })
  describe('setters', () => {
    describe('mapper', () => {
      it('sets function witch used for map loaded data array', async () => {
        const collection = new Collection(loader)
        collection.mapper = mapper

        await collection.loadPage()

        expect(mapper).to.have.been.calledOnce
      })
    })
    describe('loader', () => {
      it('sets function witch load data', async () => {
        const collection = new Collection()
        collection.loader = loader

        await collection.loadPage()

        expect(loader).to.have.been.calledOnce
      })
    })
  })
})
