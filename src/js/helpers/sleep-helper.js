export const sleep = (milliseconds) => {
  // eslint-disable-next-line promise/avoid-new
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
