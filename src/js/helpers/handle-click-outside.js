export function handleClickOutside (selector, callback) {
  document.addEventListener('click', handler, false)

  function handler (event) {
    if (!event.target.closest(selector)) {
      callback()
      document.removeEventListener('click', handler, false)
    }
  }
}
