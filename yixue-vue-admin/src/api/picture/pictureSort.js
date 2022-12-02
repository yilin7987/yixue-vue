import request from '@/utils/request'

export function getPictureSortList(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/pictureSort/getList',
    method: 'post',
    data: params
  })
}
export function getPictureSortByUid(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/pictureSort/getPictureSortByUid',
    method: 'post',
    data: params
  })
}
export function deletePictureSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/pictureSort/delete',
    method: 'post',
    data: params
  })
}

export function addPictureSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/pictureSort/add',
    method: 'post',
    data: params
  })
}

export function editPictureSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/pictureSort/edit',
    method: 'post',
    data: params
  })
}
