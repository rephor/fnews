<template>
    <el-dialog  :visible.sync="diaShow" :class="['common-dia','add-device']" :close-on-click-modal="false" :show-close="false" :append-to-body="true">
      <div slot="title" class="el-dialog__title">
        <span>{{title}}</span>
        <i class="el-dialog__close el-icon el-icon-close de-close" @click="cancelCallBack"></i>
      </div>
      <el-form :model="form" ref="add">
        <el-form-item prop="id" label="设备ID:" :label-width="formWidth">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="设备名称:" :label-width="formWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="parentId" label="所属分类" :label-width="formWidth">
          <el-input v-if="!isRoot" v-model="form.parentId" autocomplete="off" :readonly="true"></el-input>
          <el-autocomplete v-else
            v-model="form.parentId"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            :hide-loading="true"
            :popper-append-to-body="false"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item prop="ip" label="设备IP:" :label-width="formWidth">
          <el-input v-model="form.ip" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="设备型号:" :label-width="formWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  :class="'btn-ok-'+isOk" type="primary" :disabled="!isOk" @click="addCallBack()">确 定</el-button>
        <el-button @click="cancelCallBack()">取 消</el-button>
      </div>
    </el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Provide, Prop, Emit, Watch } from 'vue-property-decorator'
import { modifyDevice } from '../SDK/infoManager'
import { isExsit, tipShow, tipWarn, backFunc } from '../common/js/util'

@Component
export default class addDeviceDia extends Vue {
  @Provide()
  props = {
    value: 'value',
    label: 'label'
  }
  title: string = '新增设备'
  isOk: boolean = false
  formWidth: string = '80px'
  form = {
    name: '',
    id: '',
    parentId: '',
    ip: '',
    type: ''
  }

  // props
   @Prop({type: Array})
   parentIdArr: any
   @Prop({type: Object})
   curData: any
   @Prop({type: Boolean, default: true})
   diaShow: boolean
   @Prop({type: Boolean, default: true})
   isRoot: boolean
   @Prop({type: Boolean, default: false})
   canEdit: boolean

  // Emit
  @Emit()
   hideDialog () {
     let form: any = this.$refs['add']
     form.resetFields()
   }

  // watch
  @Watch('diaShow')
  changeData (val) {
    if (!this.isRoot && val) {
      if (this.canEdit) {
        this.title = '编辑设备'
        let editData: any = JSON.parse(JSON.stringify(this.curData))
        this.form = {
          name: editData.name,
          id: editData.id,
          parentId: editData.parentId,
          ip: editData.ip,
          type: editData.type
        }
        this.isOk = true
      } else {
        this.form.parentId = this.curData.id
        this.isOk = false
      }
    } else {
      this.title = '新增设备'
      this.form = {
        name: '',
        id: '',
        parentId: '',
        ip: '',
        type: ''
      }
    }
  }

  @Watch('form', {immediate: true, deep: true})
  changeForm (val) {
    this.isOk = isExsit(val)
  }

  // method
  // 确定添加设备的回调函数
  async addCallBack (): Promise<void> {
    let addParam = {
      id: this.form.id.toString(),
      name: this.form.name,
      parentId: this.form.parentId,
      ip: this.form.ip,
      type: this.form.type,
      canEdit: this.canEdit,
      oldId: this.curData.id
    }

    let { status, message } = await modifyDevice(addParam)
    backFunc(status, message, () => {
      this.hideDialog()
      tipShow(message)
    }, () => {
      tipWarn(message)
    })
  }

  // 取消添加设备的回调函数
  cancelCallBack () {
    this.hideDialog()
  }

  // 查询父级id的下拉框
  querySearchAsync (qs, cb) {
    let restaurants = this.parentIdArr
    let results = qs ? restaurants.filter(this.createStateFilter(qs)) : restaurants
    cb(results)
  }

  // 执行数组.filter方法的事件
  createStateFilter (qs: string) {
    return (state) => {
      return (state.value.toLowerCase().indexOf(qs.toLowerCase()) > -1)
    }
  }

  handleSelect (item) {
    console.log(`选中的项为：${item}`)
  }
}

</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
  .add-device
    >>> .el-dialog
        margin-top: rem(-193)!important
        .el-dialog__body
          padding: rem(25) rem(25) rem(20) rem(20)
          .el-form-item
            margin-bottom: rem(15)
            &:last-child
              margin-bottom: 0
            .el-form-item__label , .el-form-item__content
              font-size: rem(13)
              line-height: rem(35)
              .el-input__inner
                height: rem(35)
                line-height: rem(35)
                border-color: $border-color
              .el-input__suffix .el-input__icon
                line-height: rem(35)
                color: $border-color
                i
                  color: $border-color
            .el-form-item__content
              .el-autocomplete
                width: 100%
                .el-scrollbar
                  border: rem(1) solid $border-color
                  box-sizing: border-box
                  border-radius: rem(2)
                  .el-autocomplete-suggestion
                    position: absolute!important
                    top: 0!important
                    left: 0!important
                    margin-top: rem(37)
                    .el-autocomplete-suggestion__wrap
                      padding: 0
                      ul
                        border-color: $border-color
                        li:hover
                          color: $white
                          background-color: $color
                  .popper__arrow
                    display: none
              input[readonly='readonly']
                background-color: $backColor
                cursor: inherit
</style>
