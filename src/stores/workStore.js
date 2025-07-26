// stores/work.js
import { defineStore } from 'pinia'

export const useWorkStore = defineStore('work', {
  state: () => ({
    worState: '', // input、analyze、finish
    loading: false,
    error: null,
    workStep: '', // 人群分析、模板匹配、视频生成 - persona、template、storyboard
  }),
  actions: {},
})
