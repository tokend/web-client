import _cloneDeep from 'lodash/cloneDeep'
import { ErrorHandler } from '@/js/helpers/error-handler'

export class ModuleScheme {
  constructor (scheme) {
    this._raw = scheme
    this._pages = []

    // To validate the whole bunch of modules for compatibility
    this._cache = []

    this._init(this._raw)
  }

  get pages () { return _cloneDeep(this._pages) }

  async _init (scheme) {
    try {
      const cache = this._filterUnique(
        this._flattenConstructors(scheme.pages),
      )

      this._pages = _cloneDeep(scheme.pages)
      this._cache = cache
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  _filterUnique (...modules) {
    return [...new Set(modules)]
  }

  _flattenConstructors (modules = []) {
    const result = []
    for (const item of modules) {
      result.push(item.constructor)
      if (item.submodules) {
        result.push(...this._flattenConstructors(item.submodules))
      }
    }
    return result
  }
}
