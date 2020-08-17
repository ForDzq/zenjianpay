<template>
  <div>
    <div class="payResult" @click="reqResult">查询支付结果</div>
    <iframe width="100%" class="wrapper" :src="url" frameborder="0"/>
  </div>
</template>

<script>
  import {reqPayHandleResult} from '../../api'
  export default {
    props: ['payUrl'],
    data() {
      return {
        url: this.payUrl || (this.$route.params && this.$route.params.url),
        ORDER_NO: this.$route.params.ORDER_NO
      }
    },
    methods: {
      reqResult () {
        // 第四个请求，查询支付结果
        let paramResult = {
          TRADE_NO: this.ORDER_NO,
          TRANS_CODE: '05'
        }
        reqPayHandleResult(paramResult).then(({data,success}) => {
          if (success && data) {
            if (data.TRADE_STATUS == '1') {
              this.$router.push({name:'PayResults',params:{TRADE_STATUS:true}})
            } else if (data.TRADE_STATUS == '0' || data.TRADE_STATUS == '2') {
              this.$router.push({name:'PayResults',params:{TRADE_STATUS:false}})
            }
          }
          this.$router.push({name:'PayResults',params: {TRADE_STATUS:true}}) // 这个要去掉
        }).catch(e => {console.log('获取支付结果错误----',e)})
      }
    }
  }
</script>

<style lang="scss" scoped>
.payResult {
  // width: 90%;
  height: 34px;
  line-height: 34px;
  // margin: 0 10px 6px 10px;
  // border-radius: 4px;
  margin-bottom: 6px;
  text-align: center;
  font-size: 18px;
  color: #fff;
  background-color: #0065b3;
}
.wrapper {
  min-height: calc(100vh - 44px);
}
</style>
