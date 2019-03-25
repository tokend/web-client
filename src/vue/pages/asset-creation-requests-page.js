import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { CreateAssetRequestsModule } from '@/vue/modules/requests/create-asset-requests/module'

export class AssetCreationRequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/AssetCreationRequests'),
      allowedSubmodules: [
        CreateAssetRequestsModule,
      ],
    })
  }
}
