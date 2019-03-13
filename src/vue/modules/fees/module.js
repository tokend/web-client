import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class FeesModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/fees'),
      importStoreFn: async _ => {
        const { feesModule: res } = await import('@/vue/modules/fees/store')
        return res
      },
      ...opts,
    })
  }
}
