import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class DividendFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/dividend-form'),
      importStoreFn: async _ => {
        const { dividendFormModule } = await import(
          '@/vue/modules/dividend-form/store'
        )
        return dividendFormModule
      },
      ...opts,
    })
  }
}
