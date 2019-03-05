import { issuanceExplorerModule } from './index'
import { types } from './types'

describe('issuance explorer module types unit tests', () => {
  const getModuleKeys = (module) => {
    return Object.keys({
      ...module.actions,
      ...module.mutations,
      ...module.getters,
    })
  }

  it('every entity in module should be mentioned in vuex-types', () => {
    for (const key of getModuleKeys(issuanceExplorerModule)) {
      expect(types).to.have.property(key)
    }
  })

  it('every key described in vuex-types should be a real vuex-entity', () => {
    const moduleKeys = [
      ...getModuleKeys(issuanceExplorerModule),
    ]

    for (const key of Object.keys(types)) {
      expect(moduleKeys).to.include(key)
    }
  })

  it('every key described in vuex-types should be equal to its value', () => {
    for (const [key, value] of Object.entries(types)) {
      expect(key).to.equal(value)
    }
  })
})
