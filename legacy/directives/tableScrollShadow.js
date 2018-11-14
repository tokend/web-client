import throttle from 'lodash/throttle'

const scrollStyling = (e) => {
  const target = e.target ? e.target : e
  const parentNode = target.parentNode
  const isScrollEnd =
    target.scrollLeft >= target.scrollWidth - target.offsetWidth - 5
  const isScrolled = target.scrollLeft > 5
  isScrollEnd
    ? parentNode.classList.remove('app__table-right-shadow')
    : parentNode.classList.add('app__table-right-shadow')
  isScrolled
    ? parentNode.classList.add('app__table-left-shadow')
    : parentNode.classList.remove('app__table-left-shadow')
}

export default {
  bind (el) {
    el.addEventListener('scroll', throttle(scrollStyling, 150), true)
    window.addEventListener(
      'resize',
      throttle(scrollStyling.bind(null, el), 200),
      true
    )
  },
  inserted (el) {
    const rightShadowIsNeeded = el.scrollWidth !== el.offsetWidth
    const leftShadowIsNeeded = el.scrollLeft > 5
    if (rightShadowIsNeeded) {
      el.parentNode.classList.add('app__table-right-shadow')
    }
    if (leftShadowIsNeeded) {
      el.parentNode.classList.add('app__table-left-shadow')
    }
  },
  unbind (el) {
    el.removeEventListener('scroll', scrollStyling)
    window.removeEventListener('resize', scrollStyling)
  }
}
