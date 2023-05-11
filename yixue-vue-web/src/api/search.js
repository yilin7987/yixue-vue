import request from '@/utils/request'

/**
 * 搜索博客
 * @param params
 */
export function searchBlog (params) {
    return request({
        url: 'http://localhost:8000/yixue-web/search/searchBlog',
        method: 'get',
        params
    })
}

export function searchBlogByTag (params) {
    return request({
        url: 'http://localhost:8000/yixue-web/search/searchBlogByTag',
        method: 'get',
        params
    })
}

export function searchBlogBySort (params) {
    return request({
        url: 'http://localhost:8000/yixue-web/search/searchBlogBySort',
        method: 'get',
        params
    })
}

export function searchBlogByAuthor (params) {
    return request({
        url:  'http://localhost:8000/yixue-web/search/searchBlogByAuthor',
        method: 'get',
        params
    })
}
