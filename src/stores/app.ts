import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const tagsViewVisible = ref(false) // 默认显示TagView
  const tagsView = ref<Array<{ name: string; path: string; title: string }>>([])

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  const toggleTagsView = () => {
    tagsViewVisible.value = !tagsViewVisible.value
    // 保存配置到localStorage
    localStorage.setItem('tagsViewVisible', String(tagsViewVisible.value))
  }

  const setTagsViewVisible = (visible: boolean) => {
    tagsViewVisible.value = visible
    localStorage.setItem('tagsViewVisible', String(visible))
  }

  const initTagsViewVisible = () => {
    const saved = localStorage.getItem('tagsViewVisible')
    if (saved !== null) {
      tagsViewVisible.value = saved === 'true'
    }
  }

  const addTagsView = (tag: { name: string; path: string; title: string }) => {
    const exists = tagsView.value.find(item => item.path === tag.path)
    if (!exists) {
      tagsView.value.push(tag)
    }
  }

  const removeTagsView = (path: string) => {
    const index = tagsView.value.findIndex(item => item.path === path)
    if (index > -1) {
      tagsView.value.splice(index, 1)
    }
  }

  const clearTagsView = () => {
    tagsView.value = []
  }

  return {
    sidebarCollapsed,
    tagsViewVisible,
    tagsView,
    toggleSidebar,
    setSidebarCollapsed,
    toggleTagsView,
    setTagsViewVisible,
    initTagsViewVisible,
    addTagsView,
    removeTagsView,
    clearTagsView
  }
})