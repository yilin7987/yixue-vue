import request from '@/utils/request'

export function getBlogSortList(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/blogSort/getList',
    method: 'post',
    data: params
  })
}

export function addBlogSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/blogSort/add',
    method: 'post',
    data: params
  })
}
export function editBlogSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/blogSort/edit',
    method: 'post',
    data: params
  })
}

export function deleteBlogSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/blogSort/delete',
    method: 'post',
    data: params
  })
}
