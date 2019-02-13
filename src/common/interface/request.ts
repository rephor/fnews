/**
 * Created by Administrator on 2019/1/14 0014.
 */
export interface IdParam {
  id: string
}

// 设置接口请求参数
export interface SettingInterParam {
  connectionMode: string,
  tcpPort: number,
  httpPort: number,
  udpPort: number,
  comPath: string,
  comBaudRate: number,
  comDataBits: number,
  comParity: string,
  comStopBits: string
}
export default {}
