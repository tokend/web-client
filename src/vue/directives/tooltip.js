import { globalize } from '@/vue/filters/globalize'

export const tooltip = (() => {
  const COLOR_BLACK = '#000'
  const COLOR_WHITE = '#fff'
  const MARGIN_SIZE = 8
  const PADDING_SIZE = 8
  const WIDTH = 120
  const DIRECTIONS = {
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
  }
  let tooltipText
  let tooltipWrapper
  let tooltipArrow
  let targetHeight
  let twRect
  let target
  let targetRect
  let tooltipArrowRect
  let position
  let currentPosition
  let bgColor
  let textColor
  let width
  let resizeHandler = null

  function refreshPositions () {
    twRect = tooltipWrapper.getBoundingClientRect()
  }

  function alignTooltip (e) {
    const target = e.target ? e.target : e
    const targetRect = target.getBoundingClientRect()
    const appDiv = document.getElementsByClassName('app__main-content')[0]
    let spaceToRight = window.innerWidth - (targetRect.left + targetRect.width)
    let rectHeight = tooltipWrapper.offsetHeight + MARGIN_SIZE
    let spaceToLeft = appDiv.clientWidth - spaceToRight - targetRect.width
    let spaceToBottom = window.innerHeight - targetRect.bottom
    // check if there is enough space for tw on left side
    if (twRect.width > spaceToLeft && position !== DIRECTIONS.right) {
      let top
      if (position === DIRECTIONS.top) {
        top = -(targetRect.height + MARGIN_SIZE + (PADDING_SIZE * 2)) + 'px'
        tooltipWrapper.style.right = ''
        tooltipWrapper.style.left = '50%'
        tooltipWrapper.style.marginLeft = '-' + (twRect.width / 4) + 'px'
        currentPosition = DIRECTIONS.top
      } else if (twRect.width < spaceToRight &&
          position !== DIRECTIONS.bottom) {
        tooltipWrapper.style.top = '0'
        tooltipWrapper.style.left = (0 + targetRect.width) + (2 * MARGIN_SIZE) + 'px'
        currentPosition = DIRECTIONS.right
      } else {
        tooltipWrapper.style.top = ''
        tooltipWrapper.style.left = ''
        top = targetRect.height + MARGIN_SIZE + PADDING_SIZE + 'px'
        currentPosition = DIRECTIONS.bottom
      }
      tooltipWrapper.style.transform = `translateY(${top})`
      refreshPositions()
    }
    // check if there is enough space for tw on right side
    if (twRect.width > spaceToRight && position !== DIRECTIONS.left) {
      let top
      if (position === DIRECTIONS.top) {
        tooltipWrapper.style.top = ''
        tooltipWrapper.style.left = ''
        tooltipWrapper.style.right = '50%'
        tooltipWrapper.style.marginRight = '-' + (twRect.width / 4) + 'px'
        top = -(targetRect.height + MARGIN_SIZE +
          PADDING_SIZE) + 'px'
        currentPosition = DIRECTIONS.top
      } else if (twRect.width < spaceToLeft &&
          position !== DIRECTIONS.bottom) {
        tooltipWrapper.style.top = ''
        tooltipWrapper.style.left = (0 - targetRect.width) + (2 * MARGIN_SIZE) + 'px'
        currentPosition = DIRECTIONS.left
      } else {
        tooltipWrapper.style.top = ''
        top = targetRect.height + (PADDING_SIZE * 2) + 'px'
        currentPosition = DIRECTIONS.bottom
      }
      tooltipWrapper.style.transform = `translateY(${top})`
      refreshPositions()
    }

    // check if there is enough space for tw on top side
    if (rectHeight > targetRect.top && position === DIRECTIONS.top) {
      let bottom = rectHeight + 'px'
      tooltipWrapper.style.top = '0'
      tooltipWrapper.style.transform = `translateY(${bottom})`
      currentPosition = DIRECTIONS.bottom
      refreshPositions()
    }
    // check if there is enough space for tw on bottom
    if (rectHeight > spaceToBottom) {
      let bottom = -rectHeight + 'px'
      tooltipWrapper.style.top = '0'
      tooltipWrapper.style.left = '0'
      tooltipWrapper.style.right = '0'
      tooltipWrapper.style.margin = 'auto'
      tooltipWrapper.style.transform = `translateY(${bottom})`
      currentPosition = DIRECTIONS.top
      refreshPositions()
    }

    // check if tw overflows left side
    if (twRect.left < 0) {
      tooltipWrapper.style.right = ''
      if (currentPosition === position) {
        tooltipWrapper.style.left = '50%'
        // tooltipWrapper.style.marginLeft = '-' + (twRect.width / 4) + 'px'
      }
      refreshPositions()
    }
    // check if tw overflows right side
    if (twRect.right > window.innerWidth) {
      tooltipWrapper.style.left = ''
      if (currentPosition === position) {
        tooltipWrapper.style.right = '50%'
        tooltipWrapper.style.marginRight = '-' + (twRect.width / 4) + 'px'
      }
      refreshPositions()
    }

    if (targetRect.width > spaceToLeft && targetRect.width > spaceToRight) {
      tooltipWrapper.style.left = '0'
      tooltipWrapper.style.right = '0'
      tooltipWrapper.style.margin = 'auto'
      refreshPositions()
    }
    // check if tw width wider than window
    if (twRect.width > appDiv.clientWidth) {
      tooltipWrapper.style.margin = '0'
      tooltipWrapper.style.width = appDiv.clientWidth + 'px'
      tooltipWrapper.style.left = (0 - targetRect.left) + 'px'
      refreshPositions()
    }

    if (currentPosition === DIRECTIONS.left) {
      let left = -(twRect.width + PADDING_SIZE) + 'px'
      tooltipWrapper.style.transform = `translateX(${left})`
      tooltipWrapper.style.left = '0'
    } else if (currentPosition === DIRECTIONS.right) {
      let right = targetRect.width + PADDING_SIZE + 'px'
      tooltipWrapper.style.transform = `translateX(${right})`
      tooltipWrapper.style.left = '0'
    }
    refreshPositions()
    renderArrow(target)
  }

  function getPositionStyle (twRect) {
    let positionStyle
    switch (position) {
      case DIRECTIONS.top:
        positionStyle = {
          top: targetHeight + MARGIN_SIZE,
        }
        break
      case DIRECTIONS.right:
        positionStyle = {
          left: twRect.width + MARGIN_SIZE,
        }
        break
      case DIRECTIONS.left:
        positionStyle = {
          left: 0 - twRect.width - MARGIN_SIZE,
        }
        break
      case DIRECTIONS.bottom:
      default:
        positionStyle = {
          top: 0 - targetHeight - MARGIN_SIZE,
        }
        break
    }
    return positionStyle
  }

  function renderTooltip (e, binding) {
    target = e.target ? e.target : e
    targetRect = target.getBoundingClientRect()
    // targetWidth = targetRect.width
    targetHeight = targetRect.height
    position = binding.value.position
    currentPosition = position
    bgColor = binding.value.bgColor || COLOR_BLACK
    textColor = binding.value.textColor || COLOR_WHITE
    width = binding.value.width || WIDTH
    tooltipWrapper = document.createElement('div')
    tooltipText = document.createElement('div')
    tooltipArrow = document.createElement('div')
    tooltipWrapper.appendChild(tooltipText)
    tooltipWrapper.appendChild(tooltipArrow)
    target.appendChild(tooltipWrapper)

    tooltipWrapper.className = 'tooltip-wrapper'
    tooltipWrapper.style.position = 'absolute'
    tooltipWrapper.style.width = width + 'px'

    tooltipText.innerText = globalize(binding.value.text)
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
    tooltipWrapper.style.transition = 'transform 350ms ease-in-out, opacity 300ms ease'
    // tooltipWrapper.style.opacity = '0'
    // tooltipWrapper.style.visibility = 'hidden'
    tooltipWrapper.style.zIndex = '120'
    tooltipWrapper.style.borderRadius = '4px'

    if (target.style.position !== 'relative') {
      target.style.position = 'relative'
    }

    alignTooltip(target)
    // setTimeout(() => {
    //   tooltipWrapper.style.opacity = '1'
    //   tooltipWrapper.style.visibility = 'visible'
    // }, 300)

    tooltipWrapper.addEventListener('transitionend', function initRenderArrow () {
      renderArrow(target)
      tooltipWrapper.removeEventListener('transitionend', initRenderArrow)
    })
  }

  function renderArrow (target) {
    tooltipArrow.style.borderLeft = tooltipArrow.style.borderRight = '8px solid transparent'
    tooltipArrow.style.borderBottom = `8px solid ${bgColor}`
    tooltipArrow.style.borderTop = '0'
    tooltipArrow.style.borderRadius = '0'
    tooltipArrow.style.position = 'absolute'
    const twRect = tooltipWrapper.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
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
      // el.addEventListener('mouseover', (e) => {
      //   // renderTooltip(e, binding)
      //   // window.addEventListener('resize', resizeHandler)
      // })

      // el.addEventListener('mouseout', (e) => {
      //   // tooltipWrapper.parentNode.removeChild(tooltipWrapper)
      //   // window.removeEventListener('resize', resizeHandler)
      // })

      el.addEventListener('click', (e) => {
        resizeHandler = renderTooltip.bind(null, e, binding)
        renderTooltip(e, binding)
        window.addEventListener('resize', function () {
          tooltipWrapper.parentNode.removeChild(tooltipWrapper)
          resizeHandler()
        })
      })
    },

    unbind (el) {
      // el.removeEventListener('mouseover', renderTooltip)
      window.removeEventListener('resize', resizeHandler)
    },
  }
})()
