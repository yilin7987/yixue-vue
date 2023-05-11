import request from '@/utils/request'

export function getBlogByLevel(params) {
  return request({
    url:   'http://localhost:8000/yixue-web/blog/getBlogByLevel',
    method: 'get',
    params
  })
}
export function getNewBlog(params) {
  return request({
    url:   'http://localhost:8000/yixue-web/blog/getList',
    method: 'post',
    data: params
  })
}
export function getBlogByUid(params) {
  return request({
    url:   'http://localhost:8000/yixue-web/blog/getBlogByUid',
    method: 'get',
    params
  })
}
export function getHotBlog (params) {
  return request({
    url: 'http://localhost:8000/yixue-web/blog/getHotBlog',
    method: 'get',
    params
  })
}
export function getSimilarityBlogUid (params) {
  return request({
    url: 'http://localhost:8000/yixue-web/blog/getSimilarityBlogUid',
    method: 'get',
    params
  })
}


