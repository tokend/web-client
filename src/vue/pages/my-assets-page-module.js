import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { MyAssetsExplorerModule } from '@modules/assets/my-assets-explorer/module'

export class MyAssetsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/MyAssets'),
      allowedSubmodules: [
        MyAssetsExplorerModule,
      ],
    })
  }
}
