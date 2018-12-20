export function handleClickOutside (className, callback) {
  document.addEventListener('click', handler, false)

  function handler (event) {
    if (!event.target.closest(`.${className}`)) {
      callback()
      document.removeEventListener('click', handler, false)
    }
  }
}
