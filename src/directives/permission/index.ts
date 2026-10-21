
// 定义一些和权限有关的 Vue指令
import authService from '@/services/auth';

import type { Directive } from 'vue'
// 必须包含列出的所有权限，元素才显示
export const hasPermission:Directive = {
  beforeMount(el, binding) {
    const permissions:any = authService.getUserInfo()?.permission || []
    const { value } = binding
    if (!value.every((v: any) => permissions.includes(v))) {
      if (!el.parentNode) {
        el.style.display = 'none'
      } else {
        el.parentNode.removeChild(el)
      }
    }
  },
}

// 当不包含列出的权限时，渲染该元素
export const hasNoPermission:Directive = {
  beforeMount(el, binding) {
    const permissions:any = authService.getUserInfo()?.permission || []
    const { value } = binding
    if (value.some((v: any) => permissions.includes(v))) {
      if (!el.parentNode) {
        el.style.display = 'none'
      } else {
        el.parentNode.removeChild(el)
      }
    }
  },
}

// 只要包含列出的任意一个权限，元素就会显示
export const hasAnyPermission:Directive = {
  beforeMount(el, binding) {
    const permissions:any = authService.getUserInfo()?.permission || []
    const { value } = binding
    if (!value.some((v: any) => permissions.includes(v))) {
      if (!el.parentNode) {
        el.style.display = 'none'
      } else {
        el.parentNode.removeChild(el)
      }
    }
  },
}
