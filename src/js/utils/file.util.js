/**
 * @class
 *
 * FileUtil mostly used to wrap FileReader object methods by encapsulating
 * painful work with `onload` and `onerror` listeners, so instead of:
 *
 * const reader = new FileReader()
 * reader.onload = function unwrapEventAndDoYourStuff() {}
 * reader.onerror = function handleError() {}
 * reader.readAsDataURL(file)
 *
 * you'll simply doing:
 *
 * const result = await FileUtil.getDataUrl(file)
 * doYourStuff(file)
 */
export class FileNotPresentInEventError extends Error {
  constructor (...args) {
    super(...args)
    Error.captureStackTrace(this, FileNotPresentInEventError)
  }
}

export class FileUtil {
  static getFileFromEvent (event) {
    const files = event.target.files || event.dataTransfer.files

    if (!files.length) {
      throw new FileNotPresentInEventError('No file present in event')
    }

    return files[0]
  }

  static readFile (file, readFnName) {
    /* eslint-disable-next-line promise/avoid-new */
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = function (event) {
        resolve(event.target.result)
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader[readFnName](file)
    })
  }

  static getBinaryString (file) {
    return this.readFile(file, 'readAsBinaryString')
  }

  static getArrayBuffer (file) {
    return this.readFile(file, 'readAsArrayBuffer')
  }

  static getText (file) {
    return this.readFile(file, 'readAsText')
  }

  static getDataUrl (file) {
    return this.readFile(file, 'readAsDataURL')
  }

  static async getMimeString (file) {
    const dataUrl = await this.getDataUrl(file)

    if (!dataUrl) {
      throw new Error('Failed to get data URL from file')
    }

    return dataUrl
      .split(',')[0]
      .split(':')[1]
      .split(';')[0]
  }

  static async readImage (file) {
    const dataUrl = await this.getDataUrl(file)

    /* eslint-disable-next-line promise/avoid-new */
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = dataUrl
      image.onload = () => {
        return resolve(image)
      }
      image.onerror = (error) => {
        return reject(error)
      }
    })
  }

  static arrayBufferToString (buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf))
  }

  static stringToArrayBuffer (str) {
    const buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
    const bufView = new Uint16Array(buf)
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i)
    }
    return buf
  }
}
