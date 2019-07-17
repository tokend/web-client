import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class BusinessOwnershipModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/navigation/navbar/business-ownership/index.vue'),
      ...opts,
    })
  }
}
