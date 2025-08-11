import http from '@/utils/http.js'

// 终端账号
export const getTerminalList = (params) => {
  return http.request({
    url: '/api/terminal/list',
    method: 'get',
    params: { ...params },
  })
}

//单位账号
export const getUserList = (params) => {
  return http.request({
    url: '/api/user/list',
    method: 'get',
    params: { ...params },
  })
}

//操作日志
export const getOperateLogList = (params) => {
  return http.request({
    url: '/api/operationLog/getList',
    method: 'get',
    params: { ...params },
  })
}

//实时作业人员

export const getCurrentUser = () => {
  return http.request({
    url: '/api/monitor/currentUser',
    method: 'get',
  })
}

//订单
export const getOrderList = (data) => {
  return http.request({
    url: '/api/productOrder/list',
    method: 'post',
    data,
  })
}

//统计分析
export const getStatisticsList = () => {
  return http.request({
    url: '/api/statistics/overview',
    method: 'get',
    // data:{...data,token}
  })
}

//终端作业记录
export const getOnlineRecords = (data) => {
  return http.request({
    url: '/api/monitor/terminalOnlineRecords',
    method: 'get',
    params: { ...data },
    // data:{...data,token}
  })
}
