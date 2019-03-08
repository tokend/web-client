export class ModuleScheme {
  constructor (scheme) {
    this._raw = scheme

    this._cache = this._createCache(this._raw)
  }

  _createCache (scheme) {
    const allModules = this._extractFlattenModules(scheme.modules)
    const cache = this._filterUnique(allModules)
    const isValidSet = this._isValidModules([...cache])
    // eslint-disable-next-line no-console
    console.log(cache, isValidSet)
    return scheme
  }

  _filterUnique (modules) {
    return [...new Set(modules)]
  }

  _extractFlattenModules (modules = []) {
    const result = []
    for (const item of modules) {
      result.push(item.instance)
      if (item.submodules) {
        result.push(...this._extractFlattenModules(item.submodules))
      }
    }
    return result
  }

  _isValidModules (modules = []) {
    return modules.every(item => item.isCompatibleWithModules(modules))
  }
}
