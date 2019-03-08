import { ClientModule } from '@/modules-arch/client-module'

export class FeesModule extends ClientModule {
  constructor (opts = {}) {
    super({
      componentPath: '@/vue/modules/fees/index.vue',
      storePath: '@/vue/modules/fees/store/index.js',
      ...opts,
    })
  }
}
