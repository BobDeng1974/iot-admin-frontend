import request from '@/utils/request'

export function getProductList(params) {
  return request({
    url: '/products/',
    method: 'get',
    params
  })
}

export function getProduct(id) {
  return request({
    url: `/products/${id}/`,
    method: 'get'
  })
}

export function createProduct(data) {
  return request({
    url: '/products/',
    method: 'post',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: `/products/${id}/`,
    method: 'delete'
  })
}
