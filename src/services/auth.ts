/*
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-04-02 17:05:36
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-22 15:52:18
 */
import { getCookie, setCookie } from '@/utils/cookie'
import type { AuthConfig, AuthState, UserInfo } from '@/types/auth'
import { getToken, queryUserInfo,getOaToken } from '@/api/user'
import ServiceUrl from '@/utils/url'
import { decrypt } from '@/utils/encrypt'
import { setUserInfoStorage, getUserInfoStorage, clearUserInfoStorage } from '@/utils/userInfoStorage'

class AuthService {
  private config: AuthConfig = {
    thirdPartyLoginUrl: `${ServiceUrl.getQmSysUrl()}${import.meta.env.VITE_APP_THIRD_PARTY_LOGIN_URL}`,
    // thirdPartyLoginUrl: 'http://10.205.25.128:8088/oauth/authorize?response_type=code&client_id=mbqyzx',
    codeCookieName: 'auth_code',
    userInfoCookieName: 'user_info',
    deptInfoCookieName: 'dept_info',
    tokenName:'token',
    tokenNameFromOa:'oa_token',
    redirectUrl: ServiceUrl.clientUrl,
    logout: `${ServiceUrl.getQmSysUrl()}${import.meta.env.VITE_APP_LOGOUT_URL}`
    // redirectUrl: 'http://localhost:5179/'
  }

  private readonly loginUrl = import.meta.env.VITE_APP_THIRD_PARTY_LOGIN_URL

  public setConfig (config: Partial<AuthConfig>): void {
    this.config = { ...this.config, ...config }
  }

  public getAuthState (): AuthState {
    const code = getCookie(this.config.codeCookieName)
    let userInfo: UserInfo | null = getUserInfoStorage()

    // 兼容旧数据：cookie 中还存在 user_info 时自动迁移到 localStorage
    if (!userInfo) {
      const userInfoStr: any = decodeURIComponent(getCookie(this.config.userInfoCookieName) as any)
      if (userInfoStr) {
        try {
          userInfo = decrypt(userInfoStr)
          if (!userInfo) {
            userInfo = JSON.parse(userInfoStr)
          }
          if (userInfo) {
            setUserInfoStorage(userInfo)
            // 迁移完成后清掉，避免重复占用 cookie 配额
            setCookie(this.config.userInfoCookieName, '', -1)
          }
        } catch (e) {
          console.error('Failed to parse user info from cookie:', e)
        }
      }
    }

    return {
      isAuthenticated: !!code && !!userInfo,
      code,
      userInfo
    }
  }

  public getCodeFromCookie (): string | null {
    return getCookie(this.config.codeCookieName) || ''
  }

  // eslint-disable-next-line class-methods-use-this
  public getCodeFromUrl (): string | null {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('code')
  }

  // eslint-disable-next-line class-methods-use-this
  private clearCodeFromUrl (): void {
    const url = new URL(window.location.href)
    url.searchParams.delete('code')
    window.history.replaceState({}, document.title, url.toString())
  }

 // eslint-disable-next-line class-methods-use-this
  private clearOaParamsFromUrl (): void {
    const url = new URL(window.location.href)
    url.searchParams.delete('loginType')
    url.searchParams.delete('token')
    window.history.replaceState({}, document.title, url.toString())
  }

  public saveCodeFromUrl (): boolean {
    const code = this.getCodeFromUrl()
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    // 检查是否oa那边的跳转页面
    if(urlParams.get('loginType') === 'oa' && token){
      // 设置code, 前端判断是否登陆逻辑是根据是否存在code的cookie，在这里需要保存code
      setCookie(this.config.codeCookieName, 'oa', 7)
      // 清除用户信息，防止拿到的旧用户
      setCookie(this.config.userInfoCookieName, '', -1)
      // 保存oa传来的token
      setCookie(this.config.tokenNameFromOa, token, 0.2)
      this.clearOaParamsFromUrl()
      return true
    }
    if (code) {
      setCookie(this.config.codeCookieName, code, 7)
      this.clearCodeFromUrl()
      return true
    }
    return false
  }


  public redirectToThirdPartyLogin (): void {
   // eslint-disable-next-line prefer-template
  // console.log(this.config.thirdPartyLoginUrl + '&redirect_uri=' + encodeURIComponent(this.config.redirectUrl) + '&oauthType=default');
   // eslint-disable-next-line prefer-template
   window.location.href = this.config.thirdPartyLoginUrl + '&redirect_uri=' + encodeURIComponent(this.config.redirectUrl) + '&oauthType=default'
 }

  // eslint-disable-next-line class-methods-use-this
  public async fetchUserInfo(code: string): Promise<any | null> {
  try {
    const redirectUri = this.config.redirectUrl
    const oaToken = getCookie(this.config.tokenNameFromOa)
    const res = code === 'oa' ? await getOaToken<any>({token:oaToken,redirectUri}):  await getToken<any>({authCode:code,redirectUri});
    const resData = res?.data;
    if(resData){
      // 设置齐明系统需要的token
      localStorage.setItem('Championsoft-Token', resData)
    }
   

    const ret = await queryUserInfo<any>({  });
    const userInfo = ret?.data;
    
    if (userInfo) {
      this.saveUserInfo(userInfo);
      // this.saveUserInfo({...userInfo, name: userInfo.username, dept: userInfo.departmentName});
      return userInfo;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }
}

public saveUserInfo (userInfo: UserInfo): void {
  // 完整 userInfo（含 permission）改用 localStorage 存储，规避 cookie 4KB 限制
  setUserInfoStorage(userInfo)
  // 兼容：清掉残留的 cookie user_info（如果之前是用 cookie 写入的）
  setCookie(this.config.userInfoCookieName, '', -1)
}

public getUserInfo (): UserInfo | null {
  return this.getAuthState().userInfo
}

  public hasUserInfo (): boolean {
    return !!this.getUserInfo()
  }

  public async ensureUserInfo (): Promise<boolean> {
    const code = getCookie(this.config.codeCookieName)
    if (!code) {
      return false
    }

    if (this.hasUserInfo()) {
      return true
    }

    const userInfo = await this.fetchUserInfo(code)
    return !!userInfo
  }

   public saveDeptInfo (deptInfo: any): void {
    localStorage.setItem(this.config.deptInfoCookieName, JSON.stringify(deptInfo))
  }

   public getDeptInfo (): any {
    try {
      const deptInfo = localStorage.getItem(this.config.deptInfoCookieName);

      if (deptInfo === null || deptInfo === undefined) {
        return null;
      }

      try {
        return JSON.parse(deptInfo);
      } catch (parseError) {
        console.log('parseError', parseError)
        localStorage.removeItem(this.config.deptInfoCookieName);
        return null;
      }

    } catch (error) {
      console.error('error', error)
      return null;
    }
  }
  

  public logout (): void {

    setCookie(this.config.codeCookieName, '', -1)
    setCookie(this.config.userInfoCookieName, '', -1)
    clearUserInfoStorage()

    // eslint-disable-next-line prefer-template
    window.location.href = this.config.logout + '&redirect_uri=' + encodeURIComponent(this.config.redirectUrl)
    /*
    logout<any>({}).then((res: any) => {
      console.log('res:', res)
      this.redirectToThirdPartyLogin();
    });
    */
  }

  public isAuthenticated (): boolean {
    return this.getAuthState().isAuthenticated
  }

  public loginTimeout(){
    setCookie(this.config.codeCookieName, '', -1)
    setCookie(this.config.userInfoCookieName, '', -1)
    setCookie(this.config.tokenName, '', -1)
    clearUserInfoStorage()
    window.location.reload()
  }
}

export const authService = new AuthService()
export default authService
