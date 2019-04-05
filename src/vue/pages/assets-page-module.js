import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { CreateAssetFormModule } from '@modules/create-asset-form/module'

export class AssetsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Assets'),
      allowedSubmodules: [
        CreateAssetFormModule,
      ],
    })
  }
}
