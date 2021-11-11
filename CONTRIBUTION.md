# Contribution guide

## Localization and Filters

### Localization
В проект интегрирована библиотека для локализации - i18next,
а так же i18next-browser-languagedetector для определения языка браузера.

Для взаимодействия с ней, в [главном файле инициализации i18next](./src/i18n/index.js) создан "класс обёртка" - I18n,
который получает [данные из json файлов](./src/i18n/resources),
парсит их и инициализирует экземпляр с определёнными опциями.

У класса есть метод `t (...args) {}`,
для его использования есть [функция](./src/vue/filters/globalize.js),
которая импортирована и инициализирована как фильтр в [main.js](./src/main.js).
Поэтому она будет доступна в любом `*.vue` файле, внутри `template`

А для использования в `*.js` файлах, или же внутри тега `script`,
можно её просто импортировать:
```javascript
import { globalize } from '@/vue/filters/globalize'

globalize('key.value-to-localize')
```

#### Example
##### en.json
```json
{
  "config": {},
  "translations": {
    "some-component": {
      "title": "This is a title",
      "subtitle": "This is a subtitle",
      "date-desc": "Hello, today is {{time}}"
    }
  }
}
```

##### SomeComponent.vue
```vue

<template>
  <div class="some-component">
    <h1 class="some-component__title">
      {{ 'some-component.title' | globalize }}
    </h1>
    <h2 class="some-component__subtitle">
      {{ subtitle }}
    </h2>
    <div class="some-component__content">
      <p class="some-component__date">
        {{ 'some-component.date-desc' | globalize({
          time: currentDate,
        }) }}
      </p>
    </div>
  </div>
</template>

<script>
import { globalize } from '@/vue/filters/globalize'

export default {
  name: 'some-component',
  computed: {
    subtitle () {
      return globalize('some-component.subtitle')
    },
    currentDate () {
      return Date.now()
    },
  },
}
</script>
```
1. Как видно на примере, ключ для локализации обязательно должен совпадать с именем компоненты
2. называть ключ обязательно в kebab-case
3. Все ключи, которые касаются локализации в компонентах, должны быть расположены в соответствующем `*.json` файле языка внутри `"translations": {}"`

### Filters
Когда нам нужно обработать и отобразить приходящие или статические данные в нескольких компонентах,
или же когда предполагается, что так будет, рекомендуется создать собственный фильтр.
Например, для работы с числами, или же для форматирования суммы и валюты, уже есть готовые функции:
1. formatMoney - принимает в себя объект `{ value, currency }`, где value - это число, а currency это код [актива](./src/js/records/entities/asset.record.js)(`asset.code`)
2. formatDate - форматирует переданную дату, которая обрабатывается и возвращается в нужном формате.

Эти и многие другие фильтры импортируются и инициализируются в [main.js](./src/main.js)
```javascript

import { globalize } from '@/vue/filters/globalize'
import { formatMoney } from '@/vue/filters/formatMoney'
import { formatDate } from '@/vue/filters/formatDate'

Vue.filter('globalize', globalize)
Vue.filter('formatDate', formatDate)
Vue.filter('formatMoney', formatMoney)
```

После чего они будут доступны в любом `<template></template>` в файлах `*.vue`
или же для импорта и использования в `*.js` файлах или в `<script></script>` теге файлов `*.vue`

Давайте рассмотрим функцию `formatDate`
```javascript
import { globalize } from './globalize'

export function formatDate (value) {
  return globalize('formats.date', { value })
}
```

Как уже писалось выше, эта функция форматирует дату, тогда почему же она использует функцию локализации?
Для того чтобы это понять, надо взглянуть на метод `_buildDefaultConfig` в [классе I18n](./src/i18n/index.js),
а конкретно на свойство `interpolation`, внутри него есть switch, в котором перечисленны несколько видов ключей локализации.
И когда I18n видит использование одного из этих ключей, она прогоняет переданные данные через соответствующий case.

##### Пример:
```javascript
{
  interpolation: {
    format: (param, format) => {
      const lngConfig = this._i18nextInstance
        .getResourceBundle(this.language, 'config')

      switch (format.toLowerCase()) {
        case 'date':
          return moment(param)
            .format(_get(lngConfig, 'date.presets.datetime'))
        default:
          console.warn(`Unknown format: ${format}, skipping…`)
          return param
      }
    }
  }
}
```
Для `formatDate` используется moment.js, который получает через параметры данные,
и используя строку, расположенную в [файлах локализации](./src/i18n/resources) возвращает соответствующий формат.

##### Пример:
```json
{
  "config": {
    "date": {
      "presets": {
        "time": "H:mm",
        "date": "MMMM D, YYYY",
        "datetime": "MMMM D, YYYY [at] H:mm",
        "dmy": "DD.MM.YYYY",
        "dmyt": "DD.MM.YYYY [at] H:mm"
      }
    }
  }
}
```

Поэтому, если нужно например, изменить формат даты, или формат вывода чисел,
стоит сперва определить:
1. Используется ли один из фильтров
2. Если да, то как он используется, прогоняется ли через i18n interpolations
3. Если да, можно попробовать сделать изменения там
4. Или же если изменения не столь критичны, может подобрать соответствующий формат в [файлах локализации](./src/i18n/resources)

Если же обработка данных не требует такой гибкости, можно обработать их и вернуть сразу из функции фильтра, как например [cropAddress](./src/vue/filters/cropAddress.js)
##### [Объявление](./src/vue/filters/cropAddress.js)
```javascript
export function cropAddress (value) {
  return `${value.slice(0, 4)}…${value.slice(-4)}`
}
```
##### инициализация [main.js](./src/main.js)
```javascript
import { cropAddress } from '@/vue/filters/cropAddress'

Vue.filter('cropAddress', cropAddress)
```
##### Использование
```vue
<template>
  {{ accountId | cropAddress }}
</template>
```

## Vuex
Используется для того, чтобы получать данные из общего хранилища данных,
когда требуется получать одни и те же данные в нескольких компонентах.

99% Данных, которые требуются для работы с TokenD уже реализованы
и рассортированы по [модулям](./src/vuex)

Все переменные, по-которым нужно будет обращаться за данными,
а так-же те, которые требуется добавить в vuex,
должны быть сперва объявлены в [vuexTypes](./src/vuex/types.js)
и уже потом реализованы в соответствующем модуле

пример:
```javascript
const mutations = {
    SET_ACCOUNT: 'SET_ACCOUNT',
}

const actions = {
    LOAD_ACCOUNT: 'LOAD_ACCOUNT',
}

const getters = {
    account: 'account',
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters,
}
```

```javascript
import { api } from '@/api'
import { vuexTypes } from './types'

export const state = {
  account: {},
}

export const mutations = {
  [vuexTypes.SET_ACCOUNT] (state, account) {
    state.account = account
  },
}

export const actions = {
  async [vuexTypes.LOAD_ACCOUNT] ({ commit }, accountId) {
    accountId = accountId || getCurrentAccId()
    const response = await api.getWithSignature(`/v3/accounts/${accountId}`, {
      include: ['external_system_ids', 'balances', 'balances.state', 'balances.asset'],
    })
    commit(vuexTypes.SET_ACCOUNT, response.data)
  },
}

export const getters = {
  [vuexTypes.account]: state => state.account,
}
```

Теперь по ним можно легко получать доступ из компонент
```vue

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { vuexTypes } from '@/vuex'


// Придерживайтесь определённых правил при получении данных из `mapGetters`,
// `mapActions`, а так же `mapMutations`.

export default {
  name: 'component',

  computed: {
    // Для `...mapGetters` объявляем массив, и перечисляем через vuexTypes нужные переменные
    ...mapGetters([
      vuexTypes.accountId,
    ])
  },
  methods: {
    // для `mapActions`, а так же `mapMutations` нужно в объекте объявлять ключ
    // чаще всего это просто camelCase взятой vuexTypes переменной
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),
    ...mapMutations({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),
  },
}
</script>
```

А так же из `*.js` файлов
```javascript
import { store, vuexTypes } from '@/vuex'

export function getAccountId () {
    return store.getters[vuexTypes.accountId]
}
```

Чтобы объявить новую переменную, стоит придерживаться некоторых правил,
в [vuexTypes](./src/vuex/types.js) названия всех переменных в `mutations` и `actions`,
должны быть в верхнем регистре, и в **`SNAKE_CASE`**,
рекомендуется так же соблюдать логику именования. Например если вы загружаете
данные аккаунта, то в `actions` нужно написать `LOAD_ACCOUNT`, а в mutations `SET_ACCOUNT`
В `getters` же, нужно писать через camelCase - `account`

Все переменные, которые объявлены в [vuexTypes](./src/vuex/types.js)
должны быть реализованы. За выполнением этого пункта следят тесты, поэтому сборка проекта
может завалиться если не выполнить требование

Так же, если вам нужно объявить новый модуль и подключить его,
то его так же нужно включить и в [unit-test](./src/vuex/types.spec.js)
проверяющий соответствие всех модулей

#### Do we need vuex all the time?

Vuex безусловно очень помогает в таких ситуациях,
когда нужно загрузить и получить данные в нескольких местах.

Но всегда ли он нам нужен?

Например, если вы знаете, что запрос на какие-то данные будет происходить единожды,
в какой-нибудь компоненте, нет смысла засорять vuex стору ненужными данными.

А так же стоит подумать, можно ли вынести запрос в [helpers](./src/js/helpers)
если вам всё же понадобиться вызывать запрос несколько раз.

Вопрос стоит в целях, если запрос должен быть гибким, и выдавать разную информацию
в зависимости от принимаемых параметров, то стоит создать функцию в [helpers](./src/js/helpers)

Чаще всего vuex используется для хранения более глобальных и неизменяемых данных,
например аккаунта, он ведь в системе один, или же `assets` они общие для всех пользователей.


## Formers

## BEM

## Default "*Loading Data*" schema
#### try-catch + ErrorHandler

## CollectionLoader

## Operations and Transactions

#### XDR

#### TokenD JS SDK

## Promise All

## Developer-edition
