import axios from 'axios'
import { Message } from 'element-ui'
import {getCookie} from "@/utils/cookieUtils";

// 创建axios实例
const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

service.defaults.headers.common['Authorization'] = getCookie("token-web")

// request拦截器
service.interceptors.request.use(
    config => {
      if (getCookie("token-web") != undefined) {
        config.headers.Authorization = getCookie("token-web") // 让每个请求携带自定义token 请根据实际情况自行修改
      }
      return config
    },
    error => {
      // Do something with request error
      console.log(error) // for debug
      Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
