export class FileHelper {
  static deriveFileFromChangeEvent (event) {
    const files = event.target.files || event.dataTransfer.files
    if (!files.length) return
    return files[0]
  }

  static async readFileAsBinaryString (file) {
    // eslint-disable-next-line promise/avoid-new
    return new Promise(function (resolve) {
      // eslint-disable-next-line no-undef
      const reader = new FileReader()

      reader.onload = function (event) {
        resolve(event.target.result)
      }

      reader.readAsBinaryString(file)
    })
  }

  static async readFileAsArrayBuffer (file) {
    // eslint-disable-next-line promise/avoid-new
    return new Promise(function (resolve) {
      // eslint-disable-next-line no-undef
      const reader = new FileReader()

      reader.onload = function (event) {
        resolve(event.target.result)
      }

      reader.readAsArrayBuffer(file)
    })
  }

  static async readFileAsText (file) {
    // eslint-disable-next-line promise/avoid-new
    return new Promise(function (resolve) {
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.onload = function (event) {
        resolve(event.target.result)
      }

      reader.readAsText(file)
    })
  }

  static async readFileAsDataURL (file) {
    // eslint-disable-next-line promise/avoid-new
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.onloadend = (event) => {
        const dataURL = event.target.result
        return resolve(dataURL)
      }
      reader.onerror = (error) => {
        console.error(error)
        return reject(error)
      }
      reader.readAsDataURL(file)
    })
  }

  static async deriveMimeStringFromFile (file) {
    const dataURL = await this.readFileAsDataURL(file)
    return this.deriveMIMEStringFromDataURL(dataURL)
  }

  static async readBlobAsDataURL (blob) {
    // eslint-disable-next-line promise/avoid-new
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.onloadend = (event) => {
        const dataURL = event.target.result
        return resolve({ dataURL })
      }
      reader.onerror = (error) => {
        console.error(error)
        return reject(error)
      }
      reader.readAsDataURL(blob)
    })
  }

  static async readImage (file) {
    // eslint-disable-next-line promise/avoid-new
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      const image = new Image()
      image.src = file
      image.onload = () => {
        return resolve(image)
      }
      image.onerror = (error) => {
        return reject(error)
      }
    })
  }

  static deriveMIMEStringFromDataURL (dataURL) {
    return dataURL.split(',')[0].split(':')[1].split(';')[0]
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
