import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class PollsListOwnedPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/PollsAll'),
    })
  }
}
