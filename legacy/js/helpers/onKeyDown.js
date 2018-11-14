export function onKeyDown (status, callback) {
  document.onkeydown = function (event) {
    if (status) callback(event)
  }
}
