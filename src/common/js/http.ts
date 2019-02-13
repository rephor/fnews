/**
 * Created by Administrator on 2018/12/26 0026.
 */
import axios from 'axios'

const config = require('@/config.json')
const BASE_URL = config.service_base_path
const DEFAULT_TIME_OUT = config.timeOut

// axios 配置
axios.defaults.timeout = DEFAULT_TIME_OUT
axios.defaults.baseURL = BASE_URL
axios.defaults.withCredentials = true
axios.defaults.headers.common = {
  'Accept': 'application/json',
  'Authorization': 'Bearer',
  'Cache-Control': 'no-cache',
  'X-Requested-With': 'XMLHttpRequest'
}
axios.defaults.headers.post['Content-Type'] = 'application/json'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 404:
         // let errMsg: string = error.response.statusText ? error.response.statusText : '接口不存在'
         // tipError(errMsg)
          break
      }
      return Promise.reject(error.response)
    }
  })

export const apiGet = async (url: string, params = {}) => {
  try {
    let dataGet: any = await axios.get(url, params)
    return dataGet
  } catch (e) {
    return {
      errCode: e.status,
      errMsg: e.statusText
    }
  }

}

export const apiPost = async (url: string, aParams, bParams = {}) => {
  try {
    let dataPost: any = await axios.post(url, aParams, bParams)
    return dataPost
  } catch (e) {
    return {
      errCode: e.status,
      errMsg: e.statusText
    }
  }
}

export const apiDel = async (url: string, params = {}) => {
  try {
    let dataDel: any = await axios.delete(url, params)
    return dataDel
  } catch (e) {
    return {
      errCode: e.status,
      errMsg: e.statusText
    }
  }
}

export const apiPut = async (url: string, params?: Object) => {
  try {
    let dataPut: any = await axios.put(url, params)
    return dataPut
  } catch (e) {
    return {
      errCode: e.status,
      errMsg: e.statusText
    }
  }
}

export default axios
