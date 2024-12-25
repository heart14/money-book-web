import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8080',//url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // 请求头中添加token
    //   config.headers['Authorization'] = getToken()
    // }
    return config
  },
  error => {
    // 异常处理
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    console.log('res:' +res) 

    // 响应结果处理
    if (res.code !== 200) {
      // 错误弹窗提醒
      ElMessage.error(res.msg)
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err:' + error)
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default service