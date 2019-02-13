<template>
  <div class="main-content">
    <left-tree></left-tree>
    <div class="main-right">
      <ul>
        <li v-for="obj in tabObj"  :key="obj.txt" :class="{active:obj.status === 1}" @click="select(obj)">
          <i :class="['ico',obj.icoClass]"></i>
          <span>{{obj.txt}}</span>
        </li>
      </ul>
      <div class="right-content">
        <info-content :curTab="curTab"></info-content>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator'
import leftTree from '../../components/leftTree.vue'
import infoContent from '../../components/infoContent.vue'

  @Component({
    components: {
      leftTree,
      infoContent
    },
    filters: {
      status: (val) => {
        return val * -1
      }
    }
  })
export default class mainContent extends Vue {
    // data
    @Provide()
    tabObj = {
      statusInfo: {
        status: 1,
        index: 1,
        txt: '状态信息',
        icoClass: 'ico-info-status'
      },
      alarmInfo: {
        status: -1,
        index: 2,
        txt: '告警使能',
        icoClass: 'el-icon-info'
      },
      deviceInfo: {
        status: -1,
        index: 3,
        txt: '设备信息',
        icoClass: 'ico-device-info'
      },
      websiteParam: {
        status: -1,
        index: 4,
        txt: '网管参数',
        icoClass: 'ico-web-param'
      },
      deviceParam: {
        status: -1,
        index: 5,
        txt: '设备参数',
        icoClass: 'ico-device-param'
      },
      curData: {
        status: -1,
        index: 6,
        txt: '实时采样数据',
        icoClass: 'ico-real-data'
      }
    }
    @Provide() curTab: any = this.tabObj.statusInfo

    // methods
    select (obj: any) {
      for (let key in this.tabObj) {
        this.tabObj[key].status = -1
      }
      obj.status = 1
      this.curTab = obj
    }
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .main-content
    wCalMin(12)
    hCalMin(12)
    padding:  rem(6)
    .main-right
      float:  left
      wCalMin(306)
      height: 100%
      font-size: rem(13)
      margin-left: rem(6)
      box-sizing: border-box
      /*color: #909399*/
      ul
        width: 100%
        height: rem(35)
        background-color: #f7f7f7
        border: 1px solid #dcdfe6
        li
          /*width: 12%*/
          padding: 0 rem(12)
          display: inline-block
          height: rem(35)
          line-height: rem(35)
          text-align: center
          float: left
          border: 1px solid transparent
          transition: all .3s cubic-bezier(.645,.045,.355,1)
          &:hover
            /*background-color: #ccc*/
            cursor: pointer
            color: $color
          i,span
            font-size: rem(12)
          i.el-icon-info
            background: none
            font-size: rem(14)
            color: $color
            margin-top: rem(2)
        li.active
          background-color: $white
          border-left: 1px solid #dcdfe6
          border-right: 1px solid #dcdfe6
          border-bottom-color: transparent
          color: $color
          &:hover
            background-color: $white
            color: #2c3e50
      .right-content
        background-color: $white
        hCalMin(35)
</style>
