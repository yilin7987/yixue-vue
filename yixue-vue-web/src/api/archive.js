import request from '@/utils/request'

export function getArchiveList (params) {
    return request({
        url: 'http://localhost:8000/yixue-web/blog/getArchiveList',
        method: 'get',
        params
    })
}

export function getBlogByMonth (params) {
    return request({
        url: 'http://localhost:8000/yixue-web/blog/getBlogByMonth',
        method: 'get',
        params
    })
}
