import request from '@/utils/request'

export function getTagList(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/tag/getList',
    method: 'post',
    data: params
  })
}

export function addTag(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/tag/add',
    method: 'post',
    data: params
  })
}

export function editTag(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/tag/edit',
    method: 'post',
    data: params
  })
}

export function deleteTag(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/tag/delete',
    method: 'post',
    data: params
  })
}

