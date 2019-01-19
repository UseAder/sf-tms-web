
/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import { Loading, Message , MessageBox} from 'element-ui'

// 超时时间
// axios 配置
axios.defaults.baseURL = '/api'
axios.defaults.timeout = 5000

/**
 * http请求拦截器
 */ 
//var loadinginstace
axios.interceptors.request.use(
  config => {
    // element ui Loading方法
    //loadinginstace = Loading.service({ fullscreen: true })
    config.headers= {
      'X-Requested-With': 'XMLHttpRequest',
      'sf-app-token': sessionStorage.getItem('token'),
      'sf-request-source':'web'
    }
    return config
  }, 
  error => {
    // loadinginstace.close()
    Message.error({showClose: true, message: '请求发送错误'})
    return Promise.reject(error)
  }
)
/**
 * http响应拦截器
 */
axios.interceptors.response.use(
  res => {
    // loadinginstace.close()// 响应成功关闭loading
    return res
  }, 
  error => {
    return Promise.resolve(error.response)
  }
)

/**
 * 检测HTTP响应状态
 * @param {} response 
 */
function checkStatus(response) {
  if(response) {
    if (response.status === 200 || response.status === 304) {
        return response
    }
    //返回业务数据结构，以便统一处理
    return {
      data: {
          code: 'S_STATUS_ERROR',
          message: response.status+'错误',
          data: response.status,
      }
    }
  } else {
     //返回业务数据结构，以便统一处理
    return {
      data: {
          code: 'S_LINK_ERROR',
          message: '服务器连接错误',
          data: '',
      }
    }
  }
}

/**
 * 检测HTTP返回的业务数据状态码
 * @param {*} res 
 */
function checkCode(res) {

  let code = res.data.code
  if (code !== '200') {
    if (code === 'NO_LOGIN') {
      // sessionStorage.clear();
      
      MessageBox.confirm('长时间未操作，请重新登录！', '提示', {
        type: 'warning',
        showCancelButton:false,
        closeOnClickModal:false,
        showClose:false,
        center:true
      }).then(() => {
        router.push({
          path:"/login",
          querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
        })
      })
    } else {
      Message.error({showClose: true, message: res.data.message})
    }
  }

  return res.data
}

export default {
  post(url, data) {
      return axios({
          method: 'post',
          url,
          // data: qs.stringify(data),
          data: data,
          timeout: 30000,
          // headers: {
          //     'X-Requested-With': 'XMLHttpRequest',
          //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          // }
      }).then(checkStatus).then(checkCode)
  },
  post(url, data, headers) {
    return axios({
        method: 'post',
        url,
        // data: qs.stringify(data),
        data: data,
        timeout: 30000,
        headers: headers
    }).then(checkStatus).then(checkCode)
},
  get(url, params) {
      return axios({
          method: 'get',
          url,
          params,
          timeout: 30000,
          // headers: {
          //     'X-Requested-With': 'XMLHttpRequest'
          // }
      }).then(checkStatus).then(checkCode)
  }
}