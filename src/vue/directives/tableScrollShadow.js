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

export const tableScrollShadow = (() => {
  let scrollHandler = null
  let resizeHandler = null

  return {
    bind (el) {
      scrollHandler = throttle(scrollStyling, 150)
      resizeHandler = throttle(scrollStyling.bind(null, el), 200)

      el.addEventListener('scroll', scrollHandler)
      window.addEventListener('resize', resizeHandler)
    },
    inserted (el) {
      scrollStyling(el)
    },
    unbind (el) {
      el.removeEventListener('scroll', scrollHandler)
      window.removeEventListener('resize', resizeHandler)
    },
  }
})()
