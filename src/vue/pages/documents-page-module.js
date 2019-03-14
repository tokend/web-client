import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { DocumentExplorerPageModule } from './document-explorer-page-module'
import { DocumentManagerPageModule } from './document-manager-page-module'

export class DocumentsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Documents'),
      importStoreFn: async _ => {
        const { documentSignersManager: res } =
          await import('@/vue/modules/documents/document-manager/modules/signers-manager/store')
        return res
      },
      allowedSubmodules: [
        DocumentExplorerPageModule,
        DocumentManagerPageModule,
      ],
    })
  }
}
