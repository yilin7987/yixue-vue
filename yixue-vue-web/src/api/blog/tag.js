import request from '@/utils/request'

export function getTagList(params) {
  return request({
    url: 'http://localhost:8000/yixue-web/tag/getList',
    method: 'get',
    params
  })
}
export function getBlogByTagUid(params) {
  return request({
    url: 'http://localhost:8000/yixue-web/tag/getBlogByTagUid',
    method: 'get',
    params
  })
}


