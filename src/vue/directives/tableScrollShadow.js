import throttle from 'lodash/throttle'

// this value is wrapper padding that prevents content shadowing
const WRAPPER_PADDING = 5

function scrollStyling (e) {
  const target = e.target ? e.target : e
  const parentNode = target.parentNode
  const isRightShadowNeeded = target.scrollLeft >=
    target.scrollWidth - target.offsetWidth - WRAPPER_PADDING
  const isLeftShadowNeeded = target.scrollLeft > WRAPPER_PADDING

  isRightShadowNeeded
    ? parentNode.classList.remove('app__table-right-shadow')
    : parentNode.classList.add('app__table-right-shadow')
  isLeftShadowNeeded
    ? parentNode.classList.add('app__table-left-shadow')
    : parentNode.classList.remove('app__table-left-shadow')
}

export const tableScrollShadow = {
  bind (el) {
    el.addEventListener('scroll', throttle(scrollStyling, 150), true)
    window.addEventListener(
      'resize',
      throttle(scrollStyling.bind(null, el), 200),
      true
    )
  },
  inserted (el) {
    scrollStyling(el)
  },
  unbind (el) {
    el.removeEventListener('scroll', scrollStyling)
    window.removeEventListener('resize', scrollStyling)
  },
}
