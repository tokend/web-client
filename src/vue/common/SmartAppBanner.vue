<script>
import config from '@/config'
import { isAndroid, isIos } from '@/js/helpers/browser'
import { i18n } from '@/i18n'
import { globalize } from '@/vue/filters/globalize'

let SmartBanner

export default {
  name: 'smart-app-banner',

  data () {
    return {
      banner: {},
    }
  },

  computed: {
    isRendered () {
      const isConfigured = config.MOBILE_APP_NAME && config.MOBILE_APP_AUTHOR
      const isMobile = isAndroid() || isIos()
      return isConfigured && isMobile
    },
  },

  beforeDestroy () {
    this.destroyBanner()
  },

  methods: {
    async loadDependencies () {
      [{ default: SmartBanner }] = await Promise.all([
        import('smart-app-banner/dist/smart-app-banner.js'),
        import('smart-app-banner/dist/smart-app-banner.css'),
      ])
    },

    createBanner () {
      this.banner = new SmartBanner({
        daysHidden: 15,
        daysReminder: 90,
        appStoreLanguage: i18n.language,
        title: config.MOBILE_APP_NAME,
        author: config.MOBILE_APP_AUTHOR,
        button: globalize('smart-banner.open-store-btn'),
      })
    },

    destroyBanner () {
      document.querySelectorAll('.smartbanner').forEach(el => {
        el.parentNode.removeChild(el)
      })
      this.banner = {}
    },
  },

  async render (createElement) {
    if (!this.isRendered) return

    await this.loadDependencies()
    this.createBanner()

    return createElement()
  },

  head () {
    if (!this.isRendered) return

    const meta = []
    const link = []

    if (config.PLAY_MARKET_ID) {
      meta.push({ name: 'google-play-app', content: `app-id=${config.PLAY_MARKET_ID}` })
      link.push({ rel: 'android-touch-icon', href: config.PLAY_MARKET_ICON })
    }

    if (config.APP_STORE_ID) {
      meta.push({ name: 'apple-itunes-app', content: `app-id=${config.APP_STORE_ID}` })
      link.push({ rel: 'apple-touch-icon', href: config.APP_STORE_ICON })
    }

    return { meta, link }
  },
}
</script>

<style lang="scss">
.smartbanner {
  .smartbanner-info {
    & > span {
      display: none;
    }

    & > div:not(.smartbanner-title) {
      white-space: normal;
    }
  }
}
</style>
