import request from '@/utils/request'

export function getBlogSortList (params) {
    return request({
        url: 'http://localhost:8000/yixue-web/blogSort/getBlogSortList',
        method: 'get',
        params
    })
}

export function getBlogByBlogSortUid (params) {
    return request({
        url: 'http://localhost:8000/yixue-web/blogSort/getBlogByBlogSortUid',
        method: 'get',
        params
    })
}
