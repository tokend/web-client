export class CryptoUtil {
  static async getAccountHash (msg) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(msg)
    // hash the message
    const hashBuffer = new Uint8Array(await crypto.subtle.digest('SHA-256', msgBuffer))

    // const resultBuffer = new Uint8Array(16)
    // resultBuffer.forEach((item, index, buffer) => {
    //   buffer[index] = hashBuffer[index] ^ hashBuffer[16 + index]
    // })

    return hashBuffer
  }

  static toHex (arrayBuffer) {
    return Array
      .from(new Uint8Array(arrayBuffer))
      .map(b => ('00' + b.toString(16)).slice(-2))
      .join('')
  }
}
