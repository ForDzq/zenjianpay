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
      // console.log('touchStart事件000000000000-----',e)
      this.move = true
    },
    touchMove: throttle(function(e) {
      if (this.move) {
        let el = document.getElementById('dragWrapper')
        // console.log('touchMove事件1111111111111111-----',e)
        let newX = e.touches[0].clientX - 20
        let newY = e.touches[0].clientY - 20
        el.setAttribute("style",`left:${newX}px;top:${newY}px;position:'absloute'`)//一次添加多个
      }
    },80),
    touchEnd () {
      this.move = false
      let leftOrRight = this.left ? 'left' : 'right'
      // let el = document.getElementById('dragWrapper')
      let el = this.$refs.dragWrapper
      // (leftOrRight == 'left') && el.style.left = ''
      if (leftOrRight == 'right') {
        el.style.left = ''
      }
      // console.log('touchend事件22222222222222222-----',e)
      el.style[leftOrRight] = this[leftOrRight] || '0px'
    }
  },
  mounted () {
    let leftOrRight = this.left ? 'left' : 'right'
    // let el = document.getElementById('dragWrapper')
    let el = this.$refs.dragWrapper
    // console.log('999999999999999-------',leftOrRight,this.left,this.right,this.top)
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