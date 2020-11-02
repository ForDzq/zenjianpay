<template>
    <div class="dragWrapper" ref="dragWrapper" id="dragWrapper" @touchstart="touchStart" @touchmove.stop.prevent="touchMove" @touchend="touchEnd">
      <slot></slot>
    </div>
</template>
<script>
import throttle from 'lodash/throttle'
export default {
  name: 'drag',
  props: ['left','right','top'],
  data () {
    return {
      move: false
    }
  },
  methods: {
    touchStart () {
      this.move = true
    },
    touchMove: throttle(function(e) {
      if (this.move) {
        let el = document.getElementById('dragWrapper')
        let newX = e.touches[0].clientX - 20
        let newY = e.touches[0].clientY - 20
        el.setAttribute("style",`left:${newX}px;top:${newY}px;position:'absloute'`)//一次添加多个
      }
    },80),
    touchEnd () {
      this.move = false
      let leftOrRight = this.left ? 'left' : 'right'
      let el = this.$refs.dragWrapper
      if (leftOrRight == 'right') {
        el.style.left = ''
      }
      el.style[leftOrRight] = this[leftOrRight] || '0px'
    }
  },
  mounted () {
    let leftOrRight = this.left ? 'left' : 'right'
    let el = this.$refs.dragWrapper
    el.style[leftOrRight] = this[leftOrRight] || '0px'
    el.style.top = this.top ? this.top : '26%'
  }
}
</script>
<style lang="scss" scoped>
.dragWrapper {
    position: absolute;
    z-index: 10000;
    top: 26%;
  }
</style>