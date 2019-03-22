import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class DocumentManagerPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/DocumentManager'),
      allowedSubmodules: [
        // TODO: fill with submodules
      ],
    })
  }
}
