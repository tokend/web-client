import _cloneDeep from 'lodash/cloneDeep'
import { ModuleDescriptor } from './module-descriptor'

export class PageModule extends ModuleDescriptor {
  /**
   * @param {Object} pageOpts
   * @param {Object} pageOpts.routerEntry
   * Vue router entry.
   *
   * @param {String} [pageOpts.menuButtonTranslationId]
   * Menu button translation ID. The button wont be rendered if no translation
   * ID provided.
   *
   * @param {String} [pageOpts.menuButtonMdiName]
   * Name of the icon to be used in sidebar. Should be kebab-cased.
   *
   * @param {String} [pageOpts.menuSectionTranslationId]
   * All the menu items with the same value of menuSectionTranslationId will be
   * rendered as a group in the Sidebar. If the argument is omitted, the menu
   * item will be rendered in default section with no label.
   *
   * @param {Boolean} [isCorporateOnly]
   * If `true` only corporate accounts can access the page
   *
   * @param {Object} moduleOpts @link ModuleDescriptor
   */
  constructor (pageOpts = {}, moduleOpts = {}) {
    super(moduleOpts)
    this._routerEntry = {}
    this._menuButtonTranslationId = pageOpts.menuButtonTranslationId || ''
    this._menuButtonMdiName = pageOpts.menuButtonMdiName || ''
    this._menuSectionTranslationId = pageOpts.menuSectionTranslationId || ''
    this._isCorporateOnly = pageOpts.isCorporateOnly || false

    this._parseRouterEntry(pageOpts)
  }

  get routerEntry () { return _cloneDeep(this._routerEntry) }
  get menuButtonTranslationId () { return this._menuButtonTranslationId }
  get menuButtonMdiName () { return this._menuButtonMdiName }
  get menuSectionTranslationId () { return this._menuSectionTranslationId }
  get isCorporateOnly () { return this._isCorporateOnly }

  _parseRouterEntry (pageOpts = {}) {
    if (!pageOpts.routerEntry) {
      throw new Error(`${this.constructor.name}: no pageOpts.routerEntry provided!`)
    }

    const entry = _cloneDeep(pageOpts.routerEntry)
    entry.component = this.importComponent
    entry.meta.pageModule = this
    this._routerEntry = entry
  }
}
