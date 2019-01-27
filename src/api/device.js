import request from '@/utils/request'

export function getDeviceList(params) {
  return request({
    url: '/devices/',
    method: 'get',
    params
  })
}

export function getDevice(id) {
  return request({
    url: `/devices/${id}/`,
    method: 'get'
  })
}

export function createDevice(data) {
  return request({
    url: '/devices/',
    method: 'post',
    data
  })
}

export function batchCreateDevice(data) {
  return request({
    url: '/devices/batch/',
    method: 'post',
    data
  })
}

export function deleteDevice(id) {
  return request({
    url: `/devices/${id}/`,
    method: 'delete'
  })
}
