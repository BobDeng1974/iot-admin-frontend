import request from '@/utils/request'

export function getGroupList(params) {
  return request({
    url: '/groups/',
    method: 'get',
    params
  })
}

export function getGroupTree(params) {
  return request({
    url: '/groups/tree/',
    method: 'get',
    params
  })
}

export function getGroup(id) {
  return request({
    url: `/groups/${id}/`,
    method: 'get'
  })
}

export function createGroup(data) {
  return request({
    url: '/groups/',
    method: 'post',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: `/groups/${id}/`,
    method: 'delete'
  })
}
