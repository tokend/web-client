import { globalize } from '@/vue/filters/globalize'

export const tooltip = (() => {
  const COLOR_BLUE = '#3a4180'
  const COLOR_WHITE = '#FFF'
  const MARGIN_SIZE = 8
  let tooltipText
  let tooltipWrapper
  let targetWidth
  let targetHeight
  let twRect
  let target
  let targetRect
  let position
  // let resizeHandler = null

  function alignTooltip (e) {
    // if you need resize handler, uncomment 2 lines below
    // const target = e.target ? e.target : e
    // const targetRect = target.getBoundingClientRect()
    let spaceToRight = window.innerWidth - (targetRect.left + targetRect.width)
    let rectHeight = tooltipWrapper.offsetHeight + MARGIN_SIZE
    let spaceToBottom = window.innerHeight -
      tooltipWrapper.offsetTop + tooltipWrapper.offsetHeight

    // check if there is enough space for tw on left side
    if (twRect.width > targetRect.left) {
      tooltipWrapper.style.top = targetRect.height + MARGIN_SIZE + 'px'
      tooltipWrapper.style.left = (0 - targetRect.left) + (2 * MARGIN_SIZE) + 'px'
    }
    // check if there is enough space for tw on right side
    if (twRect.width > spaceToRight &&
      (position !== 'top' && position !== 'bottom')) {
      tooltipWrapper.style.top = targetRect.height + MARGIN_SIZE + 'px'
      tooltipWrapper.style.right = (0 - targetRect.right) + (2 * MARGIN_SIZE) + 'px'
    }

    // check if there is enough space for tw on top side
    if (rectHeight > targetRect.top && position === 'top') {
      tooltipWrapper.style.bottom = -rectHeight + 'px'
    }

    // check if there is enough space for tw on bottom side
    if (rectHeight < spaceToBottom && position === 'bottom') {
      tooltipWrapper.style.top = -rectHeight + 'px'
    }

    // check if tw overflows left side
    if (twRect.left < 0) {
      tooltipWrapper.style.left = '50%'
      tooltipWrapper.style.marginLeft = '-' + (twRect.width / 4) + 'px'
    }
    // check if tw overflows right side
    if (twRect.right > window.innerWidth) {
      tooltipWrapper.style.right = '50%'
      tooltipWrapper.style.marginRight = '-' + (twRect.width / 4) + 'px'
    }
    // check if tw width wider than window
    if (twRect.width > window.innerWidth) {
      tooltipWrapper.style.margin = '0'
      tooltipWrapper.style.width = window.innerWidth + 'px'
      tooltipWrapper.style.left = (0 - targetRect.left) + 'px'
    }
  }

  function getPositionStyle (twRect) {
    let positionStyle
    switch (position) {
      case 'top':
        positionStyle = {
          bottom: targetHeight + MARGIN_SIZE,
        }
        break
      case 'right':
        positionStyle = {
          top: '0',
          right: 0 - twRect.width - MARGIN_SIZE,
        }
        break
      case 'left':
        positionStyle = {
          top: '0',
          left: 0 - twRect.width - MARGIN_SIZE,
        }
        break
      case 'bottom':
      default:
        positionStyle = {
          top: targetHeight + MARGIN_SIZE,
        }
        break
    }
    return positionStyle
  }

  function renderTooltip (e, binding) {
    target = e.target ? e.target : e
    targetRect = target.getBoundingClientRect()
    targetWidth = targetRect.width
    targetHeight = targetRect.height
    position = binding.value.position

    tooltipWrapper = document.createElement('div')
    tooltipText = document.createElement('div')
    const tri = document.createElement('div')

    tooltipWrapper.appendChild(tooltipText)
    tooltipWrapper.appendChild(tri)
    target.appendChild(tooltipWrapper)

    tooltipWrapper.className = 'tooltip-wrapper'
    tooltipWrapper.style.position = 'absolute'
    tooltipWrapper.style.width = (binding.value.width || targetWidth) + 'px'

    twRect = tooltipWrapper.getBoundingClientRect()
    const positionStyle = getPositionStyle(twRect)

    tooltipWrapper.style.overflow = 'hidden'
    tooltipWrapper.style.pointerEvents = 'none'
    tooltipWrapper.style.top = positionStyle.top + 'px'
    tooltipWrapper.style.right = positionStyle.right + 'px'
    tooltipWrapper.style.bottom = positionStyle.bottom + 'px'
    tooltipWrapper.style.left = positionStyle.left + 'px'
    tooltipWrapper.style.backgroundColor = binding.value.bgcolor || COLOR_WHITE
    tooltipWrapper.style.display = 'flex'
    tooltipWrapper.style.justifyContent = 'center'
    tooltipWrapper.style.alignItems = 'center'
    tooltipWrapper.style.padding = '8px'
    tooltipWrapper.style.border = `1px solid ${COLOR_BLUE}`
    tooltipWrapper.style.zIndex = '120'
    tooltipWrapper.style.transition = `all 500ms ease-in-out`
    tooltipWrapper.style.opacity = '0'
    tooltipWrapper.style.borderRadius = '8px'

    tooltipText.innerText = globalize(binding.value.text)
    tooltipText.style.color = binding.value.txtColor
    tooltipText.style.fontSize = '1.4rem'
    // tooltipText.style.wordBreak = 'break-all'
    tooltipText.style.color = binding.value.textColor || COLOR_BLUE

    tri.style.borderLeft = tri.style.borderRight = '4px solid transparent'
    tri.style.borderBottom = '4px solid #2f2f2f'
    tri.style.borderTop = '0'
    tri.style.borderRadius = '0'
    tri.style.position = 'absolute'

    alignTooltip(target)

    if (target.style.position !== 'relative') {
      target.style.position = 'relative'
    }

    setTimeout(() => {
      tooltipWrapper.style.opacity = '1'
    }, 0)
  }

  return {
    bind (el, binding) {
      // resizeHandler = alignTooltip.bind(null, el)
      el.addEventListener('mouseover', (e) => {
        renderTooltip(e, binding)
        // window.addEventListener('resize', resizeHandler)
      })

      // el.addEventListener('mousemove', (e) => {
      //   console.log(e.pageX)
      //   console.log(e.pageY)
      // })

      el.addEventListener('mouseout', (e) => {
        // tooltipWrapper.parentNode.removeChild(tooltipWrapper)
        // window.removeEventListener('resize', resizeHandler)
      })
    },

    unbind (el) {
      el.removeEventListener('mouseover', renderTooltip)
      // window.removeEventListener('resize', resizeHandler)
    },
  }
})()
