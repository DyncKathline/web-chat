<template>
  <div v-if="show" class="wind-alert">
    <div class="wind-alert-bg"></div>
    <div class="wind-alert-dialog animate-scale">
      <div class="wind-alert-title">{{title}}</div>
      <div class="wind-alert-content">{{content}}</div>
      <div class="wind-confirm-btns" >
        <div class="wind-confirm-btn" @click="onSubmit">{{ok}}</div>
        <div class="wind-confirm-btn" @click="onClose">{{cancel}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Confirm",
    data() {
      return {
        show: false,
        title: '',
        content: '',
        ok: '确定',
        cancel: '取消'
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
      onSubmit() {
        this.show = false;
      },
      onClose() {
        this.show = false;
      }
    }
  }
</script>

<style scoped>
  @import '../Alert/index.css';
  @import './index.css';
</style>