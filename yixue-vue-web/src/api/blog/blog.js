import request from '@/utils/request'

export function getBlogByLevel(params) {
  return request({
    url:   process.env.VUE_APP_WEB_API+'/blog/getBlogByLevel',
    method: 'get',
    params
  })
}
export function getNewBlog(params) {
  return request({
    url:   process.env.VUE_APP_WEB_API+'/blog/getList',
    method: 'post',
    data: params
  })
}
export function getBlogByUid(params) {
  return request({
    url:   process.env.VUE_APP_WEB_API+'/blog/getBlogByUid',
    method: 'get',
    params
  })
}
export function getHotBlog (params) {
  return request({
    url: process.env.VUE_APP_WEB_API+'/blog/getHotBlog',
    method: 'get',
    params
  })
}
export function getSimilarityBlogUid (params) {
  return request({
    url: process.env.VUE_APP_WEB_API+'/blog/getSimilarityBlogUid',
    method: 'get',
    params
  })
}


