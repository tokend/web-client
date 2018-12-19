export function handleClickOutsideHelper (className, callback) {
  document.addEventListener('click', handleClickOutside, false)

  function handleClickOutside (event) {
    if (!event.target.closest(`.${className}`)) {
      callback()
      document.removeEventListener('click', handleClickOutside, false)
    }
  }
}
