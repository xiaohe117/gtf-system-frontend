
import type { App, Directive } from 'vue'
import { hasPermission, hasNoPermission, hasAnyPermission } from './permission'

// 全局注册所有自定义指令
const directives: Record<string, Directive> = {
  hasPermission,
  hasNoPermission,
  hasAnyPermission,
}

export default {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  },
}
