import { i18n } from './index.js'

export default {
  name: 'i18n',

  functional: true,

  props: {
    tag: { type: String, default: '' },
    path: { type: String, required: true },
  },

  render (createElement, { data, props, slots }) {
    const slotFns = slots()
    const children = translateToVNodes(props.path, slotFns)

    const tag = props.tag || 'span'
    return tag ? createElement(tag, data, children) : children
  },
}

function translateToVNodes (path, slots) {
  const fakeInterpolationParams = {}
  for (const key of Object.keys(slots)) {
    fakeInterpolationParams[key] = `{{${key}}}`
  }
  const translated = i18n.t(path, fakeInterpolationParams)
  const parts = translated.split(/(?={{.*?}})|(?<={{.*?}})/)

  return concatAll(parts.map(el => {
    const tokenName = extractTokenName(el)
    if (!tokenName) return el

    return slots[tokenName]
  }))
}

function extractTokenName (str) {
  const matched = /^{{(.*?)}}$/.exec(str)
  if (!matched) return ''
  return matched[1]
}

function concatAll (arr) {
  return [].concat(...arr)
}
