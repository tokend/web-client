import _cloneDeep from 'lodash/cloneDeep'
import { ClientModule } from './client-module'

export class PageModule extends ClientModule {
  /**
   * @param {Object} pageOpts
   * @param {Object} routerEntry Vue router entry
   * @param {Object} moduleOpts @link ClientModule
   */
  constructor (pageOpts = {}, moduleOpts = {}) {
    super(moduleOpts)

    this._parsePageOpts(pageOpts)
  }

  get routerEntry () { return _cloneDeep(this._routerEntry) }

  _parsePageOpts (pageOpts = {}) {
    if (!pageOpts.routerEntry) {
      throw new Error(`${this.constructor.name}._parsePageOpts: no pageOpts.routerEntry provided!`)
    }

    const entry = _cloneDeep(pageOpts.routerEntry)
    entry.component = this.importComponent
    entry.meta.module = this
    this._routerEntry = entry
  }
}
