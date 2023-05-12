import request from '@/utils/request'

export function getTagList(params) {
  return request({
    url: process.env.VUE_APP_WEB_API+'/tag/getList',
    method: 'get',
    params
  })
}
export function getBlogByTagUid(params) {
  return request({
    url: process.env.VUE_APP_WEB_API+'/tag/getBlogByTagUid',
    method: 'get',
    params
  })
}


