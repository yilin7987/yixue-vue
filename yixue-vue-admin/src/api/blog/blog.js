import request from '@/utils/request'

export function getBlogList(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/blog/getList',
    method: 'post',
    data: params
  })
}
export function addBlog(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/blog/add',
    method: 'post',
    data: params
  })
}
export function editBlog(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/blog/edit',
    method: 'post',
    data: params
  })
}
export function editRecommendBlog(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/blog/editRecommend',
    method: 'post',
    data: params
  })
}
export function deleteBlog(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/blog/delete',
    method: 'post',
    data: params
  })
}

