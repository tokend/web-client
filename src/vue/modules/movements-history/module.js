import { ClientModule } from '@/modules-arch/client-module'

export class MovementsHistoryModule extends ClientModule {
  constructor (opts = {}) {
    super({
      componentPath: '@/vue/modules/movements-history/index.vue',
      storePath: '@/vue/modules/movements-history/store/index.js',
      ...opts,
    })
  }
}
