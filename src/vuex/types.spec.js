import {
  vuexTypes,
  account,
  kyc,
  factors,
  wallet
} from './index'

describe('vuex types unit tests', () => {
  const getModuleKeys = (module) => {
    return Object.keys({
      ...module.actions,
      ...module.mutations,
      ...module.getters
    })
  }

  it('every entity in modules should be mentioned in vuex-types', () => {
    for (const key of getModuleKeys(account)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(kyc)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(factors)) {
      expect(vuexTypes).to.have.property(key)
    }
    for (const key of getModuleKeys(wallet)) {
      expect(vuexTypes).to.have.property(key)
    }
  })

  it('every key described in vuex-types should be a real vuex-entity', () => {
    const moduleKeys = [
      ...getModuleKeys(account),
      ...getModuleKeys(kyc),
      ...getModuleKeys(factors),
      ...getModuleKeys(wallet)
    ]

    for (const key of Object.keys(vuexTypes)) {
      expect(moduleKeys).to.include(key)
    }
  })

  it('every key described in vuex-types should be equal to it\'s value', () => {
    for (const [key, value] of Object.entries(vuexTypes)) {
      expect(key).to.equal(value)
    }
  })
})
