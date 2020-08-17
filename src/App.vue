<template>
  <div id="app">
    <!-- <keep-alive include="PayIframe"> -->
    <router-view @getPayUrl="getPayUrl" :payUrl="payUrl"></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      payUrl: ''
    }
  },
  methods: {
    getPayUrl (payUrl) {
      this.payUrl = payUrl
    }
  }
}
</script>

<style>
</style>
