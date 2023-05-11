import request from '@/utils/request'

export function localLogin (params) {
    return request({
        url:  'http://localhost:8000/yixue-web/user/login',
        method: 'post',
        data: params
    })
}

export function authVerify (params) {
    return request({
        url:  'http://localhost:8000/yixue-web/user/verify/'+params,
        method: 'get',
    })
}
export function deleteToken(params) {
    return request({
        url: 'http://localhost:8000/yixue-web/user/deleteToken/' + params,
        method: 'post',
    })
}

export function editUser(params) {
    return request({
        url: 'http://localhost:8000/yixue-web/user/editUser',
        method: 'post',
        data: params
    })
}

/**
 * 更新用户密码
 * @param params
 */
export function updateUserPwd(params) {
    return request({
        url: 'http://localhost:8000/yixue-web/user/updateUserPwd',
        method: 'post',
        data: params
    })
}

/**
 * 本地注册
 * @param params
 */
export function localRegister(params) {
    return request({
        url: 'http://localhost:8000/yixue-web/user/register',
        method: 'post',
        data: params
    })
}

//获取验证码
export function getEmailCode(params) {
    return request({
        url: 'http://localhost:8000/yixue-web/user/getCode',
        method: 'get',
        params:{
            email:params
        }
    })
}



