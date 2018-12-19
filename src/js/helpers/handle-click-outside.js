export function handleClickOutsideHelper (className, status, callback) {
  document.addEventListener('click', handleClickOutside, false)

  function handleClickOutside (event) {
    if (status && !event.target.closest(`.${className}`)) {
      callback()
      document.removeEventListener('click', handleClickOutside, false)
    }
  }
}
