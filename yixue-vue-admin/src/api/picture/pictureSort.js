import request from '@/utils/request'

export function getPictureSortList(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/pictureSort/getList',
    method: 'post',
    data: params
  })
}
export function deletePictureSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/pictureSort/delete',
    method: 'post',
    data: params
  })
}

export function addPictureSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/pictureSort/add',
    method: 'post',
    data: params
  })
}

export function editPictureSort(params) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/pictureSort/edit',
    method: 'post',
    data: params
  })
}
