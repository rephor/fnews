import Vue from 'vue'
import leftTree from '@/components/leftTree.vue'

describe('leftTree.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(leftTree)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('h1').textContent)
      .toEqual('111')
  })
})
