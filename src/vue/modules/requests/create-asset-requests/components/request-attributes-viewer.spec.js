import RequestAttributesViewer from './request-attributes-viewer'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import * as Config from '../_config'

const localVue = createLocalVue()

describe('Create asset request attributes viewer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RequestAttributesViewer, {
      localVue,
      propsData: { request: new CreateAssetRequest({}) },
    })
  })

  describe('computed property', () => {
    beforeEach(() => {
      Config.initConfig({
        horizonURL: 'https://horizon.com',
        storageURL: 'https://storage.com',
      })
    })

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
