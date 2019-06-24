import { Collection } from './collection'

describe('Collection object', () => {
  const response = {
    data: [{}, {}],
    fetchNext: () => {},
  }

  describe('method', () => {
    describe('loadPage', () => {
      it('calls loader method', async () => {
        const loader = sinon.stub().resolves(response)
        const collection = new Collection(loader)

        await collection.loadPage()

        expect(collection._loader).to.have.been.calledOnce
      })

      it('calls mapper method if it’‎s present', async () => {
        const loader = sinon.stub().resolves(response)
        const mapper = sinon.stub()
        const collection = new Collection(loader, mapper)

        await collection.loadPage()

        expect(collection._mapper).to.have.been.calledOnce
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

  describe('getters', () => {
    describe('isFailed', () => {
      it('return true if loadPage method throws error', async () => {
        const collection = new Collection(() => {})
        sinon.stub(collection, '_loader').throws()

        await collection.loadPage()

        expect(collection.isFailed).to.be.true

        collection._loader.restore()
      })
    })
  })
})
