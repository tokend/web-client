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

#### Do we need vuex all the time?

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
