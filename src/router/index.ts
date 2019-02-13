import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import content from '../views/content/content.vue'

Vue.use(Router)

const routes: RouteConfig[] = [{
  path: '/',
  name: 'content',
  component: content
}]

const router: Router = new Router({
  mode: 'history',
  routes
})

export default router
