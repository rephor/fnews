<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

  @Component({})
export default class App extends Vue {
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import './common/css/reset.styl'
  html
    font-size $font-size
    #app
      font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif
      -webkit-font-smoothing: antialiased
      -moz-osx-font-smoothing: grayscale
      width: 100%
      height: 100%
      position: relative
      /*text-align: center*/
      color: #2c3e50
</style>
