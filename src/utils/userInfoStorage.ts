import { encrypt, decrypt } from '@/utils/encrypt'

const USER_INFO_KEY = 'gtf_user_info'

export const setUserInfoStorage = (userInfo: any): void => {
  try {
    const encrypted = encrypt(userInfo)
    localStorage.setItem(USER_INFO_KEY, encrypted)
  } catch (error) {
    console.error('[userInfoStorage] setUserInfoStorage failed:', error)
  }
}

export const getUserInfoStorage = (): any | null => {
  try {
    const encrypted = localStorage.getItem(USER_INFO_KEY)
    if (!encrypted) return null
    const decrypted = decrypt(encrypted)
    if (decrypted) return decrypted
    try {
      return JSON.parse(encrypted)
    } catch {
      return null
    }
  } catch (error) {
    console.error('[userInfoStorage] getUserInfoStorage failed:', error)
    return null
  }
}

export const clearUserInfoStorage = (): void => {
  localStorage.removeItem(USER_INFO_KEY)
}

export default {
  setUserInfoStorage,
  getUserInfoStorage,
  clearUserInfoStorage,
}