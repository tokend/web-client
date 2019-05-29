export const isCompatibleBrowser = () => {
  return isCompatibleChrome() ||
         isCompatibleChromeMobileAndroid() ||
         isCompatibleChromeMobileIOS() ||
         isCompatibleEdge() ||
         isCompatibleFirefox() ||
         isCompatibleFirefoxIOS() ||
         isCompatibleSafari() ||
         isCompatibleSafariIOS() ||
         isCompatibleOpera() ||
         isCompatibleDefaultAndroid() ||
         isCompatibleSamsungBrowser()
}

function isCompatibleChrome () {
  const isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
  if (isChrome) {
    if (+isChrome[2] < 54) return false
    return true
  } else {
    return false
  }
}

function isCompatibleChromeMobileAndroid () {
  const isChromeMobileAndroid = navigator.userAgent.match(/.*Chrome\/([[0-9]+).*Mobile.*/)
  if (isChromeMobileAndroid) {
    if (+isChromeMobileAndroid[1] < 71) return false
    return true
  } else {
    return false
  }
}

function isCompatibleChromeMobileIOS () {
  const isChromeMobileIOS = navigator.userAgent.match(/.*CriOS\/([[0-9]+).*Mobile.*/)
  if (isChromeMobileIOS) {
    if (+isChromeMobileIOS[1] < 61) return false
    return true
  } else {
    return false
  }
}

function isCompatibleEdge () {
  const isEdge = navigator.userAgent.match(/\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/)
  if (isEdge) {
    if (+isEdge[2] < 17) return false
    return true
  } else {
    return false
  }
}

function isCompatibleFirefox () {
  const isFirefox = navigator.userAgent.match(/Firefox\/([0-9]+)\./)
  if (isFirefox) {
    if (+isFirefox[1] < 51) return false
    return true
  } else {
    return false
  }
}

function isCompatibleFirefoxIOS () {
  const isFirefoxIOS = navigator.userAgent.match(/.*(iPod|iPhone|iPad).*FxiOS\/([0-9]+)/)
  if (isFirefoxIOS) {
    if (+isFirefoxIOS[2] < 9) return false
    return true
  } else {
    return false
  }
}

function isCompatibleSafari () {
  const isSafari = navigator.userAgent.match(/.*Macintosh.*Version\/([[0-9]+).*Safari.*/)
  if (isSafari) {
    if (+isSafari[1] < 10) return false
    return true
  } else {
    return false
  }
}

function isCompatibleSafariIOS () {
  const isSafariIOS = navigator.userAgent.match(/.*(iPhone|iPad).*Version\/([[0-9]+).*Mobile.*Safari.*/)
  if (isSafariIOS) {
    if (+isSafariIOS[1] < 10) return false
    return true
  } else {
    return false
  }
}

function isCompatibleOpera () {
  const isOpera = navigator.userAgent.match(/OPR\/([0-9]+)\./)
  if (isOpera) {
    if (+isOpera[1] < 38) return false
    return true
  } else {
    return false
  }
}

function isCompatibleDefaultAndroid () {
  const isDefaultAndroid = navigator.userAgent.match(/.*Android.*Version\/([[0-9]+).*Mobile.*Safari.*/)
  if (isDefaultAndroid) {
    if (+isDefaultAndroid[1] < 67) return false
    return true
  } else {
    return false
  }
}

function isCompatibleSamsungBrowser () {
  const isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser\/([0-9]+)/)
  if (isSamsungBrowser) {
    if (+isSamsungBrowser[1] < 7) return false
    return true
  } else {
    return false
  }
}
