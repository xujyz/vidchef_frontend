import http from '@/utils/http.js'
import axios from 'axios'

// 生成商品tags
export const genProdTags = (data) => {
  return http.request({
    url: '/api/gen/llm/gen_tag',
    method: 'post',
    data,
  })
}

//分析目标人群
export const genTargetConsr = (data, onMessage, onComplete, onError) => {
  const source = axios.CancelToken.source()
  // 正确声明lastIndex变量，初始值为0
  let lastIndex = 0

  http
    .request({
      url: '/api/gen/llm/rec_target_consr',
      method: 'post',
      data,
      responseType: 'stream',
      cancelToken: source.token,
      onDownloadProgress: (progressEvent) => {
        const responseText = progressEvent.event.target.responseText
        // 只处理新接收的内容
        const newContent = responseText.substring(lastIndex)
        // 更新已处理位置
        lastIndex = responseText.length

        if (newContent) {
          const lines = newContent.split('\n')
          for (const line of lines) {
            const trimmedLine = line.trim()
            if (trimmedLine === '') continue // 跳过空行

            if (trimmedLine.startsWith('data:')) {
              const dataStr = trimmedLine.slice(5).trim()

              if (dataStr === '[DONE]') {
                onComplete?.()
                return
              }

              try {
                const jsonData = JSON.parse(dataStr)
                onMessage?.(jsonData)
              } catch (e) {
                onError?.(new Error('解析SSE数据失败: ' + e.message))
              }
            }
          }
        }
      },
    })
    .catch((error) => {
      if (!axios.isCancel(error)) {
        onError?.(error)
      }
    })

  return () => source.cancel('手动取消请求')
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
