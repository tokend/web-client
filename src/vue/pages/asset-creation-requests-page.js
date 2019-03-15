import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { AssetCreationRequestsModule } from '@/vue/modules/requests/asset-creation-requests/module'

export class AssetCreationRequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/AssetCreationRequests'),
      allowedSubmodules: [
        AssetCreationRequestsModule,
      ],
    })
  }
}
