import { globalize } from '@/vue/filters/globalize'

export const tooltip = (() => {
  const COLOR_BLUE = '#3a4180'
  const COLOR_BLACK = '#000'
  const MARGIN_SIZE = 8
  const DIRECTIONS = {
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
  }
  let tooltipText
  let tooltipWrapper
  let tooltipArrow
  let targetWidth
  let targetHeight
  let twRect
  let target
  let targetRect
  let tooltipArrowRect
  let position
  let currentPosition
  let bgColor
  let textColor
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

    if (twRect.width > targetRect.left && position !== DIRECTIONS.right) {
      tooltipWrapper.style.top = targetRect.height + MARGIN_SIZE + 'px'
      tooltipWrapper.style.left = (0 - targetRect.left) + (2 * MARGIN_SIZE) + 'px'
      currentPosition = DIRECTIONS.bottom
    }
    // check if there is enough space for tw on right side
    if (twRect.width > spaceToRight && position !== DIRECTIONS.left) {
      tooltipWrapper.style.top = targetRect.height + MARGIN_SIZE + 'px'
      tooltipWrapper.style.right = (0 - targetRect.right) + (2 * MARGIN_SIZE) + 'px'
      currentPosition = DIRECTIONS.bottom
    }

    // check if there is enough space for tw on top side
    if (rectHeight > targetRect.top) {
      tooltipWrapper.style.bottom = -rectHeight + 'px'
      currentPosition = DIRECTIONS.bottom
    }

    // check if there is enough space for tw on bottom side
    if (rectHeight > spaceToBottom) {
      tooltipWrapper.style.top = -rectHeight + 'px'
      currentPosition = DIRECTIONS.top
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
      case DIRECTIONS.top:
        currentPosition = DIRECTIONS.top
        positionStyle = {
          bottom: targetHeight + MARGIN_SIZE,
        }
        break
      case DIRECTIONS.right:
        currentPosition = DIRECTIONS.right
        positionStyle = {
          right: 0 - twRect.width - MARGIN_SIZE,
        }
        break
      case DIRECTIONS.left:
        currentPosition = DIRECTIONS.left
        positionStyle = {
          left: 0 - twRect.width - MARGIN_SIZE,
        }
        break
      case DIRECTIONS.bottom:
      default:
        currentPosition = DIRECTIONS.bottom
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
    bgColor = binding.value.bgColor || COLOR_BLACK
    textColor = binding.value.textColor || COLOR_BLUE
    tooltipWrapper = document.createElement('div')
    tooltipText = document.createElement('div')
    tooltipArrow = document.createElement('div')
    tooltipWrapper.appendChild(tooltipText)
    tooltipWrapper.appendChild(tooltipArrow)
    target.appendChild(tooltipWrapper)

    tooltipWrapper.className = 'tooltip-wrapper'
    tooltipWrapper.style.position = 'absolute'
    tooltipWrapper.style.width = (binding.value.width || targetWidth) + 'px'

    tooltipText.innerText = globalize(binding.value.text)
    tooltipText.style.color = binding.value.txtColor
    tooltipText.style.fontSize = '1.4rem'
    tooltipText.style.color = textColor

    twRect = tooltipWrapper.getBoundingClientRect()
    const positionStyle = getPositionStyle(twRect)

    tooltipWrapper.style.pointerEvents = 'none'
    tooltipWrapper.style.top = positionStyle.top + 'px'
    tooltipWrapper.style.right = positionStyle.right + 'px'
    tooltipWrapper.style.bottom = positionStyle.bottom + 'px'
    tooltipWrapper.style.left = positionStyle.left + 'px'
    tooltipWrapper.style.backgroundColor = bgColor
    tooltipWrapper.style.display = 'flex'
    tooltipWrapper.style.justifyContent = 'center'
    tooltipWrapper.style.alignItems = 'center'
    tooltipWrapper.style.padding = '8px'
    tooltipWrapper.style.border = `1px solid ${COLOR_BLUE}`
    tooltipWrapper.style.zIndex = '120'
    tooltipWrapper.style.transition = `all 350ms ease-in-out`
    tooltipWrapper.style.borderRadius = '4px'

    if (target.style.position !== 'relative') {
      target.style.position = 'relative'
    }

    alignTooltip(target)
    tooltipWrapper.addEventListener('transitionend', function initRenderArrow () {
      renderArrow()
      tooltipWrapper.removeEventListener('transitionend', initRenderArrow)
    })
  }

  function renderArrow () {
    tooltipArrow.style.borderLeft = tooltipArrow.style.borderRight = '8px solid transparent'
    tooltipArrow.style.borderBottom = `8px solid ${bgColor}`
    tooltipArrow.style.borderTop = '0'
    tooltipArrow.style.borderRadius = '0'
    tooltipArrow.style.position = 'absolute'

    const twRect = tooltipWrapper.getBoundingClientRect()
    const startPointX = targetRect.left - twRect.left
    tooltipArrowRect = tooltipArrow.getBoundingClientRect()
    switch (currentPosition) {
      case DIRECTIONS.top:
        tooltipArrow.style.bottom = '-8px'
        tooltipArrow.style.transform = 'rotate(180deg)'
        tooltipArrow.style.left = startPointX + (targetRect.width / 2) -
          (tooltipArrowRect.width / 2) + 'px'
        break
      case DIRECTIONS.bottom:
        tooltipArrow.style.top = '-8px'
        tooltipArrow.style.left = startPointX + (targetRect.width / 2) -
          (tooltipArrowRect.width / 2) + 'px'
        break
      case DIRECTIONS.left:
        tooltipArrow.style.right = '-12px'
        tooltipArrow.style.transform = 'rotate(90deg)'
        break
      case DIRECTIONS.right:
        tooltipArrow.style.left = '-12px'
        tooltipArrow.style.transform = 'rotate(-90deg)'
        break
    }
  }

  return {
    bind (el, binding) {
      // resizeHandler = alignTooltip.bind(null, el)
      el.addEventListener('mouseover', (e) => {
        renderTooltip(e, binding)
        // window.addEventListener('resize', resizeHandler)
      })

      el.addEventListener('mouseout', (e) => {
        tooltipWrapper.parentNode.removeChild(tooltipWrapper)
        // window.removeEventListener('resize', resizeHandler)
      })
    },

    unbind (el) {
      el.removeEventListener('mouseover', renderTooltip)
      // window.removeEventListener('resize', resizeHandler)
    },
  }
})()
