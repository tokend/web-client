import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { UpdateAssetRequestsModule } from '@/vue/modules/requests/update-asset-requests/module'

export class AssetUpdateRequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/AssetUpdateRequests'),
      allowedSubmodules: [
        UpdateAssetRequestsModule,
      ],
    })
  }
}
