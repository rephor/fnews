<template>
  <el-dialog  :visible.sync="diaConfirmShow" :class="['common-dia','del-device']" :close-on-click-modal="false" :show-close="false" :append-to-body="true">
    <div slot="title" class="el-dialog__title">
      <span>{{title}}</span>
      <i class="el-dialog__close el-icon el-icon-close de-close" @click="cancelFunc"></i>
    </div>
    <span>{{content}}</span>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="okFunc">{{okTxt}}</el-button>
      <el-button @click="cancelFunc">{{cancelTxt}}</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Provide, Prop, Emit, Watch } from 'vue-property-decorator'
  @Component
export default class confirmDia extends Vue {
    @Provide()
    props = {
      value: 'value',
      label: 'label'
    }

    // props
    @Prop({type: String, default: '提示'})
    title: string
    @Prop({type: String, default: '提示内容'})
    content: string
    @Prop({type: String, default: '确 定'})
    okTxt: string
    @Prop({type: String, default: '取 消'})
    cancelTxt: string
    @Prop({type: Boolean, default: true})
    diaConfirmShow: boolean

    @Emit()
    okFunc () {}
    @Emit()
    cancelFunc () {}

    // watch
    @Watch('diaConfirmShow')
    changeData () {}
  }

</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
  .del-device
    >>> .el-dialog
        margin-top: rem(-85)!important
</style>
