import request from "@/utils/auth-request.js";
// import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/api/auth/getRouters',
    method: 'get'
  })
}