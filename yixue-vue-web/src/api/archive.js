import request from '@/utils/request'

export function getArchiveList (params) {
    return request({
        url: process.env.VUE_APP_WEB_API+'/blog/getArchiveList',
        method: 'get',
        params
    })
}

export function getBlogByMonth (params) {
    return request({
        url: process.env.VUE_APP_WEB_API+'/blog/getBlogByMonth',
        method: 'get',
        params
    })
}
