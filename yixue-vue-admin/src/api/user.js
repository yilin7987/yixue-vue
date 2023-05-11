import request from '@/utils/request'

export function login(data) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: process.env.VUE_APP_ADMIN_API + '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
