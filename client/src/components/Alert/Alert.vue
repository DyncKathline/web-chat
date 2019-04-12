<template>
  <div v-if="show" class="wind-alert">
    <div class="wind-alert-bg"></div>
    <div class="wind-alert-dialog animate-scale">
      <div class="wind-alert-title">{{title}}</div>
      <div v-if="content" class="wind-alert-content">{{content}}</div>
      <div v-if="html" class="wind-alert-content" v-html="html"></div>
      <div class="wind-alert-btn" @click="close">{{btn}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Alert",
    data() {
      return {
        show: false,
        title: '提示',
        content: '',
        btn: '确定',
        html: ''
      }
    },
    mounted() {
    },
    beforeMount () {
      //如果已经存在，则阻止出现第二次
      let node = document.querySelector('.wind-alert');
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    },
    destroyed () {
      //如果已经存在，则阻止出现第二次
      let node = document.querySelector('.wind-alert');
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    },
    methods: {
      close() {
        this.show = false;
        this.onClose('close');
      }
    }
  }
</script>

<style scoped>
  @import './index.css';
</style>