import request from '@/utils/request'

export function getTagList(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/tag/getList',
    method: 'post',
    data: params
  })
}

export function addTag(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/tag/add',
    method: 'post',
    data: params
  })
}

export function editTag(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/tag/edit',
    method: 'post',
    data: params
  })
}

export function deleteTag(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/tag/delete',
    method: 'post',
    data: params
  })
}

