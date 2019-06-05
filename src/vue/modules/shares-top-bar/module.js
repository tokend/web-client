import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class SharesTopBarModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/shares-top-bar'),
      importStoreFn: async _ => {
        const { SharesTopBarModule } = await import(
          '@/vue/modules/shares-top-bar/store'
        )
        return SharesTopBarModule
      },
      ...opts,
    })
  }
}
