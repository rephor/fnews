/**
 * Created by Administrator on 2018/12/23 0023.
 */
// src/vue-shims.d.ts

declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}
declare module "*.json" {
  const value: any
  export default value
}
