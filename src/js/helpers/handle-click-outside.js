export function handleClickOutside (selector, callback) {
  function handler (event) {
    if (!event.target.closest(selector)) {
      callback()
      destructor()
    }
  }

  function destructor () {
    document.removeEventListener('click', handler, false)
  }

  document.addEventListener('click', handler, false)
  return destructor
}
