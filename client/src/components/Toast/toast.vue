<template>
  <div class="wind-toast" :style="{'background-color': background, 'color': color}">
    {{content}}
  </div>
</template>

<script>
  export default {
    name: "Toast",
    data() {
      return {
        content: '',
        timeout: 1500,
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        show: false
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style>
  @import './index.css';
</style>