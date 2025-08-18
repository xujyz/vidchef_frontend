import http from '@/utils/http.js'

// 生成商品tags
export const genProdTags = (data) => {
  return http.request({
    url: '/api/gen/llm/gen_tag',
    method: 'post',
    data,
  })
}

//分析目标人群
export const genTargetConsr = (data) => {
  return http.request({
    url: '/api/gen/llm/rec_target_consr',
    method: 'post',
    data,
  })
}

//生成分镜脚本
export const genScripts = (data) => {
  return http.request({
    url: '/api/gen/llm/gen_script',
    method: 'post',
    data,
  })
}

//分镜视频检索
export const searchVideo = (data) => {
  return http.request({
    url: '/api/search/video',
    method: 'post',
    data,
  })
}

//替换音频
export const genTts = (data) => {
  return http.request({
    url: '/api/gen/tts',
    method: 'post',
    data,
  })
}

//视频导出
export const exportVideo = (data) => {
  return http.request({
    url: '/api/export/video',
    method: 'post',
    data,
  })
}
