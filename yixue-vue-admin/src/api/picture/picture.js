import request from '@/utils/request'

export function getPictureList(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/picture/getList',
    method: 'post',
    data: params
  })
}

export function deletePicture(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/picture/delete',
    method: 'post',
    data: params
  })
}

export function addPicture(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/picture/add',
    method: 'post',
    data: params
  })
}
