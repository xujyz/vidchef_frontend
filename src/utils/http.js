import axios from 'axios'

const BASE_PREFIX = 'http://47.98.235.33:8000'

// 创建实例
const http = axios.create({
  // 前缀
  baseURL: BASE_PREFIX,
  // 超时
  timeout: 1000 * 30,
  // 请求头
  headers: {
    'Content-Type': 'application/json',
  },
})

// // 请求拦截器
// http.interceptors.request.use(
//   (config) => {
//     // console.log(config)
//     // TODO 在这里可以加   上想要在请求发送前处理的逻辑
//     // TODO 比如 loading 等
//     // if (mainStore.token) {
//     //   config.params = { token: mainStore.token, ...config.params };
//     // }

//        // 从 localStorage 或 Pinia 获取 token
//     const token = localStorage.getItem('token') || '';

//     if (token) {
//       config.params = {
//         ...config.params, // 保留原有 params
//         token,            // 添加 token
//       };
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// 响应拦截器
// http.interceptors.response.use(
//   (response) => {
//     if (response.status === 200) {
//       if (response.data.code === 401) handleLoginFailure()
//       if (![200, 204].includes(response.data?.code) && response?.data?.msg) {
//         ElMessage.error({ message: response.data.msg, duration: 3 * 1000 })
//       }
//       if (response.data.toString() === '[object Blob]') {
//         return { ...response, headers: response.headers }
//       } else {
//         return response.data
//       }
//     }
//     ElMessage.info(JSON.stringify(response.status))
//     return response
//   },
//   (error) => {
//     // console.log(error)
//     const { response } = error
//     if (response) {
//       ElMessage.error({ message: error.message, duration: 3 * 1000 })
//       return Promise.reject(response.data)
//     }
//     ElMessage.warning('网络连接异常,请稍后再试!')
//     return Promise.reject(error)
//   },
// )

export default http
