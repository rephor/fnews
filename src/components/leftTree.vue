<template>
  <div class="left-tree">
    <span class="sub-menu">
      <i :class="['ico','ico-tree-one']"></i>
      <span>{{subMenuObj.name}}</span>
      <span class="ico ico-add sub-menu-add" @click="addDevice()"></span>
    </span>
    <span class="ele-tree-content">
       <span class="el-tree-span">
           <el-tree
             :data="data"
             ref="tree"
             node-key="id"
             default-expand-all
             :highlight-current="true"
             @node-click="handleNodeClick"
             :default-checked-keys="curCheckedArr"
             :check-strictly="true"
             :props="defaultProps"
             :expand-on-click-node="false">
      <span :class="['custom-tree-node',{active : node.data.isActive}]" :level="'s'+ (node.level+1)" slot-scope="{ node, data }">
        <span>
          <i  :class="['ico',node.data.cls]"></i>
          <span class="cur-node">{{node | curCls}}</span>
          <span class="node-name"  :title="node.data.name">{{ node.data.name }}</span>
        </span>
         <ul>
            <li class="ico ico-edit" @click="editDevice(data)"></li>
            <li class="ico ico-add" @click="addDevice(data)"></li>
            <li class="ico ico-del" @click="removeFunc(data)"></li>
            <li class="ico ico-update" @click="uploadClickFunc($event)">
              <input type="file" id="uploadIpt" @change="uploadFunc" style="display:none;">
            </li>
            <li class="ico ico-back" @click="backClickFunc(node.data)"></li>
          </ul>
      </span>
    </el-tree>
       </span>
    </span>
    <set-device :parent-id-arr="parentIdArr" :dia-show="diaShow" :canEdit="canEdit" :isRoot="isRoot" :curData="curCheckedData" v-on:hide-dialog="hideDia"></set-device>
    <confirm-dia  :content="confirmContent" :dia-confirm-show="diaConfirmShow"  v-on:cancel-func="confirmCancelFunc" v-on:ok-func="confirmOkFunc"></confirm-dia>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Watch } from 'vue-property-decorator'
import { getTree, backDevice, updateDevice, delDevice } from '../SDK/infoManager'
import Bus from '../common/js/eventBus'
import setDevice from '../components/addDeviceDia.vue'
import confirmDia from '../components/confirmDia.vue'
import { tipShow, tipWarn, backFunc } from '../common/js/util'
  @Component({
    components: {
      setDevice,
      confirmDia
    },
    filters: {
      'curCls': (node) => {
        let curCss = ''
        switch (node.level) {
          // case 1:
          //   curCss = 'ico-tree-one'
          //   break
          case 1:
            curCss = 'ico-tree-two'
            break
          case 2:
            curCss = 'ico-tree-three'
            break
          case 3:
            curCss = 'ico-tree-four'
        }
        node.data.cls = curCss
      }
    }
  })
export default class leftTree extends Vue {
    @Provide()
    subMenuObj = {
      name: '北京市',
      id: '',
      parentId: '',
      ip: ''
    }
    type: string = '' // 执行操作的类型，如：删除/del, 回退/cback
    confirmContent: string = '' // confirm弹框的title
    diaShow: boolean = false // 显示新建、编辑弹框的开关
    diaConfirmShow: boolean = false // 显示删除弹框的开关
    canEdit: boolean = false // 是否是编辑
    defaultProps = {
      children: 'children',
      label: 'label'
    }
    data: Array<any> = [] //
    curCheckedArr: Array<any> = [] // 选中节点数的id的数组,配合default-checked-keys来使用，必须为数组
    curCheckedData = {} // 选中节点树的数据
    parentIdArr: Array<any> = [] // 存储一级节点的值，便于新建、编辑中，parentId下拉框可选
    isRoot: boolean = false // 是否是根目录

    @Watch('curCheckedArr')
    selectOneTree (val) {
      Bus.$emit('tree-selected', val)
    }
    @Watch('diaShow')
    addFunc (val: boolean) {
      if (val) {
        this.diaConfirmShow = false
      }
    }

    // 生命周期
    mounted () {
      this.$nextTick(() => {
        void this.getTreeData()
        Bus.$on('refreshLeft', (data) => {
          this.curCheckedArr[0] = data
          this.refresh()
        })
      })
    }

    /**
     *********************** method start
     */
    // 获取左侧树
    async getTreeData (): Promise<void> {
      let { data, status, message } = await getTree()
      if (data && Object.keys(data).length) {
        backFunc(status, message, () => {
          let dataArr: Array<any> = []
          this.parentIdArr = []
          let num: number = 0
          for (let [key, value] of Object.entries(data)) {
            num++
            let keyObj = {
              value: key,
              label: key
            }
            this.parentIdArr.push(keyObj) // 把最上次的parentId存起来
            this.addCls(data[key])
            let oneObj = {
              id: value[0].parentId,
              name: key,
              parentId: value,
              ip: '',
              cls: '',
              isActive: false,
              children: data[key]
            }
            if (num === 1) {
              let defaultId: string = data[key][0].id
              if (!this.curCheckedArr.length) {
                oneObj.children[0].isActive = true
                this.curCheckedArr = []
                this.curCheckedData = data[key][0]
                this.curCheckedArr.push(defaultId)
              }
            } else { // 刷新页面后，记住之前选中的节点
              if (this.curCheckedArr.length) {
                if (this.curCheckedArr[0] === oneObj.id) {
                  oneObj.isActive = true
                }
              }
            }
            dataArr.push(oneObj)
          }
          this.data = dataArr
        }, () => {
          tipWarn(message)
        })
      } else {
        Bus.$emit('left-no-content', true) // 左侧树没有数据的时候,右侧页面取消掉loading
      }
    }

    // 手动添加默认cls值
    addCls (obj) {
      for (let [key1] of Object.entries(obj)) {
        let ckeyObj = obj[key1]
        ckeyObj.cls = ''
        ckeyObj.isActive = false
        if (this.curCheckedArr.length) {
          if (this.curCheckedArr[0] === ckeyObj.id) {
            ckeyObj.isActive = true
          }
        }
        if (ckeyObj.children) {
          this.addCls(ckeyObj.children)
        }
      }
    }

    /** *****上传事件 start*******/

    uploadClickFunc () {
      document.getElementById('uploadIpt').click()
    }
    // 上传执行事件
    async uploadFunc (e): Promise<void> {
      let formData = new FormData()
      formData.append('file', e.target.files[0])
      let { status, message } = await updateDevice(formData, this.curCheckedArr[0], { headers: { 'content-type': 'multipart/form-data' } })
      backFunc(status, message, () => {
        tipShow(message)
      }, () => {
        tipWarn(message)
      })
    }
    /** *****上传事件 end*******/

    // 新建设备
    addDevice (data) {
      this.isRoot = !data
      this.canEdit = false
      this.diaShow = true
    }

    // 编辑设备
    editDevice (data) {
      this.isRoot = !data
      this.canEdit = true
      this.diaShow = true
    }

    // confirm 弹框事件
    confirmOkFunc () {
      switch (this.type) {
        case 'del':
          void this.delConfirmFunc(this.curCheckedData)
          break
        case 'cback':
          void this.backConfirmFunc(this.curCheckedData)
          break
      }
    }
    // 确认弹框的取消事件
    confirmCancelFunc () {
      this.diaConfirmShow = false
    }

    // 删除事件
    removeFunc (data) {
      this.type = 'del'
      if (data.children.length) {
        this.confirmContent = '此设备下含有子设备，确认删除？'
      } else {
        this.confirmContent = '确认删除此设备？'
      }
      this.diaConfirmShow = true
    }

    // 删除确认事件
    async delConfirmFunc (obj): Promise<void> {
      let delParam = {
        id: obj.id.toString(),
        name: obj.name,
        parentId: obj.parentId,
        ip: obj.ip
      }
      let { status, message } = await delDevice(delParam)
      backFunc(status, message, () => {
        tipShow(message)
        this.refresh()
      }, () => {
        tipWarn(message)
      })
    }

    // 回退事件
    backClickFunc () {
      this.type = 'cback'
      this.confirmContent = '确认回退？'
      this.diaConfirmShow = true
    }

    // 回退的确认函数
    async backConfirmFunc (obj): Promise<void> {
      let backParam = {
        id: obj.id
      }
      this.diaConfirmShow = false
      let { status, message } = await backDevice(backParam)
      backFunc(status, message, () => {
        this.refresh()
      }, () => {
        tipWarn(message)
      })
    }

    // 左侧节点点击事件
    handleNodeClick (data, node) {
      this.initActive()
      this.curCheckedArr = []
      this.curCheckedData = data
      node.data.isActive = true
      this.curCheckedArr.push(data.id)
    }

    // 初始化 isActive为false
    initActive () {
      let mapFunc = (val) => {
        if (val.children && val.children.length) {
          let childVal = val.children
          for (let child of childVal) {
            child.isActive = false
            mapFunc(child)
          }
        }
      }
      for (let value of this.data) {
        value.isActive = false
        mapFunc(value)
      }
    }

    // 关闭添加和编辑弹框,并重新渲染左侧树
    hideDia () {
      this.refresh()
    }

    // 刷新目录
    refresh () {
      this.diaConfirmShow = false
      this.diaShow = false
      void this.getTreeData()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .left-tree
    width: rem(300)
    height: 100%
    float:left
    // overflow: auto
    border:1px solid $color
    box-sizing:border-box
    &::-webkit-scrollbar
      width: rem(8)
      height: rem(8)
      position: absolute
      right: 0
    &::-webkit-scrollbar-thumb
      -webkit-border-radius: rem(8)
      background-color: rgb(211, 211, 211)
    &::-webkit-scrollbar-track-piece
      background-color: $white
    .sub-menu
      display: inline-block
      width: 100%
      height: rem(36)
      line-height: rem(36)
      box-sizing: border-box
      text-align: left
      padding-left: rem(10)
      padding-right: rem(10)
      background-color: $backColor
      .sub-menu-add
        float: right
        margin-top: rem(10)
        &:hover
          cursor: pointer
    .ele-tree-content
      display: inline-block
      width: 100%
      hCalMin(36)
      overflow-y: auto
      box-sizing: border-box
      position: relative
      .el-tree-span
        // min-width: 100%
        width: 100%
        display: inline-block
        .el-tree
          padding-left: rem(4)
          .custom-tree-node
            flex: 1
            display: flex
            align-items: center
            justify-content: space-between
            font-size: rem(12)
            wCalMin(22)
            // padding-right: rem(8)
            &[level=s3]
              & > span
                wCalMin(102)
                // padding-right: rem(8)
                .node-name
                  max-width: calMin(20)
            &[level=s1]
              & > span
                // padding-right: rem(2)
              ul .ico-edit,.ico-del,.ico-update,.ico-back
                display: none
            &[level=s2]
              wCalMin(24)
              & > span
                wCalMin(22)
                // padding-right: rem(2)
              ul .ico-edit, .ico-add,.ico-del,.ico-update,.ico-back
                display: none
            &[level=s4]
              & > span
                wCalMin(82)
                // padding-right: rem(80)
              ul .ico-add
                display: none
            > span
              wCalMin(22)
              display: inline-block
              // padding-right: rem(96)
              .node-name
                max-width: calMin(20)
                float: left
                height: rem(26)
                line-height: rem(26)
                display: inline-block
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
              > i
                margin-top: rem(5)
                margin-right: rem(5)
                float: left
                .cur-node
                  display: none
            ul
              position: absolute
              right: rem(8)
              > li
                width: rem(15)
                height: rem(15)
                line-height: rem(15)
                margin: 0 rem(2)
                float: left
                .avatar-uploader
                  width: 100%
                  height: 100%
            >>> .el-upload
                  width: 100%
                  height: rem(15)
            ul[level=s1]
              .ico-edit,.ico-del,.ico-update,.ico-back
                display: none
            ul[level=s2]
              .ico-edit, .ico-add,.ico-del,.ico-update,.ico-back
                display: none
            ul[level=s4]
              .ico-add
                display: none
          >>> .el-tree-node__expand-icon
            color: $border-color
            margin-top: rem(-5)
          >>> .is-leaf
            color: transparent
          >>> .is-current
            >.el-tree-node__content:nth-child(1)
              .custom-tree-node > span>span.node-name,.el-tree-node__expand-icon
                color: $color
              .is-leaf
                color: transparent
          >>> .el-tree-node__content
            .active > span>span.node-name,.active~span.el-tree-node__expand-icon
              color: $color
</style>
