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
Предназначен для формирования сложных запросов или же если вам нужно собирать тело запроса,
собирая данные из нескольких компонент.

Допустим у нас есть пошаговая форма, состоящая из нескольких компонент.
Наследуя супер класс [Former](./src/js/formers/Former.js), мы создаём свой `формер`
например [AssetFormer](./src/js/formers/AssetFormer.js)

Разберём сперва некоторые его методы:
1. начнём с `_defaultAttrs` - здесь объявляются все переменные, которые по итогу будут использоваться в запросах
2. `populate` - Если уже есть данные, и нужно предзаполнить формер, то мы передаём их через конструктор класса формера, который в свою очередь вызывает этот метод для заполнени. Чаще всего в конструктор формера передаётся какой-нибудь класс с данными, для заполнения. Поэтому внутри `populate` часто бывает switch, который следит за типом переданного объекта и назначает ему уже определённое поведение.
3. `buildOps`, `_buildOpCreate`, `_buildOpUpdate` - `buildOps` служит входной точкой при сборке запроса. Методы класса следят за тем, как был инициализирован формер, если он был создан на основе каких-нибудь данных, то `buildOps` будет принимать в себя `_buildOpUpdate` иначе же `_buildOpCreate`

В остальном же - это обычно вспомогательные методы, которые помогают определять какой тип запроса сейчас(создание или обновление), декомпозиция сложных запросов, чтобы не городить всё в одну функцию и так далее...

Есть и другие случаи использования формера, это необязательно должно быть только сборка запроса из нескольких компонент.
Вторым частым кейсом является построение сложного запроса, ведь
объявлять кучу методов внутри компоненты,
или же писать одну большую функцию является плохим тоном,
поэтому имеет смысл инкапсулировать это всё в отдельный класс,
в нашем случае это формер.

Пример использования

Перво наперво создадим формер

```javascript
export class SomeFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      firstName: '',
      lastName: '',
    }
  }

  _opBuilder = this._opBuilder || this._buildOpCreate

  get isCreateOpBuilder () { return this._opBuilder === this._buildOpCreate }
  get isUpdateOpBuilder () { return this._opBuilder === this._buildOpUpdate }
  useCreateOpBuilder () { this._opBuilder = this._buildOpCreate; return this }
  useUpdateOpBuilder () { this._opBuilder = this._buildOpUpdate; return this }

  async buildOps () {
    return this._opBuilder()
  }

  populate (source) {
    switch (source.constructor) {
      case SomeClassTypeFoo: this._populateFromFoo(source); break
      case SomeClassTypeBar: this._populateFromBar(source); break
      default: throw TypeError('Unknown source type')
    }
    return this
  }

  _populateFromFoo (source) {
      this.useUpdateOpBuilder()
      this.attrs.firstName = source.firstName
      this.attrs.lastName = source.lastName
  }

  _populateFromBar (source) {
    this.useUpdateOpBuilder()
    this.attrs.firstName = `${source.firstName} but with bar`
    this.attrs.lastName = `${source.lastName} but with bar`
  }

  _buildOpCreate () {
      return {
        type: 'create-request',
        attributes: {
            first_name: this.attrs.firstName,
            last_name: this.attrs.lastName,
        }
      }
  }

  _buildOpUpdate () {
    return {
      type: 'update-request',
      attributes: {
        first_name: this.attrs.firstName,
        last_name: this.attrs.lastName,
      }
    }
  }
}
```

Теперь у нас есть Формер, и если его инициализируют с данными, то вызовется populate,
затем обработается определённый случай соответствующий типу пришедших данных.
Например `_populateFromFoo`, и внутри, сначала вызовется `this.useUpdateOpBuilder()`
Который скажет формеру ипользовать `_buildOpUpdate`, а потом уже заполняться поля формера.
Иначе же, будет использоваться `_buildOpCreate`, а все данные будут заполняться с нуля.

### Теперь рассмотрим применение

Допустим у нас есть пошаговая форма FormStepper,
вдаваться в принцип его работы мы не будем,
просто представьте, что внутри можно переключаться между шагами заполнения полей.

Для начала, нам нужно инициализировать экземпляр формера в родительском классе.
Затем через пропсу передать формер в каждый компонент формы

```vue
<template>
  <div class="some-component">
    <form-stepper class="some-component__form-stepper">
      <step>
        <some-form
          :former="former"
        />
      </step>
      <step>
        <some-form
          :former="former"
        />
      </step>
      <step>
        <some-form
          :former="former"
        />
      </step>
    </form-stepper>
  </div>
</template>
<script>
import SomeFormer from '@/js/former/SomeFormer.js'

export default {
  name: 'some-component',
  data () {
    return {
      former: new SomeFormer(),
    }
  },
}
</script>
```

Таким образом, у нас есть экземпляр класса, в родительской компоненте,
и у нас будет доступ к ней во всех дочерних компонентах, в которые мы передали формер,
что позволит нам заполнять поля для создания запроса.

Пример заполнения формера

```vue

<template>
  <form
    class="some-component"
    @submit.prevent="submit"
  >
    <input
      type="text"
      v-model="form.firstName"
      @input="former.setAttr('firstName', this.form.firstName)"
    >
    <input
      type="text"
      v-model="form.lastName"
      @input="former.setAttr('firstName', this.form.lastName)"
    >
  </form>
</template>
<script>
import SomeFormer from '@/js/former/SomeFormer.js'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'

export default {
  name: 'some-component',
  props: {
    former: {
      type: SomeFormer,
      default: () => new SomeFormer(),
    },
  },
  data () {
    return {
      form: {
        firstName: this.former.attrs.firstName,
        lastName: this.former.attrs.lastName,
      },
    }
  },
  methods: {
    async submit () {
      try {
        const buildedOp = this.former.buildOps()
        await api.post('/some/endpoint', buildedOp)
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
  },
}
</script>
```

В пропсах мы объявляем, что ожидаем `former`, с типом SomeFormer,
и если его не будет, просто возвращаем новый экземпляр формера.

Таким образом мы можем обработать оба случая - когда требуется создать запрос с нуля,
или же на основе существующих данных.

Внутри `data` мы объявляем поля формы, и предзаполняем их полями формера, на случай,
если нам пришёл всё таки заполненный формер. Если же нет, то `firstName` и `lastName`
инициализируются со значениями, которые были объявлены внутри `_defaultAttrs` формера,
другими словами "дефолтными значениями".

Теперь, внутри `<templates></templates>` на элементах инпута, при вводе данных,
мы будем вызывать метод `former.setAttr`, и передавать туда наши данные из data,
которые двусторонне связаны с текущими элементами ввода.

`former.setAttr` - первым параметром, мы передаём строку, которая указывает,
какой из полей формера мы хотим заполнить, а вторым параметром передаём значение.
Так и заполняется формер.

В конце, после заполнения нужных полей, мы можем инициализировать сборку запроса,
например в форме `this.former.buildOps()` и после этого послать запрос.

Как итог мы получаем инкапсулированную функциональность,
с помощью которой можно удобно контролировать сборку запросов
не нагромождая код внутри компоненты.

## BEM
Внутри проекта обязательно нужно соблюдать [BEM](https://ru.bem.info/methodology/)

Пример:
```vue
<template>
  <div class="some-component">
    <h1 class="some-component__title">
      {{ 'some-component.title' | globalize }}
    </h1>
    <div class="some-component__content-wrapper">
      <div class="some-component__content">
        <app-sidebar class="some-component__sidebar" />
        <main class="some-component__main">
          <app-navbar class="some-component__navbar" />
          <div
            class="some-component__main-content"
            :class="{
              'some-component__main-content--darked': theme === THEMES.dark,
              'some-component__main-content--lighted': theme === THEMES.light,
            }"
          >
            <router-view />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
const THEMES = {
  dark: 'dark',
  light: 'light',
}

export default {
  name: 'some-component',
  props: {
    theme: {
      type: String,
      default: THEMES.light,
    },
  },
  data () {
    return {
      THEMES,
    }
  },
}
</script>

<style lang="scss">
.some-component {}

.some-component__title {

  &:hover {}

  &:before {}

  &:after {}
}

.some-component__content-wrapper {}

.some-component__content {

  &--darked {}

  &--lighted {}
}

.some-component__sidebar {}

.some-component__main {}

.some-component__navbar {}

.some-component__main-content {}
</style>
```

В целом, это стандартная реализация методологии BEM, но обратите внимание,
что все классы, помимо модификаций, описаны здесь отдельно.
Это сделано в основном для удобства чтения и быстрой навигации по проекту.

Другими словами

НЕПРАВИЛЬНО
```scss
.some-component__main {

  &-content {}
}
```

ПРАВИЛЬНО
```scss
.some-component__main {}

.some-component__main-content {}
```

## Default "*Loading Data*" schema
Для всех компонент, в которых надо делать запросы на получение данных
используется, уже стандартная для нас, схема построения компоненты.

```vue

<template>
  <div class="some-component">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'some-component.loading-error-msg' | globalize"
        />
      </template>
      <template v-else>
        {{ someData }}
      </template>
    </template>
    <template>
      <loader/>
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'

import { SomeClassRecord } from '@/js/records/entities/some-class.record'
import { ErrorHandler } from 'error-handler'
import { api } from '@/api'

export default {
  components: { Loader },
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      someData: {},
    }
  },
  async created () {
    try {
      await this.loadList()
    } catch (error) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
    this.isLoaded = true
  },
  methods: {
    async loadList () {
      const endpoint = '/some-endpoint/to-take-data'
      const { data } = await api.get(endpoint)
      this.someData = new SomeClassRecord(data)
    },
  },
}
</script>
```

##### Начнём по порядку
Сперва нужно объявить 2 переменные - `isLoaded` и `isLoadFailed`.
Они служат для того, чтобы показать пользователю,
что в данный момент происходит на странице.
Ну, и собственно `someData` для хранения полученных данных.

##### Далее разберём уже сам процесс загрузки
Самое важное - это использовать try-catch, ведь мы никогда не знаем заранее,
как ответит сервер, поэтому нужно обработать все варианты.

Ну, и, понятное дело делаем запрос внутри `try` блока, но что интереснее,
это блок `catch`, вы наверняка увидели там класс [ErrorHandler](./src/js/helpers/error-handler.js)
вызывающий статический метод `processWithoutFeedback`.

Немного про класс [ErrorHandler](./src/js/helpers/error-handler.js) - он предназначен для того, чтобы следить за
ошибками и выводить их. Внутри класса, мы следим, какой тип ошибки к нам приходит.
И через switch выводим соответствующее сообщение.
в 99% случаев, всё что нужно - это использовать методы `process` и `processWithoutFeedback`

`process` - используя кастомную класс - обёртку [Bus](./src/js/helpers/event-bus.js)([подробнее](https://v3.vuejs.org/guide/migration/events-api.html#overview)),
показывает всплывающее сообщение([нотификацию](./src/vue/common/StatusMessage.vue)) в углу экрана.

`processWithoutFeedback` - только выводит в консоль

Логично предположить, что например в коде выше, с описанной дефолтной структурой загрузки данных,
которая при `isLoadFailed = true` рендерит `<error-message />`, использовать `process` нет смысла,
ведь сообщение об ошибке уже выведено. Более правильным там будет использовать `processWithoutFeedback`.

А вот например при запросах на отправку данных

Пример:
```javascript
async function sendRequest () {
    try {
      await api.post('/some/endpoint', {
        data: {
          congratulation: 'say hello',
        },
      })
    } catch (error) {
        ErrorHandler.process(error)
    }
}
```

Более целесообразным будет использовать `process`,
ведь при ошибке надо показать пользователю, что произошло.

Далее, немного о строке `this.someData = new SomeClassRecord(data)`

Так как в JS нет строгой типизации - данный подход служит её замене.
С сервера мы получаем ком каких-то данных, и безусловно, если есть документация и мы её прочли,
то понимаем какие данные придут и можем к ним сразу обратиться. Но стоит помнить,
что на проекте может быть не один человек, и не все могут знать таких нюансов.
Поэтому в [Рекордах](./src/js/records) мы создаём классы, которые получают этот самый ком данных,
и возвращают экземпляр данных с явно обозначенными полями.

Пример
```javascript
import _get from 'lodash/get'

export class SomeClassRecord {
    constructor(record) {
        this._record = record

        this.id = record.id
        this.someSpecialData = _get(record, 'some.special.data', '')
    }
}
```

Если вы понимаете, что данные, которые вам нужны, имеют большую вложенность - `this.someSpecialData = _get(record, 'some.special.data', '')`
то правильным будет использовать [lodash/get](https://lodash.com/docs/4.17.15#get)

Таким образом, если по этому пути ничего не нашло, то нам вернётся дефолтное значение - то, что указано третьим параметром.
Если же оно не указано, вернётся `undefined`

## CollectionLoader
Продолжая тему загрузки данных, что если нужно получить список.

Сперва повторим нашу дефолтную структуру, но с некоторыми дополнениями

```vue

<template>
  <div class="some-component">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'some-component.loading-error-msg' | globalize"
        />
      </template>
      <template v-else>
        <template v-if="list.length">
          <div class="some-component__list">
            <div
              class="some-component__item"
              v-for="item in list"
              :key="item.id"
            >
              {{ item }}
            </div>
          </div>
        </template>
        <template v-else>
          <no-data-message
            :message="'some-component.no-data-msg' | globalize"
          />
        </template>
      </template>
    </template>
    <template v-else>
      <loader/>
    </template>
    <collection-loader
      v-show="list.length"
      :first-page-loader="loadList"
      @first-page-load="setList"
      @next-page-load="concatList"
    />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'
import CollectionLoader from '@/vue/common/CollectionLoader'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { SomeClassRecord } from '@/js/record/entities/some-class.record'
import { api } from '@/api'

export default {
  components: {
    CollectionLoader,
    Loader,
    NoDataMessage
  },
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      list: [],
    }
  },
  methods: {
    async loadList () {
      let response
      try {
        response = await api.get('/some/data', {
          filter: {
            order: 'desc',
          }
        })
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isLoaded = true
      return response
    },
    setList (data) {
      this.list = data.map(el => new SomeClassRecord(el))
    },
    concatList (chunk) {
      this.list = this.list.concat(
        chunk.map(el => new SomeClassRecord(el))
      )
    },
  },
}
</script>
```

Для начала мы добавили ещё одну проверку, когда `isLoadFailed = false`
внутри `v-else` мы проверяем на наличие элементов в массиве.
Если есть, то отображаем список, если нет - то отображаем специальный компонент
`<no-data-message />`

Теперь о загрузке данных - как видно из кода, мы добавили компонент `<collection-loader />`
Он предназначен для загрузки списка частями. Другими словами - некая пагинация.

Использовать его легко - должны быть три функции:
1. `loadList` - получает данные и возвращает их
2. `setList` - Присваивает нашему массиву `list` данные, которые пришли из `loadList` (в основном, этот метод предназначен для типизации полученных данных)
3. `concatList` - Если `loadList` и `setList` это загрузка и присваивание первых n-количества элементов списка, то этот метод догружает ровно такое же количество не перезагружая при этом весь список.

После создания всех этих методов, мы просто их прокидываем через `props` и `events` в `<collection-loader />` и получаем рабочий загрузчик.

### P. S.
Бывают моменты, когда нужно загрузить сразу весь список
Для этого есть специальный метод - `loadAllResponsePages`

Пример:
```javascript
export async function loadAllList () {
    try {
        const response = await api.get('/some/data')
        const data = await loadAllResponsePages(response)
        return data.map(el => new SomeClassRecord(el))
    } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
    }
}
```

## Operations and Transactions

#### XDR

#### TokenD JS SDK

## Promise All

## Developer-edition
