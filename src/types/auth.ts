/*
 * @Descripttion: 
 * @Author: zhaochao
 * @Date: 2025-10-13 11:59:32
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-17 10:10:02
 */
export interface AuthConfig {
  thirdPartyLoginUrl: string
  codeCookieName: string
  userInfoCookieName: string
  deptInfoCookieName: string
  redirectUrl: string
  logout: string,
  tokenName:string,
  tokenNameFromOa:string
}

export interface UserInfo {
  id: string | number
  name: string
  email?: string
  avatar?: string
  [key: string]: unknown
}

export interface AuthState {
  isAuthenticated: boolean
  code: string | null
  userInfo: UserInfo | null
}
