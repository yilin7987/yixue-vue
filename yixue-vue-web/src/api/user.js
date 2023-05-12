import request from '@/utils/request'

export function localLogin (params) {
    return request({
        url:  process.env.VUE_APP_WEB_API+'/user/login',
        method: 'post',
        data: params
    })
}

export function authVerify (params) {
    return request({
        url:  process.env.VUE_APP_WEB_API+'/user/verify/'+params,
        method: 'get',
    })
}
export function deleteToken(params) {
    return request({
        url: process.env.VUE_APP_WEB_API+'/user/deleteToken/' + params,
        method: 'post',
    })
}

export function editUser(params) {
    return request({
        url: process.env.VUE_APP_WEB_API+'/user/editUser',
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
        url: process.env.VUE_APP_WEB_API+'/user/updateUserPwd',
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
        url: process.env.VUE_APP_WEB_API+'/user/register',
        method: 'post',
        data: params
    })
}

//获取验证码
export function getEmailCode(params) {
    return request({
        url: process.env.VUE_APP_WEB_API+'/user/getCode',
        method: 'get',
        params:{
            email:params
        }
    })
}



