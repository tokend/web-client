/**
 * Tooltip directive
 *
 * Draw element used in conjunction with the cursor or mouse pointer to display
 * information about an item.
 * - Can be activated as by mouse click or mouse hover.
 * - Can calculate free space for placement of tooltip, depenping on user's
 *   position desire
 * - Styles are customizable
 *
 * Value variants:
 * - Type: 'click', 'hover': 'hover' by default
 * - Position: 'top', 'right', 'bottom', 'left'; 'top' by default
 * - Width: number, without css units like px/em; 'auto' by default
 * - height: number, without css units like px/em; 'auto' by default
 * - bgColor: hex value of color; #000 by default
 * - textColor: hex value of color; #fff by default
 * - fontSize: number with css units like px/em; '1.4rem' by default
 *
 * Example of usage is described below.
 *  <element
 *    v-tooltip="{
 *      type: 'hover'
        text: 'Lorem ipsum',
        position: 'top',
        style: {
          width: '500',
          height: '900',
          bgColor: 'red',
          textColor: 'green',
          fontSize: '14px'
        }
      }>
 *
 * @param {Object} binding.value - passed params
 * @param {string} binding.value.text - text of tooltip
 * @param {string} [binding.value.type] - 'click' or 'hover' to summon tooltip
 * @param {string} [binding.value.position] - position of tooltip,
 * where it will be placed.
 * @param {string} [binding.value.style.width] - tooltip's width,120px default
 * @param {string} [binding.value.style.height] - tooltip's height,120px default
 * @param {string} [binding.value.style.bgColor] - tooltip's background color,
 *  '#000' by default
 * @param {string} [binding.value.style.textColor] - tooltip's text color,
 *  #fff by default
 * @param {string} [binding.value.style.fontSize] - tooltip's text font size,
 *  '1.4rem' by default
 *
 */

import safeGet from 'lodash/get'

export const tooltip = (() => {
  const COLOR_BLACK = '#000'
  const COLOR_WHITE = '#fff'
  const MARGIN_SIZE = 8
  const PADDING_SIZE = 8
  const TRIANGLE_SIZE = 8
  const WIDTH = 'auto'
  const HEIGHT = 'auto'
  const FONT_SIZE = '1.4rem'
  const Z_INDEX = '120'
  const DIRECTIONS = {
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
  }
  let tooltipText
  let tooltipWrapper
  let tooltipArrow
  let tooltipBridge
  let twRect
  let target
  let targetRect
  let tooltipArrowRect
  let position
  let positionStyle
  let currentPosition
  let bgColor
  let textColor
  let fontSize
  let width
  let height
  let resizeHandler = null
  let tooltipOn = false
  let currentTarget
  let bindedOpts

  // update TooltipWrapper client rect
  function refreshPositions () {
    twRect = tooltipWrapper.getBoundingClientRect()
  }

  //
  function changePosition () {
    tooltipWrapper.style.top = positionStyle[currentPosition].top + 'px'
    tooltipWrapper.style.left = positionStyle[currentPosition].left + 'px'
  }

  function alignTooltip () {
    refreshPositions()
    const documentWidth = document.body.clientWidth
    let spaceToRight = documentWidth - targetRect.right
    let spaceToTop = targetRect.top
    let spaceToLeft = targetRect.left + MARGIN_SIZE
    let spaceToBottom = window.innerHeight - targetRect.bottom
    let tooltipHeight = twRect.height + MARGIN_SIZE

    // check free space for left placement
    if (twRect.width > spaceToLeft && position === DIRECTIONS.left) {
      currentPosition = DIRECTIONS.right
      changePosition()
      refreshPositions()
    }

    // check free space for right placement
    if (twRect.width > spaceToRight && position === DIRECTIONS.right) {
      currentPosition = DIRECTIONS.left
      changePosition()
      refreshPositions()
    }

    // check free space for top placement
    if (tooltipHeight > spaceToTop && position === DIRECTIONS.top) {
      currentPosition = DIRECTIONS.bottom
      changePosition()
      refreshPositions()
    }

    // check free space for bottom placement
    if (tooltipHeight > spaceToBottom && position === DIRECTIONS.bottom) {
      currentPosition = DIRECTIONS.top
      changePosition()
      refreshPositions()
    }

    // check if overflow on sides for top/bottom positions
    if (currentPosition === DIRECTIONS.top ||
      currentPosition === DIRECTIONS.bottom) {
      if (twRect.right > documentWidth) {
        const overflowWidth = twRect.right - documentWidth
        const moveLeftValue = twRect.left - overflowWidth - MARGIN_SIZE
        tooltipWrapper.style.left = moveLeftValue + 'px'
        refreshPositions()
      }

      if (twRect.left < 0) {
        tooltipWrapper.style.left = MARGIN_SIZE + 'px'
        refreshPositions()
      }

      if (twRect.width > documentWidth) {
        tooltipWrapper.style.left = '0'
        tooltipWrapper.style.width = documentWidth + 'px'
        refreshPositions()
      }

      if (twRect.top < 0) {
        currentPosition = DIRECTIONS.bottom
        changePosition()
        refreshPositions()
      } else if (twRect.bottom > window.innerHeight) {
        currentPosition = DIRECTIONS.top
        changePosition()
        refreshPositions()
      }

      if (twRect.top < 0 || twRect.bottom > window.innerHeight) {
        tooltipWrapper.style.maxHeight = '300px'
        tooltipWrapper.style.height = 'auto'
        tooltipText.style.overflow = 'scroll'
        currentPosition = DIRECTIONS.bottom
        changePosition()
        refreshPositions()
      }
    }

    // check if overflow on sides for left/right positions
    if (currentPosition === DIRECTIONS.left ||
      currentPosition === DIRECTIONS.right) {
      if (twRect.left < 0) {
        currentPosition = DIRECTIONS.bottom
        tooltipWrapper.style.top = positionStyle[currentPosition].top + 'px'
        tooltipWrapper.style.left = MARGIN_SIZE + 'px'
        refreshPositions()
      } else if (twRect.right > documentWidth) {
        currentPosition = DIRECTIONS.bottom
        changePosition()
        refreshPositions()
      }

      if (twRect.left < 0 || twRect.right > documentWidth) {
        if (twRect.width > documentWidth) {
          tooltipWrapper.style.width = documentWidth + 'px'
          refreshPositions()
        } else {
          const freeWindowSpace = (documentWidth - twRect.width) / 2
          const centeredStartPoint = targetRect.left - freeWindowSpace
          tooltipWrapper.style.left = -centeredStartPoint + 'px'
          refreshPositions()
        }
      }

      if (twRect.top < 0) {
        currentPosition = DIRECTIONS.bottom
        changePosition()
        refreshPositions()
      } else if (twRect.bottom > window.innerHeight) {
        currentPosition = DIRECTIONS.top
        changePosition()
        refreshPositions()
      }

      if (twRect.top < 0 || twRect.bottom > window.innerHeight) {
        if (twRect.height > window.innerHeight) {
          tooltipWrapper.style.width = documentWidth + 'px'
          tooltipWrapper.style.height = 'auto'
          refreshPositions()
        } else {
          const freeWindowSpace = (window.innerHeight - twRect.height) / 2
          const centeredStartPoint = targetRect.top - freeWindowSpace
          tooltipWrapper.style.top = -centeredStartPoint + 'px'
          refreshPositions()
        }
      }
    }

    // add animation depending on current position
    if (currentPosition === DIRECTIONS.top) {
      tooltipWrapper.style.transform = `translateY(-${MARGIN_SIZE / 2}px)`
    } else if (currentPosition === DIRECTIONS.right) {
      tooltipWrapper.style.transform = `translateX(${MARGIN_SIZE / 2}px)`
    } else if (currentPosition === DIRECTIONS.bottom) {
      tooltipWrapper.style.transform = `translateY(${MARGIN_SIZE / 2}px)`
    } else {
      tooltipWrapper.style.transform = `translateX(-${MARGIN_SIZE / 2}px)`
    }

    renderUtilityElements(target)
  }

  function getPositionStyle (twRect) {
    const xTargetMidPoint = targetRect.left + (targetRect.width / 2)
    const yTargetMidPoint = targetRect.top + (targetRect.height / 2)
    const xTooltipMidPoint = targetRect.left + (twRect.width / 2)
    return {
      [DIRECTIONS.top]: {
        top: targetRect.top - twRect.height - (MARGIN_SIZE / 2),
        left: targetRect.left - (xTooltipMidPoint - xTargetMidPoint),
      },
      [DIRECTIONS.right]: {
        top: yTargetMidPoint - (twRect.height / 2),
        left: targetRect.left + targetRect.width + (MARGIN_SIZE / 2),
      },
      [DIRECTIONS.left]: {
        top: yTargetMidPoint - (twRect.height / 2),
        left: targetRect.left - twRect.width - (MARGIN_SIZE / 2),
      },
      [DIRECTIONS.bottom]: {
        top: targetRect.top + targetRect.height + (MARGIN_SIZE / 2),
        left: targetRect.left - (xTooltipMidPoint - xTargetMidPoint),
      },
    }
  }

  function renderTooltip (e, binding) {
    const appContainer = document.getElementById('app')
    target = e.target ? e.target : e
    targetRect = target.getBoundingClientRect()
    position = safeGet(binding, 'value.position', DIRECTIONS.top)
    currentPosition = position
    bgColor = safeGet(binding, 'value.style.bgColor', COLOR_BLACK)
    textColor = safeGet(binding, 'value.style.textColor', COLOR_WHITE)
    fontSize = safeGet(binding, 'value.style.fontSize', FONT_SIZE)
    width = safeGet(binding, 'value.style.width')
      ? safeGet(binding, 'value.style.width') + 'px' : WIDTH
    height = safeGet(binding, 'value.style.height')
      ? safeGet(binding, 'value.style.height') + 'px' : HEIGHT
    tooltipWrapper = document.createElement('div')
    // tooltip arrow, that shows source of tooltip
    tooltipArrow = document.createElement('div')
    // utility area, so mouse can catch tooltip when hover
    tooltipBridge = document.createElement('div')

    tooltipText = document.createElement('div')
    tooltipText.className = 'tooltip-wrapper-text'
    tooltipText.innerText = safeGet(binding, 'value.text')
    tooltipText.style.fontSize = fontSize
    tooltipText.style.color = textColor

    tooltipWrapper.className = 'tooltip-wrapper'
    tooltipWrapper.style.position = 'absolute'
    tooltipWrapper.style.width = width
    tooltipWrapper.style.height = height
    tooltipWrapper.style.padding = `${PADDING_SIZE}px`

    tooltipWrapper.appendChild(tooltipText)
    tooltipWrapper.appendChild(tooltipArrow)
    tooltipWrapper.appendChild(tooltipBridge)
    appContainer.appendChild(tooltipWrapper)
    target.classList.add('tooltip-container')

    twRect = tooltipWrapper.getBoundingClientRect()
    positionStyle = getPositionStyle(twRect)

    tooltipWrapper.style.top = positionStyle[position].top + 'px'
    tooltipWrapper.style.left = positionStyle[position].left + 'px'
    tooltipWrapper.style.backgroundColor = bgColor
    tooltipWrapper.style.display = 'flex'
    tooltipWrapper.style.justifyContent = 'center'
    tooltipWrapper.style.alignItems = 'center'
    tooltipWrapper.style.transition = `transform 250ms ease-in-out`
    tooltipWrapper.style.opacity = '0'
    tooltipWrapper.style.zIndex = Z_INDEX
    tooltipWrapper.style.borderRadius = '4px'

    alignTooltip(target)
    animateFadeEffect()

    tooltipWrapper.addEventListener('transitionend',
      function initRenderUtility () {
        renderUtilityElements(target)
        tooltipWrapper.removeEventListener('transitionend', initRenderUtility)
      }
    )
  }

  function animateFadeEffect () {
    tooltipWrapper.style.transition = tooltipWrapper.style.transition +
      ', opacity 250ms ease-in-out'
    tooltipWrapper.style.opacity = 1
  }

  // render arrow and area, where mouse can move to on hover
  function renderUtilityElements (target) {
    // arrow styles
    tooltipArrow.style.borderLeft = `${TRIANGLE_SIZE}px solid transparent`
    tooltipArrow.style.borderRight = `${TRIANGLE_SIZE}px solid transparent`
    tooltipArrow.style.borderBottom = `${TRIANGLE_SIZE}px solid ${bgColor}`
    tooltipArrow.style.borderTop = '0'
    tooltipArrow.style.borderRadius = '0'
    tooltipArrow.style.position = 'absolute'
    tooltipBridge.style.position = 'absolute'
    const twRect = tooltipWrapper.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const startPointX = targetRect.left - twRect.left
    tooltipArrowRect = tooltipArrow.getBoundingClientRect()
    switch (currentPosition) {
      case DIRECTIONS.top:
        tooltipArrow.style.bottom = `-${TRIANGLE_SIZE}px`
        tooltipArrow.style.transform = 'rotate(180deg)'
        tooltipArrow.style.left = startPointX + (targetRect.width / 2) -
          (tooltipArrowRect.width / 2) + 'px'
        tooltipBridge.style.bottom = `-${MARGIN_SIZE}px`
        tooltipBridge.style.left = `${startPointX}px`
        tooltipBridge.style.height = `${MARGIN_SIZE}px`
        tooltipBridge.style.width = `${targetRect.width}px`
        break
      case DIRECTIONS.bottom:
        tooltipArrow.style.top = `-${TRIANGLE_SIZE}px`
        tooltipArrow.style.left = startPointX + (targetRect.width / 2) -
          (tooltipArrowRect.width / 2) + 'px'
        tooltipBridge.style.top = `-${MARGIN_SIZE}px`
        tooltipBridge.style.left = `${startPointX}px`
        tooltipBridge.style.height = `${MARGIN_SIZE}px`
        tooltipBridge.style.width = `${targetRect.width}px`
        break
      case DIRECTIONS.left:
        tooltipArrow.style.right = `-${TRIANGLE_SIZE + (TRIANGLE_SIZE / 2)}px`
        tooltipArrow.style.transform = 'rotate(90deg)'
        tooltipBridge.style.right = `-${MARGIN_SIZE}px`
        tooltipBridge.style.height = `${targetRect.height}px`
        tooltipBridge.style.width = `${MARGIN_SIZE}px`
        break
      case DIRECTIONS.right:
        tooltipArrow.style.left = `-${TRIANGLE_SIZE + (TRIANGLE_SIZE / 2)}px`
        tooltipArrow.style.transform = 'rotate(-90deg)'
        tooltipBridge.style.left = `-${MARGIN_SIZE}px`
        tooltipBridge.style.height = `${targetRect.height}px`
        tooltipBridge.style.width = `${MARGIN_SIZE}px`
        break
    }
  }

  // checks if any other tooltips are open
  function detectOpenedTooltips () {
    const listener = (ev) => {
      if (ev.target.closest('.tooltip-container')) return
      removeTooltip()
      currentTarget = null
      tooltipOn = false
      document.removeEventListener('click', listener)
    }
    document.addEventListener('click', listener)
  }

  // remove tooltip from DOM
  function removeTooltip () {
    if (tooltipWrapper.parentNode) {
      tooltipWrapper.parentNode.removeChild(tooltipWrapper)
      currentTarget.classList.remove('tooltip-container')
    }
  }

  return {
    bind (el, binding) {
      bindedOpts = binding
      if (bindedOpts.value.type === 'click') {
        el.addEventListener('click', (e) => {
          currentTarget = currentTarget || e.target
          tooltipOn = !tooltipOn
          if (currentTarget !== e.target) {
            currentTarget = e.target
            removeTooltip()
            tooltipOn = true
          }
          detectOpenedTooltips()
          resizeHandler = renderTooltip.bind(null, e, binding)
          if (tooltipOn) {
            renderTooltip(e, binding)
            window.addEventListener('resize', function () {
              removeTooltip()
              resizeHandler()
            })
          } else {
            removeTooltip()
          }
        })
      } else {
        el.addEventListener('mouseenter', (e) => {
          // workaround, if user add multiple tooltips with different actions
          currentTarget = currentTarget || e.target
          if (currentTarget !== e.target) {
            currentTarget = e.target
            removeTooltip()
            tooltipOn = false
          }
          renderTooltip(e, binding)
        })

        el.addEventListener('mouseleave', (e) => {
          if (!tooltipWrapper.contains(e.toElement)) {
            removeTooltip()
          } else {
            tooltipWrapper.addEventListener('mouseleave', removeTooltip)
          }
        })
      }
    },
    componentUpdate () {
      if (bindedOpts.value.type === 'click') {
        detectOpenedTooltips()
      }
    },
    unbind (el) {
      if (bindedOpts.value.type === 'click') {
        window.removeEventListener('resize', resizeHandler)
      }
    },
  }
})()
