/**
 * Created by Administrator on 2018/12/26 0026.
 */
import * as $http from '../common/js/http'
import { IdParam, SettingInterParam } from '../common/interface/request'

/****
 * 获取右侧列表接口  /parameter/{id}
 * type: GET
 * *****/
export const getRightList = (param: IdParam) => {
  let url = `parameter/${param.id}`
  // let url = `parameter`
  return $http.apiGet(url)
}

/****
 * 获取左侧树 /device
 * type: GET
 * *****/
export const getTree = () => {
  let url: string = 'device'
  return $http.apiGet(url)
}

/*
**新增/修改设备信息 /device/
* type: POST/Put
**/
export const modifyDevice = (param) => {
  let url: string = 'device'
  let postData = {
    id: param.id,
    ip: param.ip,
    name: param.name,
    parentId: param.parentId,
    type: param.type
  }
  if (param.canEdit) {
    let url: string = `device/${param.oldId}`
    return $http.apiPut(url,postData)
  } else {
    return $http.apiPost(url,postData)
  }
}

/*
 **删除设备信息 /device/{id}
 * type: delete
 **/
export const delDevice = (param) => {
  let url = `device/${param.id}`
  return $http.apiDel(url)
}

/*
 **升级设备配置 /device/version/{id}
 * type: POST
 **/
export const updateDevice = (param, id?: string, bParam = {}) => {
  let url: string = `/device/version/${id}`
  return $http.apiPost(url,param, bParam)
}

/*
 **设备回退 /device/version/{id}
 * type: delete
 **/
export const backDevice = (param) => {
  let url: string = `/device/version/${param.id}`
  return $http.apiDel(url,param)
}

/*
 **实时查询 parameter/{id}/remote
 * type: PUT
 **/
export const realSearch = (param) => {
  let url: string = `parameter/${param.id}/remote`
  let putData = {
    key: param.key
  }
  return $http.apiPut(url,putData)
}

/*
 **实时设置 /remote/{id}
 * param: key
 * type: PUT
 **/
export const realSet = (param) => {
  let url: string = `remote/${param.id}`
  let putData = {
    key: param.key
  }
  return $http.apiPut(url,putData)
}

/**
 *
 */
export const getSwitchFlag = () => {
  let url: string = '/setting/switch'
  return $http.apiGet(url)
}

/*
 **本地参数配置 /parameter/{id}/local
 * param: key
 * type: PUT
 **/
export const setLocalParam = (param) => {
  let url: string = `/parameter/${param.id}/local`
  let putData = {}
  putData[param.key] = param.localValue
  return $http.apiPut(url,putData)
}

/*
 **读取设备id /device/{id}/id
 * type: PUT
 **/
export const readDeviceId = (param: IdParam) => {
  let url: string = `device/${param.id}/id`
  return $http.apiPut(url)
}

/*
 **读取参量 /parameter/{id}/ordinary
 * type: PUT
 **/
export const readParam = (param: IdParam) => {
  let url: string = `parameter/${param.id}/ordinary`
  return $http.apiPut(url)
}

/*
 **读取调试参量 /parameter/{id}/debug
 * type: PUT
 **/
export const readDebug = (param: IdParam) => {
  let url: string = `parameter/${param.id}/debug`
  return $http.apiPut(url)
}

/*
 **全局设置 /setting
 * type: PUT
 **/
export const setApi = (param: SettingInterParam) => {
  let url: string = `/setting`
  let putParam: SettingInterParam = {
    connectionMode: param.connectionMode,
    tcpPort: param.tcpPort,
    udpPort: param.udpPort,
    httpPort: param.httpPort,
    comPath: param.comPath,
    comBaudRate: param.comBaudRate,
    comDataBits: param.comDataBits,
    comParity: param.comParity,
    comStopBits: param.comStopBits
  }
  return $http.apiPut(url,putParam)
}
/*
 **全局设置获取 /setting
 * type: PUT
 **/
export const getSetApi = () => {
  let url: string = `/setting`
  return $http.apiGet(url)
}
