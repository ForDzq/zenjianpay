<template>
  <div class="container">
    <div class="header">
      <header-title :headerTitle="headerTitle" backUrl="/ScanPrescription"></header-title>
    </div>
    <div class="response-text">
      <div v-if="responseText">支付成功!</div>
      <div v-else>
        <div class="fail-text">支付失败</div>
        <div>请重新支付</div>
      </div>
    </div>
    <button class="btn" @click="handleClick">返回</button>
  </div>
</template>

<script>
  import HeaderTitle from '../../components/HeaderTitle'
  export default {
    components: {
      HeaderTitle
    },
    data () {
      return {
        responseText: this.$route.params.TRADE_STATUS,
        headerTitle: '支付结果'
      }
    },
    methods: {
       handleClick () {
          this.$router.push("/ScanPrescription")
      }
    }
  }
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  .header {
    width: 100%;
    height: 6.133333rem;
    background: url('../../assets/images/payresults_bg.png') no-repeat;
    background-size: 100%;
    overflow: hidden;
  }
  .response-text {
    display: flex;
    justify-content: center;
    margin-top: .506667rem;
    text-align: center;
    font-size:.48rem;
    font-weight:bold;
    color:rgba(56,134,233,1);
    font-family:Source Han Sans CN;
    .fail-text {
      margin-bottom: .426667rem;;
    }
  }
  .btn {
    position: absolute;
    bottom: 1.453333rem;
    left: 50%;
    transform: translateX(-50%);
    width: 7.84rem;
    height: 1.08rem;
    line-height: 1.08rem;
    background:rgba(94,117,237,1);
    border-radius: .546667rem;
    border: 0px;
    font-size: .4rem;
    color: #fff;
  }
}
</style>
