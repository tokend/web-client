import _cloneDeep from 'lodash/cloneDeep'

export class ModuleScheme {
  constructor (scheme) {
    this._rawScheme = scheme
    this._pages = _cloneDeep(scheme.pages)

    // To validate the whole bunch of modules for compatibility
    this._cache = this._createCache()
    this._validateCache()
  }

  get pages () { return _cloneDeep(this._pages) }
  get cache () { return _cloneDeep(this._cache) }

  _createCache () {
    const cache = this._flattenDeep(this._rawScheme.pages)
    return cache
  }

  _validateCache () {
    for (const item of this._cache) {
      item.validateDependencies(this._cache)
      item.validateCompatibility(this._cache)
    }
  }

  _flattenDeep (modules = []) {
    const result = []
    for (const item of modules) {
      result.push(item)
      if (item.submodules) {
        result.push(...this._flattenDeep(item.submodules))
      }
    }
    return result
  }
}
