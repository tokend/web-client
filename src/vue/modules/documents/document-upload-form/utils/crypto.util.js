export class CryptoUtil {
  static async sha256 (msg) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(msg)
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

    return new Uint8Array(hashBuffer)
  }

  static convertHashBufferToHex (hashBuffer) {
    return Array
      .from(new Uint8Array(hashBuffer))
      .map(b => ('00' + b.toString(16)).slice(-2))
      .join('')
  }
}
