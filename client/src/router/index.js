import Vue from 'vue';
import Router from 'vue-router';
import Index from '../view/Loan.vue';
import Robot from '../view/Robot.vue';
import Home from '../view/Home.vue';
import Register from '../view/Register.vue';
import Login from '../view/Login.vue';
import Chat from '../view/Chat.vue';
import Avatar from '../view/Avatar.vue';
import BaseTransition from '../BaseTransition.vue';
import loading from '../components/loading/loading';

Router.prototype.goBack = function () {
  this.isBack = true;
  window.history.go(-1);
};
Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'BaseTransition',
      component: BaseTransition,
      children: [
        {
          path: '',
          name: 'index',
          component: Index
        },
        {
          path: '/chat',
          name: 'chat',
          component: Chat
        },
        {
          path: '/robot',
          name: 'Robot',
          component: Robot
        }
      ]
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/avatar',
      name: 'avatar',
      component: Avatar
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  loading.show();
  next();
});

router.afterEach(route => {
  loading.hide();
});

export default router;
