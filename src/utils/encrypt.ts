import CryptoJS from 'crypto-js'

// 加密密钥，从环境变量读取
const ENCRYPT_KEY = import.meta.env.VITE_ENCRYPT_KEY || 'gtf-admin-default-key-2024'

/**
 * AES 加密
 * @param data 要加密的数据（对象或字符串）
 * @returns 加密后的字符串
 */
export const encrypt = (data: any): string => {
  try {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data)
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPT_KEY).toString()
    return encrypted
  } catch (error) {
    console.error('Encryption failed:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * AES 解密
 * @param encryptedData 加密后的字符串
 * @returns 解密后的原始数据
 */
export const decrypt = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPT_KEY)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    
    if (!decryptedString) {
      throw new Error('Decryption produced empty result')
    }
    
    return JSON.parse(decryptedString)
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}

export default {
  encrypt,
  decrypt
}
