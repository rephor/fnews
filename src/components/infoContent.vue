<template>
  <div class="info-content" v-loading="isLoading" v-cloak>
    <el-table :class="['ele-table',{'ele-commad':!commandFlag}]"   :row-class-name="SelectFunc" ref="table" :data="curTableData" tooltip-effect="dark"  border height="calc(100% - 40px)"   @selection-change="handleSelectionChange" @row-click="clickRow" >
      <el-table-column type="selection" width="34" align="center" sortable></el-table-column>
      <el-table-column label="监控数据标识" align="center" v-if="commandFlag">
        <template slot-scope="scope">
          {{ scope.row.command | filterHex }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="参数名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="localValue" label="本地值" align="center" v-if="curTabNum != 1">
        <template slot-scope="scope">
          <div v-if="scope.row.type != 'bit'">
            <input type="text" :readonly="scope.row.isReadOnly" autocomplete="on" class="local_name"  @oninput="inputFunc(scope.row, $event, true)" @keyup="focusFunc(scope.row, $event, true)"  ng-model="scope.row.localValue" :value="scope.row.localValue">
            <span :class="['ele-done',{'sure':scope.row.isSure}]">
            <i class="el-icon-edit" @click="inputFunc(scope.row,$event)"></i>
            <i class="el-icon-check" @click="setReady(scope.row,$event)"></i>
          </span>
          </div>
          <div v-else>
            <el-select v-model="scope.row.localValue" :value="scope.row.localValue | filterVal" placeholder="请选择" popper-class="local-select" @click.native="localBitFunc(scope.row)" @change="changeSelect(scope.row)" >
              <el-option label="禁止" value="0"></el-option>
              <el-option label="允许" value="1"></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="远程值" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.type === 'bit'">
            {{scope.row.value | filterVal}}
          </div>
          <div v-else>
            {{scope.row.value}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="info-bottom" v-if="!isSecond">
      <ul class="info-left">
        <li v-for="aLeft in btnObj.left" :key="aLeft.name" @click="bottomFunc(aLeft.func)">
          <i :class="['ico', aLeft.cls]"></i><span>{{aLeft.name}}</span>
        </li>
      </ul>
      <ul class="info-right">
        <li v-for="aright in btnObj.right" :key="aright.name" :class="aright.cls === 'setting'?aright.cls:''" @click="bottomFunc(aright.func)">
          <i :class="['ico', aright.cls]" v-if="!(aright.cls === 'setting')"></i><span>{{aright.name}}</span>
        </li>
      </ul>
    </div>
    <setting-dia :diaSetShow="diaSetShow" @hide-set-dialog="diaSetShow=false"></setting-dia>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Provide, Watch, Prop } from 'vue-property-decorator'
// import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import Bus from '../common/js/eventBus'
import SettingDia from '../components/settingDia.vue'
import { tipWarn, backFunc, numToHex, addLoadingFunc } from '../common/js/util'
import * as infoModel from '../SDK/infoManager'
  @Component({
    components: {
      SettingDia
    },
    directives: {
      focus: {
        update: (el, val) => {
          if (val.value) {
            el.focus()
          }
        }
      }
    },
    filters: {
      filterVal: (val) => {
        let localVal: string = ''
        switch (val) {
          case '1':
            localVal = '允许'
            break
          default:
            localVal = '禁止'
            break
        }
        return localVal
      },
      filterHex: (val) => {
        return numToHex(val)
      }
    }
  })
export default class infoContent extends Vue {
    // data
    @Provide()
    isLoading: boolean = true
    diaSetShow: boolean = false
    isSecond: boolean = false // 是否树的二级
    commandFlag: boolean = false // 监控的数据标识开关状态
    curLeftId: string = ''
    btnObj = {
      left: [
        {
          name: '实时查询',
          cls: 'ico-real-search',
          func: 'realSearchFunc'
        },
        {
          name: '实时设置',
          cls: 'ico-real-set',
          func: 'realSetFunc'
        }
      ],
      right: [
        {
          name: '读取设备id',
          cls: 'ico-device-id',
          func: 'readIdFunc'
        }, {
          name: '读取参量',
          cls: 'ico-get-param',
          func: 'readParamFunc'
        }, {
          name: '读取调试参量',
          cls: 'ico-debug-data',
          func: 'readDebugFunc'
        }, {
          name: '设置',
          cls: 'setting',
          func: 'setting'
        }
      ]
    }
    allData: Array<any> = []
    curTableData: Array<any> = []
    curTabNum: number = 1
    multipleSelection: Array<any> = []

    // props
    @Prop({type: Object})
    curTab: any

    // watch
    @Watch('curTab')
    onChangeTab (newVal:any) {
      this.curTableData = this.allData[newVal.index]
      this.curTabNum = newVal.index
      this.initData()
    }

    // 生命周期
    mounted () {
      this.$nextTick(() => {
        let self = this
        Bus.$on('tree-selected', (data) => {
          self.isSecond = /.*[\u4e00-\u9fa5]+.*$/.test(data[0])
          self.curLeftId = data[0]
          void self.getFullFlag()
        })
      })
      // 左侧树没有数据的时候,右侧页面取消掉loading
      Bus.$on('left-no-content', () => {
        this.isLoading = false
      })
    }

    // methods
    handleSelectionChange (val) {
      this.multipleSelection = val
    }

    clickRow (row) { // row, e, column
      let curRow: any = this.$refs.table
      curRow.toggleRowSelection(row)
    }
    SelectFunc () { // row
    }

    // 获取全局的开关
    async getFullFlag (): Promise<void> {
      let { data, status, message } = await infoModel.getSwitchFlag()
      backFunc(status, message, () => {
        if (data) {
          this.commandFlag = true
        } else {
          this.commandFlag = false
        }
        void this.getList()
      }, () => {
        this.commandFlag = false
        tipWarn(message)
      })
    }

    localBitFunc (row) {
      let curRow: any = this.$refs.table
      curRow.clearSelection()
      curRow.toggleRowSelection(row)
      // curRow.setCurrentRow(row)
    }

    focusFunc (row, e, isInput = false) {
      if (isInput && !row.isSure) { // 只读的input不执行
        return
      }
      // 实时更新数据到data上
      if (e.target.value !== undefined) {
        row.localValue = e.target.value
      }
    }

    inputFunc (row, e, isInput = false) {
      if (isInput && !row.isSure) { // 只读的input不执行
        return
      }
      this.initData()

      // 实时更新数据到data上
      if (e.target.value !== undefined) {
        row.localValue = e.target.value
      }
      row.isSure = true
      row.isReadOnly = false
      row.autofocus = true
      let curRow: any = this.$refs.table
      curRow.clearSelection()
      curRow.setCurrentRow(row)
      if (e.target.nodeName === 'I') {
        e.target.parentNode.parentNode.firstChild.focus()
      }
    }

    // 设置本地值
    async setLocalFunc (row, val?: string): Promise<void> {
      let localParam = {
        key: row.command,
        id: this.curLeftId,
        localValue: (val || row.localValue)
      }
      row.isSure = false
      row.isReadOnly = true
      let { status, message } = await infoModel.setLocalParam(localParam)
      backFunc(status, message, () => {
        // row.isSure = false
        // row.isReadOnly = true
        // this.refresh()
      }, () => {
        tipWarn(message)
        this.refresh()
      })
    }

    // 本地值为Bit的下拉框
    changeSelect (row) {
      void this.setLocalFunc(row)
    }

    // 设置本地值
    setReady (row, e) {
      void this.setLocalFunc(row, e.target.value)
    }

    async getList (): Promise<void> {
      let param = {
        id: this.curLeftId
      }
      let { data, status, message } = await infoModel.getRightList(param)
      this.isLoading = false
      if (data) {
        backFunc(status, message, () => {
          this.allData = data
          this.curTableData = data[this.curTab.index]
          this.curTabNum = this.curTab.index
          this.initData()
        }, () => {
          tipWarn(message)
        })
      }
    }

    // 实时查询
    async realSearchFunc (): Promise<void> {
      let loadingServeice: any = addLoadingFunc()
      let keyArr: Array<any> = this.getSelectValue()
      let sParam = {
        key: keyArr,
        id: this.curLeftId
      }
      let { status, message } = await infoModel.realSearch(sParam)
      backFunc(status, message, () => {
        loadingServeice.close()
        this.refresh()
      }, () => {
        loadingServeice.close()
        void this.$confirm(message, '提示', {
          distinguishCancelAndClose: true,
          showCancelButton: false,
          confirmButtonText: '知道了',
          cancelButtonText: '取消'
        })
      }, () => {
        loadingServeice.close()
      })
    }

    // 实时设置
    async realSetFunc (): Promise<void> {
      let loadingServeice: any = addLoadingFunc()
      let setArr: Array<any> = this.getSelectValue()
      let sParam = {
        key: setArr,
        id: this.curLeftId
      }
      let { status, message } = await infoModel.realSet(sParam)
      backFunc(status, message, () => {
        loadingServeice.close()
        this.refresh()
      }, () => {
        loadingServeice.close()
        void this.$confirm(message, '提示', {
          distinguishCancelAndClose: true,
          showCancelButton: false,
          confirmButtonText: '知道了',
          cancelButtonText: '取消'
        })
      }, () => {
        loadingServeice.close()
      })
    }

    // 读取设备id
    async readIdFunc (): Promise<void> {
      let loadingServeice: any = addLoadingFunc()
      let aParam = {
        id: this.curLeftId
      }
      let {status, message, data} = await infoModel.readDeviceId(aParam)
      backFunc(status, message, () => {
        loadingServeice.close()
        Bus.$emit('refreshLeft', data)
      }, () => {
        loadingServeice.close()
        tipWarn(message)
      }, () => {
        loadingServeice.close()
      })
    }

    // 读取参量
    async readParamFunc (): Promise<void> {
      let loadingServeice: any = addLoadingFunc()
      let rParam = {
        id: this.curLeftId
      }
      let {status, message} = await infoModel.readParam(rParam)
      backFunc(status, message, () => {
        loadingServeice.close()
        this.refresh()
      }, () => {
        loadingServeice.close()
        tipWarn(message)
      }, () => {
        loadingServeice.close()
      })
    }

    // 读取调试参量
    async readDebugFunc (): Promise<void> {
      let loadingServeice: any = addLoadingFunc()
      let mParam = {
        id: this.curLeftId
      }
      let {status, message} = await infoModel.readDebug(mParam)
      backFunc(status, message, () => {
        loadingServeice.close()
        this.refresh()
      }, () => {
        loadingServeice.close()
        tipWarn(message)
      }, () => {
        loadingServeice.close()
      })
    }

    // 全局设置
    setting () {
      this.diaSetShow = true
    }

    // 初始化编辑按钮
    initData (obj = {}) {
      obj = this.curTableData
      for (let key in obj) {
        obj[key].isSure = false
        obj[key].isReadOnly = true
        obj[key].autofocus = false
      }
    }

    // 获取选中项的值
    getSelectValue () {
      let refTable: any = this.$refs['table']
      let selectArr: any = refTable.store.states.selection
      let keyArr: Array<any> = []
      for (let akey in selectArr) {
        if (selectArr.hasOwnProperty(akey)) {
          keyArr.push(selectArr[akey].command)
        }
      }
      return keyArr
    }

    // 右侧底部事件
    bottomFunc (name: string) {
      this[name]()
    }

    // 刷新事件
    refresh () {
      this.diaSetShow = false
      void this.getList()
    }
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .info-content
    width: 100%
    hCalMin(8)
    border: 1px solid #dcdfe6
    margin: rem(4) 0
    .info-bottom
      width: 100%
      height: rem(40)
      background-color: #f7f7f7
      border-top: 1px solid #dcdfe6
      border-bottom: 1px solid #dcdfe6
      box-sizing: border-box
      ul > li
        float: left
        margin: rem(6) 0 0 rem(6)
        border: 1px solid $border-color
        /*color: #2c3e50*/
        box-sizing: border-box
        padding: 0 rem(4)
        height: rem(27)
        line-height: rem(27)
        border-radius: rem(3)
        span
          margin-left: rem(4)
      .info-left
        float: left
      .info-right
        float: right
        li.setting
          background-color: $color
          margin-right: rem(8)
          width: rem(50)
          span
            display: inline-block
            width: 100%
            text-align: center
            color: $white
            margin: 0
    >>> .el-loading-mask
      background-color: $white
    >>> .ele-table
      width: 100%
      hCalMin(40)
      text-align: center
      color: $font-color
      font-size: rem(13)
      /*overflow: auto*/
      /*&:nth-child(even)*/
        /*background-color: #dcdfe6*/
      .el-table__header-wrapper
        .has-gutter .gutter
          width: rem(8)
      &:hover
        cursor: pointer
      >>> .el-table__body , &.ele-commad >>> .el-table__body
        width: 100%!important
        .el-table__row
          td
            position: relative
            &:nth-child(4), &:nth-child(3)
              padding-right: 0
              padding-left: rem(5)
              &:hover
                .ele-done
                  display: inline-block
              .cell
                padding: 0
                .el-select
                  // padding-right: rem(5)
                  .el-input__inner
                    height: rem(26)
                    line-height: rem(26)
                    font-size: rem(12)
                    text-align: center
                  .el-input__suffix-inner i
                    line-height: rem(26)
        td,th,thead
         padding: rem(5) 0
         color: $font-color
         .ele-done
            position: absolute
            right: 0
            top: 0
            z-index: 99
            height: rem(36);
            line-height: rem(34)
            padding-right: rem(4)
            display: none
            i
              display: inline-block
              width: rem(16)
              height: rem(16)
              border-radius: rem(2)
              &:hover
                color: $color
            .el-icon-check
              display: none
          .sure
            display: inline-block
            i
              display: none
            .el-icon-check
              display: inline-block
        .local_name
          wCalMin(26)
          float: left
          border: none
          padding: 0 rem(2)
          text-align: center
          height: rem(26)
          line-height: rem(26)
          border-radius: rem(2)
          &[readonly='readonly']
            background-color: inherit
            color: $font-color
            border-color: transparent
            cursor: pointer
      >>> .el-table__header
        td,th,thead
          padding: rem(6) 0
          color: $font-color
          background-color: $backColor
      >>> .el-table__body
        tr:nth-child(even)
          background-color: $backColor
          td
            background-color: $backColor
  .local-select
    padding-right: rem(2)
    li
      height: rem(26)
      line-height: rem(26)
      font-size: rem(12)!important
      text-align: center
      padding-right: rem(31)

</style>
