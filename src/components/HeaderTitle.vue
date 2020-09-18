<template>
  <div class="headerTitle">
    <i class="iconfont icon-iconfontjiantouzuo" @click="handleClick" v-if="showReturn"></i>
    <p class="title">{{headerTitle}}</p>
  </div>
</template>

<script>
  export default {
    // props: ['headerTitle','backUrl','showReturn'],
    props: {
      headerTitle: {},
      backUrl: {},
      showReturn: {
        default: true
      }
    },
    methods: {
      handleClick () {
        if (this.backUrl) {
          this.$router.push(this.backUrl)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.headerTitle {
  display: flex;
  position: relative;
  justify-content: center;
  margin-top: .88rem;
  height: .453333rem;
  line-height: .453333rem;
  .icon-iconfontjiantouzuo {
    position: absolute;
    left: .52rem;
    font-size: .373333rem;
    color: #fff;
  }
  .title {
    font-size: .5rem;
    color: #FFFFFF;
    font-family:Source Han Sans CN;
  }
} 
</style>
