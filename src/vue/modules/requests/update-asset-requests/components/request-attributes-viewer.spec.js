import RequestAttributesViewer from './request-attributes-viewer'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'

const localVue = createLocalVue()

describe('Update asset request attributes viewer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RequestAttributesViewer, {
      localVue,
      propsData: { request: new UpdateAssetRequest({}) },
    })
  })

  describe('computed property', () => {
    describe('assetTermsUrl', () => {
      it('returns request.termsUrl', () => {
        sinon.stub(wrapper.vm.request, 'termsUrl')
          .returns('https://test.com/terms')

        expect(wrapper.vm.assetTermsUrl).to.equal('https://test.com/terms')

        wrapper.vm.request.termsUrl.restore()
      })
    })
  })
})
