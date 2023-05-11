import request from '@/utils/request'

export function getSubjectList(params) {
    return request({
        url:  'http://localhost:8000/yixue-web/subject/getList',
        method: 'post',
        data: params
    })
}

export function getSubjectItemList(params) {
    return request({
        url: 'http://localhost:8000/yixue-web/subjectItem/getItemList',
        method: 'post',
        data: params
    })
}



