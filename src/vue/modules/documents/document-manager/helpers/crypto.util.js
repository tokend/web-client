export class CryptoUtil {
  static async sha256 (msg) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(msg)
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

    return new Uint8Array(hashBuffer)
  }

  static toHex (arrayBuffer) {
    return Array
      .from(new Uint8Array(arrayBuffer))
      .map(b => ('00' + b.toString(16)).slice(-2))
      .join('')
  }

  static async hashMessage (msg) {
    const hashBuffer = await this.sha256(msg)
    return this.toHex(hashBuffer)
  }
}
