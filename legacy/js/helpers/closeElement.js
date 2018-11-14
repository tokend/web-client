export function closeElement (className, status, callback) {
  document.onclick = function (event) {
    if (status && !event.target.closest(`.${className}`)) {
      callback()
    }
  }
}
