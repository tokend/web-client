## Usage
Imagine You got the Dashboard and Movements pages. Both of them has History
module but Dashboard also has SendTransfer module.

1. Create descriptions of the HistoryList and SendTransfer

```js
// history-module.js
import { ModuleDescriptor } from '.../module-descriptor.js'

export class History extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponent: _ => import('.../history/component.vue'),
      importStore: _ => import('.../history/store/index.js'),
    })
  }
}
```

```js
// send-transfer-module.js
import { ModuleDescriptor } from '.../module-descriptor.js'
import { History } from '.../history-module.js'

export class SendTransfer extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponent: _ => import('.../send-transfer/component.vue'),
      importStore: _ => import('.../send-transfer/store/index.js'),
      dependencies: [
        History,
        // Scheme will throw an error if any dependency absent in the
        // result cache
      ]
    })
  }
}
```

2. Create page module descriptions of the Dashboard and Movements pages

```js
// dashboard-page-module.js
import { PageModuleDescriptor } from '.../page-module.js'
import { SendTransfer } from '.../send-transfer-module.js'
import { History } from '.../history-module.js'

export class DashboardPage extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponent: _ => import('.../pages/dashboard.vue'),
      allowedSubmodules: [
        History,
        SendTransfer,
        // Scheme will throw an error if any submodule that doesn’t exist in
        // the current list provided
      ],
    })
  }
}
```

```js
// movements-page-module.js
import { PageModuleDescriptor } from '.../page-module.js'
import { History } from '.../history-module.js'

export class MovementsPage extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponent: _ => import('.../pages/movements.vue'),
      allowedSubmodules: [
        History,
        // Scheme will throw an error if any submodule that doesn’t exist in
        // the current list provided
      ],
    })
  }
}
```

3. Add them to the scheme you wanna use. For the current example we gonna make
`payments` scheme.

You do not need to change router, vuex/store and sidebar files anymore. All the
pages provided to the scheme are inserted in the needed places automatically.
The order in the ModuleScheme matters, also it has some render-specific keys:
- menuButtonMdiName - Icon of the button to be rendered in the Sidebar
- menuButtonTranslationId - Translation ID of the button to be used
- menuSectionTranslationId - Translation ID of the section. All the buttons with
  the same section translation ID will be grouped into this section. If no
  section provided, the button will be rendered in the default section with no
  section label.

```js
// schemes/payments.js
import { ModuleScheme } from '@/modules-arch/module-scheme'

import { DashboardPage } from '.../dashboard-page-module.js'
import { MovementsPage } from '...movements-page-module.js'

import { SendTransfer } from '.../send-transfer-module.js'
import { History } from '.../history-module.js'

export default new ModuleScheme({
  pages: [
    new DashboardPage(
      {
        // vue-router entry
        routerEntry: {
          path: '/dashboard',
          name: 'app.dashboard',
        },

        // Translation ID of the button being rendered in the sidebar
        menuButtonTranslationId: 'pages-names.dashboard',

        // Material design icon name to be rendered next to the button
        menuButtonMdiName: 'view-dashboard',

        // Submodules
        submodules: [
          new SendTransfer({
            // Now only corporate accounts will see all the elements related to
            // this module. This flag could be provided to the page too.
            isCorporateOnly: true
          })
          new History(),
        ],
      },
    ),
    new MovementsPage(
      {
        routerEntry: {
          path: '/movements',
          name: 'app.movements',
        },
        menuButtonTranslationId: 'pages-names.movements',
        menuButtonMdiName: 'menu',
        submodules: [
          new History(),
        ],
      },
    ),
  ],
})

```

4. Ensure the needed scheme included

```js
// scheme-registry.js

/* ... */

const SCHEME_IMPORTERS = {
  payments: _ => import('.../schemes/payments'),
}

/* ... */
```

```js
// main.js

import { SchemeRegistry } from '.../scheme-registry.js'

/* ... */
async function init () {
  await SchemeRegistry.useScheme('payments')

  /* ... */
}

init ()
```

5. Within the template you can now check whether the submodule included.

```vue
// pages/dashboard.vue

<template>
  <submodule-importer
    v-if="getModule().canRenderSubmodule(History)"
    :submodule="getModule().getSubmodule(History)"
    :asset-code="assetCode"
    :config="{ horizonURL: config.HORIZON_SERVER }"
    :wallet="wallet"
  />
</template>

<script>
import History from '.../history-module.js'
import SubmoduleImporter from '@/modules-arch/submodule-importer'

export default {
  components: {
    SubmoduleImporter,
  },

  data () {
    return {
      History
    }
  },
}
</script>
```


NOTES:
1. Currently you cannot use two submodules with the same constructors
submodules
