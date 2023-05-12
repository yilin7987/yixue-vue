import request from '@/utils/request'

export function getBlogSortList (params) {
    return request({
        url: process.env.VUE_APP_WEB_API+'/blogSort/getBlogSortList',
        method: 'get',
        params
    })
}

export function getBlogByBlogSortUid (params) {
    return request({
        url: process.env.VUE_APP_WEB_API+'/blogSort/getBlogByBlogSortUid',
        method: 'get',
        params
    })
}
