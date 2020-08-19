<template>
  <div class="container">
    <div class="header">
      <header-title :headerTitle="headerTitle" backUrl="/ScanPrescription"></header-title>
    </div>
    <div class="loading" v-if="loading">
      <div v-if="!reqAgain">正在查询中...</div>
      <div v-else class="reqBtn" @click="reqResult">查询失败，请点击重新查询</div>
    </div>
    <div class="response-text" v-else>
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
  import {reqPayHandleResult} from '../../api'
  export default {
    components: {
      HeaderTitle
    },
    data () {
      return {
        loading: true,
        reqAgain: false,
        responseText: '',
        headerTitle: '支付结果',
        ORDER_NO: localStorage.getItem('ORDER_NO')
      }
    },
    methods: {
      handleClick () {
        this.$router.push("/ScanPrescription")
      },
      // 查询支付结果
      reqResult () {
        this.reqAgain = false
        let paramResult = {
          TRADE_NO: this.ORDER_NO,
          TRANS_CODE: '05'
        }
        reqPayHandleResult(paramResult).then(({data}) => {
          if (data.resultCode == '0000000') {
            this.loading = false
            if (data.TRADE_STATUS == '1') {
              this.responseText = true
            } else if (data.TRADE_STATUS == '0' || data.TRADE_STATUS == '2') {
              this.responseText = false
            }
          } else if (data.success == false) {
            this.reqAgain = true
          }
        }).catch(e => {this.reqAgain = true;console.log('获取支付结果错误----',e)})
      }
    },
    created () {
      console.log('结果页面的---ORDER_NO',this.ORDER_NO)
      this.reqResult()
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
  .loading {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    margin-top: .506667rem;
    text-align: center;
    font-size:.48rem;
    font-weight:bold;
    color:rgba(56,134,233,1);
    font-family:Source Han Sans CN;
    .reqBtn {
      display: inline-block;
      height: .72rem;
      line-height: .72rem;
      padding: 0 .233333rem;
      background:rgba(94,117,237,1);
      border-radius: .546667rem;
      border: 0px;
      font-size: .4rem;
      color: #fff;
    }
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
