<template>
  <el-dialog  :visible.sync="diaSetShow" :class="['common-dia','set-device']" :close-on-click-modal="false" :show-close="false" :append-to-body="true" >
    <div slot="title" class="el-dialog__title">
      <span>{{title}}</span>
      <i class="el-dialog__close el-icon el-icon-close  de-close" @click="cancelCallBack"></i>
    </div>
    <el-form :model="form" ref="setting">
      <el-form-item prop="parentId" label="连接方式" :label-width="formWidth">
        <el-select v-model="form.connectionMode" >
          <el-option label="UDP客户端" value="udp"></el-option>
          <el-option label="串口" value="com"></el-option>
          <el-option label="TCP服务端" value="tcp"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="tcpPort" label="网管监听端口:" :label-width="formWidth">
        <el-input v-model="form.tcpPort" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="httpPort" label="HTTP端口:" :label-width="formWidth">
        <el-input v-model="form.httpPort" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="udpPort" label="网管绑定端口:" :label-width="formWidth">
        <el-input v-model="form.udpPort" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="comPath" label="COM口:" :label-width="formWidth">
        <el-input v-model="form.comPath" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="comBaudRate" label="波特率:" :label-width="formWidth">
        <el-select v-model="form.comBaudRate" >
          <el-option :label="rate" :value="rate" v-for="rate in baudRateArr" :key="rate"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="comDataBits" label="数据位:" :label-width="formWidth">
        <el-select v-model="form.comDataBits" >
          <el-option :label="bite" :value="bite" v-for="bite in dataBitsArr" :key="bite"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="comParity" label="寄偶校验:" :label-width="formWidth">
        <el-select v-model="form.comParity" >
          <el-option :label="par" :value="par" v-for="par in parityArr" :key="par"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="comStopBits" label="停止位:" :label-width="formWidth">
        <el-select v-model="form.comStopBits" >
          <el-option :label="pari" :value="pari" v-for="pari in stopBitArr" :key="pari"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :class="'btn-ok-'+canAdd" type="primary" :disabled="!canAdd" @click="addCallBack">确 定</el-button>
      <el-button @click="cancelCallBack">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Provide, Prop, Emit, Watch } from 'vue-property-decorator'
import { setApi, getSetApi } from '../SDK/infoManager'
import { isExsit, tipShow, tipWarn, backFunc } from '../common/js/util'
  @Component
export default class settingDia extends Vue {
    @Provide()
    title: string = '设置'
    canAdd: boolean = true
    formWidth: string = '120px'
    baudRateArr: Array<number> = [115200, 57600, 38400, 19200, 9600, 4800, 2400]
    dataBitsArr: Array<number> = [8, 7, 6, 5]
    parityArr: Array<string> = ['none', 'even', 'mark', 'odd', 'space']
    stopBitArr: Array<number> = [1, 2]
    form = {
      connectionMode: '',
      tcpPort: 0,
      udpPort: 0,
      httpPort: 0,
      comPath: '',
      comBaudRate: 0,
      comDataBits: 0,
      comParity: '',
      comStopBits: ''
    }

    // props
    @Prop({type: Boolean, default: true})
    diaSetShow: boolean

    // Emit
    @Emit()
    hideSetDialog () {
      let form: any = this.$refs['setting']
      form.resetFields()
    }
    // watch
    @Watch('diaSetShow')
    changeData (val) {
      if (val) {
        void this.getData()
      }
    }
    @Watch('form', {immediate: true, deep: true})
    changeForm (val) {
      this.canAdd = isExsit(val)
    }

    // method
    // 获取系统配置
    async getData (): Promise<void> {
      let { data, message, status } = await getSetApi()
      if (data) {
        backFunc(status, message, () => {
          this.form = data
        }, () => {
          tipWarn(message)
        })
      }
    }

    // 确定添加设备的回调函数
    async addCallBack (): Promise<void> {
      let { status, message } = await setApi(this.form)
      backFunc(status, message, () => {
        tipShow(message)
        this.hideSetDialog()
      }, () => {
        tipWarn(message)
      })
    }

    // 取消添加设备的回调函数
    cancelCallBack () {
      this.hideSetDialog()
    }
  }

</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
  .set-device
    >>> .el-dialog
      margin-top: rem(-295)!important
      .el-dialog__body
         padding-right: rem(35)
        .el-form-item__content
          .el-select
            width: 100%
      .el-dialog__footer
        padding-right: rem(35)
</style>
