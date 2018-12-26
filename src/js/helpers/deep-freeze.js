export function deepFreeze (obj) {
  const propNames = Object.getOwnPropertyNames(obj)

  propNames.forEach(name => {
    const prop = obj[name]

    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop)
    }
  })

  return Object.freeze(obj)
}
