/**
 * Created by Administrator on 2018/12/24 0024.
 */
import { Message, Loading } from 'element-ui'

export const getCookie = (name: string) => {
  let sessionId = ''
  let arrStr: any = document.cookie.split('; ')
  for (let i = 0; i < arrStr.length; i++) {
    let temp = arrStr[i].split('=')
    if (temp[0] === name) {
      sessionId = temp[1]
    }
  }
  return sessionId
}

export const delCookie = (name: string) => {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cVal = this.getCookie(name)
  if (cVal != null) {
    document.cookie = name + '=' + cVal + ';expires=-1'
  }
}

// num转换成十六进制
export const numToHex = (num: number) => {
  let numStr: string = num.toString(16)
  let zero: string = '0000'
  let tmp: number = 4 - numStr.length
  return '0x' + zero.substr(0,tmp) + numStr
}

// 十六进制转num
export const hexToNum = (str: string) => {
  return parseInt(str, 16)
}

// 查看一个对象里的值是否存在，不包含0
export const isExsit = (val = {}) => {
  for (let i in val) {
    if (!val[i]) {
      return false
    }
  }
  return true
}

// 公共的提示处理
export const tipCommon = (msg: string, type: string, time?: number) => {
  let msgObj: any = { message: msg , type: type }
  if (time || time === 0) {
    msgObj.duration = time
  }
  Message(msgObj)
}

// 成功提示
export const tipShow = (msg: string, time?: number) => {
  tipCommon(msg, 'success', time)
}

// 告警提示
export const tipWarn = (msg: string, time?: number) => {
  tipCommon(msg, 'warning', time)
}

// 错误提示
export const tipError = (msg: string, time?: number) => {
  tipCommon(msg, 'error', time)
}

// 统一处理接口返回
export const backFunc = (status: number, message: string, scuessFunc, failFunc, catchFunc?: Function) => {
  if (status) {
    failFunc && failFunc(message)
  } else {
    if (status === 0) {
      scuessFunc && scuessFunc()
    } else {
      catchFunc && catchFunc()
    }
  }
}

// 部分接口加上loading
export const addLoadingFunc = (obj = {}) => {
  return Loading.service({})
}
