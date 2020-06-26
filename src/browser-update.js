import VueBrowserUpdate from 'vue-browserupdate'

/**
 * See more on configuration:
 * http://browser-update.org/customize.html
 *
 * or here:
 * https://github.com/browser-update/browser-update/wiki/Details-on-configuration
 */

export function useBrowserUpdateBanner (vue) {
  vue.use(VueBrowserUpdate, {
    options: {
      required: {
        e: 16, // edge
        f: 54, // firefox
        o: 44, // opera
        s: 10.1, // safari
        ios: 10.3, // safari on ios
        c: 58, // chrome
      },
      insecure: true,
      unsupported: true,
    },
  })
}
