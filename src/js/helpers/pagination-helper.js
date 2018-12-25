export function getFirstPageLoader (filter, requestFunction) {
  return function () {
    requestFunction(filter)
  }
}
