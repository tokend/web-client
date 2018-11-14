const Ripple = {
  bind (el, binding) {
    el.onmousedown = function (e) {
      const target = this
      const rect = target.getBoundingClientRect()
      const left = rect.left
      const top = rect.top
      const width = rect.width
      const height = rect.height
      const dx = e.clientX - left
      const dy = e.clientY - top
      const maxX = Math.max(dx, width - dx)
      const maxY = Math.max(dy, height - dy)
      const radius = Math.sqrt((maxX * maxX) + (maxY * maxY))

      const bgColor = getProperty(binding, 'color') || Ripple.color || 'rgba(0, 0, 0, 0.25)'
      const duration = getProperty(binding, 'duration') || Ripple.duration || 500

      const ripple = document.createElement('div')
      const rippleContainer = document.createElement('div')

      rippleContainer.appendChild(ripple)
      target.appendChild(rippleContainer)

      rippleContainer.style.position = 'absolute'
      rippleContainer.style.marginTop = '0'
      rippleContainer.style.marginLeft = '0'
      rippleContainer.style.width = width + 'px'
      rippleContainer.style.height = height + 'px'
      rippleContainer.style.overflow = 'hidden'
      rippleContainer.style.pointerEvents = 'none'
      rippleContainer.style.top = '0'
      rippleContainer.style.left = '0'

      ripple.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      ripple.style.backgroundColor = bgColor
      ripple.style.pointerEvents = 'none'
      ripple.style.borderRadius = '50%'
      ripple.style.height = '0'
      ripple.style.width = '0'
      ripple.style.opacity = '1'
      ripple.style.position = 'absolute'
      ripple.style.marginLeft = dx + 'px'
      ripple.style.marginTop = dy + 'px'

      if (target.style.position !== 'relative') {
        target.style.position = 'relative'
      }

      setTimeout(() => {
        ripple.style.width = radius * 2 + 'px'
        ripple.style.height = radius * 2 + 'px'
        ripple.style.marginLeft = dx - radius + 'px'
        ripple.style.marginTop = dy - radius + 'px'
        ripple.style.opacity = '0'
      }, 0)

      setTimeout(() => {
        rippleContainer.parentNode.removeChild(rippleContainer)
      }, duration)
    }
  }
}

function getProperty (binding, propertyName) {
  if (binding.value) {
    return binding.value[propertyName] ? binding.value[propertyName] : false
  }
  return false
}

export default Ripple
