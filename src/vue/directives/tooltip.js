import { globalize } from '@/vue/filters/globalize'

const COLOR_BLUE = '#3a4180'
const COLOR_WHITE = '#FFF'
let tooltipText
let tooltipWrapper
let width
let height

function alignTooltip (e) {
  const twRect = tooltipWrapper.getBoundingClientRect()
  const target = e.target ? e.target : e
  const rect = target.getBoundingClientRect()

  if (twRect.left < 0) {
    tooltipWrapper.style.left = '50%'
    tooltipWrapper.style.marginLeft = '-' + (twRect.width / 4) + 'px'
  }
  if (twRect.right > window.innerWidth) {
    tooltipWrapper.style.right = '50%'
    tooltipWrapper.style.marginRight = '-' + (twRect.width / 4) + 'px'
  }
  if (twRect.width > window.innerWidth) {
    tooltipWrapper.style.margin = 'auto'
    tooltipWrapper.style.width = window.innerWidth + 'px'
    tooltipWrapper.style.left = (0 - rect.left) + 'px'
  }
}

function getPositionStyle (binding) {
  if (binding.value.position) {
    switch (binding.value.position) {
      case 'top':
        return {
          bottom: height,
          margin: '0 0 8px 0',
        }
      case 'bottom':
        return {
          top: height,
          margin: '8px 0 0 0',
        }
    }
  } else {
    return {
      top: height,
      margin: '8px 0 0 0',
    }
  }
}

function renderTooltip (e, binding) {
  const target = e.target ? e.target : e
  const rect = target.getBoundingClientRect()
  width = rect.width
  height = rect.height

  tooltipWrapper = document.createElement('div')
  tooltipText = document.createElement('div')

  tooltipWrapper.appendChild(tooltipText)
  target.appendChild(tooltipWrapper)

  const positionStyle = getPositionStyle(binding)

  tooltipWrapper.className = 'tooltip-wrapper'
  tooltipWrapper.style.position = 'absolute'
  tooltipWrapper.style.margin = positionStyle.margin
  tooltipWrapper.style.width = (binding.value.width || width) + 'px'
  // tooltipWrapper.style.height = height + 'px'
  // tooltipWrapper.style.minWidth = width + 'px'
  tooltipWrapper.style.overflow = 'hidden'
  tooltipWrapper.style.pointerEvents = 'none'
  tooltipWrapper.style.top = positionStyle.top + 'px'
  tooltipWrapper.style.right = positionStyle.right + 'px'
  tooltipWrapper.style.bottom = positionStyle.bottom + 'px'
  tooltipWrapper.style.left = positionStyle.left + 'px'
  tooltipWrapper.style.backgroundColor = binding.value.color || COLOR_WHITE
  tooltipWrapper.style.display = 'flex'
  tooltipWrapper.style.justifyContent = 'center'
  tooltipWrapper.style.alignItems = 'center'
  tooltipWrapper.style.padding = '8px'
  tooltipWrapper.style.border = `1px solid ${COLOR_BLUE}`
  tooltipWrapper.style.zIndex = '120'

  tooltipText.innerText = globalize(binding.value.text)
  // tooltipText.style.wordBreak = 'break-all'
  tooltipText.style.color = binding.value.textColor || COLOR_BLUE

  alignTooltip(target)
  if (target.style.position !== 'relative') {
    target.style.position = 'relative'
  }
}

export const tooltip = (() => {
  let resizeHandler = null
  return {
    bind (el, binding) {
      resizeHandler = alignTooltip.bind(null, el)
      el.addEventListener('mouseover', (e) => {
        renderTooltip(e, binding)
        window.addEventListener('resize', resizeHandler)
      })
      el.addEventListener('mouseout', (e) => {
        tooltipWrapper.parentNode.removeChild(tooltipWrapper)
        window.removeEventListener('resize', resizeHandler)
      })
    },

    unbind (el) {
      el.removeEventListener('mouseover', renderTooltip)
      window.removeEventListener('resize', resizeHandler)
    },
  }
})()
