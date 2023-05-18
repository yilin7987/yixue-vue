import request from '@/utils/request'

export function recorderVisitPage () {
    return request({
        url: process.env.VUE_APP_WEB_API + '/index/recorderVisitPage',
        method: 'get',
    })
}
