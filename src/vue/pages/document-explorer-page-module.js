import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class DocumentExplorerPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/DocumentExplorer'),
      allowedSubmodules: [
        // TODO: fill with submodules
      ],
    })
  }
}
