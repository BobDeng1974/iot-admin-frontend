import request from '@/utils/request'

// 获取token
export function login(mobile, password) {
  const data = {
    mobile,
    password
  }
  return request({
    url: '/token/',
    method: 'post',
    data
  })
}
