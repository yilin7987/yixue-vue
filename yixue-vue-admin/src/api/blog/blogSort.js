import request from '@/utils/request'

export function getBlogSortList(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/blogSort/getList',
    method: 'post',
    data: params
  })
}

export function addBlogSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/blogSort/add',
    method: 'post',
    data: params
  })
}
export function editBlogSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/blogSort/edit',
    method: 'post',
    data: params
  })
}

export function deleteBlogSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/blogSort/delete',
    method: 'post',
    data: params
  })
}
