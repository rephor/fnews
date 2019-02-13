/**
 * Created by Administrator on 2019/1/14 0014.
 */
export interface TreeMock {
  id: string,
  label: string,
  cls: string,
  children?: TreeMock[]
}

export interface IdParam {
  id: string
}
