import request from '@/utils/request'
export function init() {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/index/init',
    method: 'get'
  })
}
export function getBlogCountByTag() {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/index/getBlogCountByTag',
    method: 'get'
  })
}

export function getBlogCountByBlogSort() {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/index/getBlogCountByBlogSort',
    method: 'get'
  })
}
