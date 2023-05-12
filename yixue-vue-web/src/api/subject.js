import request from '@/utils/request'

export function getSubjectList(params) {
    return request({
        url:  process.env.VUE_APP_WEB_API+'/subject/getList',
        method: 'post',
        data: params
    })
}

export function getSubjectItemList(params) {
    return request({
        url: process.env.VUE_APP_WEB_API+'/subjectItem/getItemList',
        method: 'post',
        data: params
    })
}



