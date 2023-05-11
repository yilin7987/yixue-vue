import request from '@/utils/request'

export function getCommentList (params) {
  return request({
    url: 'http://localhost:8000/yixue-web/comment/getList',
    method: 'post',
    data: params
  })
}

export function getCommentListByUser (params) {
  return request({
    url: 'http://localhost:8000/yixue-web/comment/getListByUser',
    method: 'post',
    data: params
  })
}

export function getPraiseListByUser (params) {
  return request({
    url: 'http://localhost:8000/yixue-web/comment/getPraiseListByUser',
    method: 'post',
    data: params
  })
}

export function addComment (params) {
  return request({
    url: 'http://localhost:8000/yixue-web/comment/add',
    method: 'post',
    data: params
  })
}

export function deleteComment (params) {
  return request({
    url: process.env.WEB_API + '/web/comment/delete',
    method: 'post',
    data: params
  })
}



export function getUserReceiveCommentCount (params) {
  return request({
    url: 'http://localhost:8000/yixue-web/comment/getUserReceiveCommentCount',
    method: 'get',
    params
  })
}

export function readUserReceiveCommentCount (params) {
  return request({
    url: 'http://localhost:8000/yixue-web/comment/readUserReceiveCommentCount',
    method: 'post',
    params
  })
}

/**
 * 点赞
 * @param params
 * @returns {*}
 */
export function praiseBlogByUid (params) {
  return request({
    url: 'http://localhost:8000/yixue-web/comment/praiseBlogByUid',
    method: 'get',
    params
  })
}

export function isPraiseByUser (params) {
  return request({
    url: 'http://localhost:8000/yixue-web/comment/isPraise',
    method: 'get',
    params
  })
}
