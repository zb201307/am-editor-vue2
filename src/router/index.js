import Vue from 'vue'
import Router from 'vue-router'
import amEditorVue2 from '@/components/amEditorVue2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'amEditorVue2',
      component: amEditorVue2
    }
  ]
})
