<template>
  <div class="container">
    <div class="header">
      <header-title :headerTitle="headerTitle"></header-title>
    </div>
    <div class="hospital">
      <div class="hospital_img">
        <img src="../../assets/images/ScanPrescription_circle.png" alt="医院图片" />
      </div>
      <div class="hosipital_desc">
        <div class="title">{{HOSPITAL_NAME}}</div>
        <div class="level">三甲医院</div>
      </div>
    </div>
    <div class="collect_wrap" ref="wrapper">
      <div class="collect">
        <div class="collect_price">
          <div class="item">
            <div class="item_left">总金额</div>
            <div class="item_right allPrice">￥{{ACCOUNT_SUM}}</div>
          </div>
          <div class="item" v-for="(item,index) in PAYMENT_INF" :key="index">
            <div class="item_left">{{item.USER_NAME}}</div>
            <div class="item_right">{{item.PATIENT_ID}}</div>
          </div>
        </div>
        <div
          class="prescriptionList"
          v-for="(item,index) in PAYMENT_INF"
          :key="index"
          :class="{hasMargin: showArr[index]}"
        >
          <div class="prescriptionList_title">
            <div class="title_num">单号：{{item.ORDER_NO}}</div>
            <div class="title_price">
              ￥{{item.ACCOUNT_SUM}}
              <i class="iconfont icon-up" @click="clickExpand($event,index)"></i>
            </div>
          </div>
          <div class="prescriptionList_bar">
            <img src="../../assets/images/ScanPrescription_bar.png" alt="条的图片" />
          </div>
          <div class="prescriptionList_frame" :ref="'aaa'+index" v-show="!showArr[index]">
            <div class="frame_title">{{item.ITEM_CLASS}}</div>
            <div class="frame_time">开处方时间：{{item.VISIT_DATE}}</div>
            <div
              class="frame_detail"
              v-for="(smallItem,smallIndex) in item.PAYDETAIL"
              :key="smallIndex"
            >
              <div class="detail detail_name">{{smallItem.APPLY_NAME}}</div>
              <div class="detail detail_order">{{smallItem.ITEM_AMOUNT}}</div>
              <div class="detail detail_price">￥{{smallItem.ITEM_COSTS}}</div>
            </div>
            <!-- <div class="frame_detail">
              <div class="detail detail_name">挂号费</div>
              <div class="detail detail_order">1</div>
              <div class="detail detail_price">￥20.00</div>
            </div>-->
          </div>
        </div>
        <!-- <div class="prescriptionList">
          <div class="prescriptionList_title">
            <div class="title_num">单号：02838474848949</div>
            <div class="title_price">
              ￥23.00
              <i class="iconfont icon-up" @click="clickExpand"></i>
            </div>
          </div>
          <div class="prescriptionList_bar">
            <img src="../../assets/images/ScanPrescription_bar.png" alt="条的图片" />
          </div>
          <div class="prescriptionList_frame">
            <div class="frame_title">口腔科门诊</div>
            <div class="frame_time">开处方时间：2019-11-11 14:34:16</div>
            <div class="frame_detail">
              <div class="detail detail_name">挂号费</div>
              <div class="detail detail_order">1</div>
              <div class="detail detail_price">￥20.00</div>
            </div>
            <div class="frame_detail">
              <div class="detail detail_name">挂号费</div>
              <div class="detail detail_order">1</div>
              <div class="detail detail_price">￥20.00</div>
            </div>
            <div class="frame_detail">
              <div class="detail detail_name">挂号费</div>
              <div class="detail detail_order">1</div>
              <div class="detail detail_price">￥20.00</div>
            </div>
          </div>
        </div>-->
      </div>
      <button class="btn" @click="confirmPayment">确认支付</button>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "../../components/HeaderTitle";
// import Bscroll from "better-scroll";
import {reqPaymentBusinessFast, reqPayHandle} from '../../api'
export default {
  components: {
    HeaderTitle
  },
  data() {
    return {
      paramPayment: '', // 扫码跳转的链接中携带的参数
      showArr: [], // 控制点击时展开还是收起列表
      payUrl: '', // 支付的url
      PUBLIC_SERVICE_TYPE: '', // 交易来源
      headerTitle: "处方单扫码",
      HOSPITAL_NAME: '医院名称',
      HOSPITAL_ID: '医院id',
      ACCOUNT_SUM: '总金额',
      PAYMENT_INF: [{
        ORDER_NO: '订单号', // 第二个请求要携带过去
        ACCOUNT_SUM: '总金额',
        USER_NAME: '用户名',
        PATIENT_ID: '用户ID',
        HOSPITAL_ID: '医院id',
        ITEM_CLASS: '缴费类别项目',
        VISIT_DATE: '就诊日期',
        PAYDETAIL: [{
          APPLY_NAME: '类别名称1',
          ITEM_AMOUNT: '数量1',
          ITEM_COSTS: '缴费金额1'
        },{
          APPLY_NAME: '类别名称2',
          ITEM_AMOUNT: '数量2',
          ITEM_COSTS: '缴费金额'
        }]
      },{
        ORDER_NO: '订单号', // 第二个请求要携带过去
        ACCOUNT_SUM: '总金额',
        USER_NAME: '用户名',
        PATIENT_ID: '用户ID',
        HOSPITAL_ID: '医院id',
        ITEM_CLASS: '缴费类别项目',
        VISIT_DATE: '就诊日期',
        PAYDETAIL: [{
          APPLY_NAME: '类别名称1',
          ITEM_AMOUNT: '数量1',
          ITEM_COSTS: '缴费金额1'
        },{
          APPLY_NAME: '类别名称2',
          ITEM_AMOUNT: '数量2',
          ITEM_COSTS: '缴费金额'
        }]
      }]
    }
  },
  methods: {
    // 点击向上或向下箭头展开和收起列表
    clickExpand(event,index) {
      this.$set(this.showArr,index,!this.showArr[index])
      if (event.target.className && event.target.className.indexOf("icon-arrow") != -1) {
        event.target.className = "iconfont icon-up"
      } else if (event.target.className && event.target.className.indexOf("icon-up") != -1) {
        event.target.className = "iconfont icon-arrow"
      }
    },
    // 点击确认支付
    async confirmPayment() {
      // if (this.payUrl) {
      //   this.$router.push({name:'PayIframe',params: {url:this.payUrl}})
      // } else {
      //   await this.requestPayUrl()
      //   console.log('点击确认支付重新发请求')
      //   if (this.payUrl) {
      //     this.$router.push({name:'PayIframe',params: {url:this.payUrl,ORDER_NO:this.PAYMENT_INF.ORDER_NO}})
      //   }
      // }
      // this.$router.push({name:'PayIframe',params: {url:'https://ibsbjstar.ccb.com.cn/CCBIS/ccbMain?MERCHANTID=105000080626673&POSID=046195227&BRANCHID=330000000&ORDERID=20200610173531972340&PAYMENT=0.01&CURCODE=01&TXCODE=520100&REMARK1=&REMARK2=&TYPE=1&PUB=6a2d0e2121d7f9e2715ae877020111&GATEWAY=&CLIENTIP=&REGINFO=&PROINFO=&REFERER=&MAC=e19441fe1268b9c70ddc8e56ac3cbc4d'}})
      // this.$emit('getPayUrl',this.payUrl)
    },
    // 获取页面的所有展示信息
    reqPaymentBusiness () {
      let paramPayment = {}
      let search = location.search
      if (search != '') {
        search.slice(1).split("&").forEach((item) => {
        let arr = item.split("=")
        paramPayment[arr[0]]=arr[1]
        })
        this.paramPayment = paramPayment
      }
      return reqPaymentBusinessFast(paramPayment).then(({data,success}) => {
        console.log('获取页面所有数据的data',data)
        if (success && data) {
          this.HOSPITAL_NAME = data.pay.HOSPITAL_NAME
          this.HOSPITAL_ID = data.pay.HOSPITAL_ID
          this.ACCOUNT_SUM = data.pay.ACCOUNT_SUM
          this.PUBLIC_SERVICE_TYPE = data.PUBLIC_SERVICE_TYPE
          this.PAYMENT_INF = JSON.parse(data.pay.PAYMENT_INF)
          console.log('json格式化后-----',JSON.parse(data.data.pay.PAYMENT_INF))
        }
      }).catch(e => {console.log('获取页面所有数据错误----',e)})
    },
    // 获取支付url
    requestPayUrl() {
      let param = {
        loc: 'c',
        op: 'payHandle',
        PAY_TYPE: '54',
        PUBLIC_SERVICE_TYPE: this.PUBLIC_SERVICE_TYPE,
        AMOUNT: this.ACCOUNT_SUM,
        hospitalID: this.HOSPITAL_ID,
        TRADE_NO: this.PAYMENT_INF.ORDER_NO, //交易订单号
        TRANS_CODE: '01'
      }
      return reqPayHandle(param).then(({data,success}) => {
        if (success) {
          if (data.REFERER) {
            this.payUrl = data.REFERER
          }
        } else {
          console.log('获取支付url失败')
        }
      }).catch(e => {console.log('获取支付url失败----',e)})
    }
  },
  async created() {
    await this.reqPaymentBusiness()
    this.requestPayUrl()
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
    background: url("../../assets/images/ScanPrescription_bg.png") no-repeat;
    background-size: 100%;
    overflow: hidden;
  }
  .hospital {
    display: flex;
    position: absolute;
    top: 1.826667rem;
    height: 1.933333rem;
    margin-left: 0.48rem;
    font-size: 0.48rem;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #fff;
    .hospital_img {
      width: 1.933333rem;
      height: 1.933333rem;
      margin-right: 0.44rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .hosipital_desc {
      .title {
        margin-top: 0.226667rem;
        margin-bottom: 0.333333rem;
      }
      .level {
        display: inline-block;
        height: 0.6rem;
        line-height: 0.6rem;
        padding: 0 0.453333rem;
        border-radius: 0.293333rem;
        font-size: 0.4rem;
        color: rgba(83, 82, 82, 1);
        background-color: #fff;
      }
    }
  }
  .collect_wrap {
    position: absolute;
    top: 3.92rem;
    box-sizing: border-box;
    width: 100%;
    height: calc(100vh - 3.92rem);
    // overflow-y: hidden; // 不用better-scroll的时候是auto
    // overflow-y: auto;
    .collect {
      // min-height: 100%;
      height: calc(100vh - 3.92rem - 2.08rem);
      overflow-y: auto;
      box-sizing: border-box;
      // padding-bottom: 2.76rem;
      margin: 0 0.546667rem;
      .collect_price {
        width: 100%;
        margin-bottom: 0.613333rem;
        background-color: #fff;
        box-sizing: border-box;
        padding-bottom: 0.506667rem;
        box-shadow: 0px 2px 0.36rem 0px rgba(4, 0, 0, 0.1);
        border-radius: 0.266667rem;
        .item {
          display: flex;
          justify-content: space-between;
          line-height: 1.173333rem;
          box-sizing: border-box;
          margin: 0 0.533333rem 0 0.4rem;
          border-bottom: 1px solid rgba(238, 238, 238, 1);
          font-size: 0.48rem;
          color: rgba(102, 102, 102, 1);
          font-family: Source Han Sans CN;
          &:nth-last-child(1) {
            border-bottom: 0px;
          }
          .item_right {
            color: rgba(0, 0, 0, 1);
          }
          .allPrice {
            color: rgba(246, 133, 0, 1);
          }
        }
      }
      .hasMargin {
        margin-bottom: 0.433333rem;
      }
      .prescriptionList {
        // background-color: pink;
        position: relative;
        .prescriptionList_title {
          display: flex;
          justify-content: space-between;
          margin: 0 0.333333rem 0.133333rem 0.226667rem;
          height: 0.4rem;
          line-height: 0.4rem;
          font-family: Source Han Sans CN;
          .title_num {
            font-size: 0.4rem;
            font-weight: bold;
            color: rgba(0, 0, 0, 1);
          }
          .title_price {
            font-size: 0.48rem;
            font-weight: 400;
            color: rgba(246, 133, 0, 1);
          }
        }
        .prescriptionList_bar {
          height: 0.173333rem;
          img {
            vertical-align: top;
            width: 100%;
          }
        }
        .prescriptionList_frame {
          margin-top: -0.34rem;
          width: 100%;
          box-sizing: border-box;
          padding: 0.786667rem 0.893333rem 1.053333rem 0.92rem;
          background: url("../../assets/images/ScanPrescription_frame_expand.png")
            no-repeat;
          background-size: 100% 100%;
          .frame_title {
            font-size: 0.48rem;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 0.426667rem;
          }
          .frame_time {
            font-size: 0.32rem;
            color: rgba(98, 98, 98, 1);
            margin-bottom: 0.8rem;
          }
          .frame_detail {
            display: flex;
            justify-content: space-between;
            height: 0.64rem;
            line-height: 0.64rem;
            .detail {
              font-size: 0.32rem;
              color: #333333;
            }
            .detail_name {
              width: 50%;
            }
            .detail_order {
              width: 25%;
            }
            .detail_price {
              width: 25%;
            }
          }
        }
      }
    }
  }
  .btn {
    display: block;
    margin: 0 auto;
    margin-top: 0.7rem;
    // margin-top: -1.76rem !important;
    // position: absolute;
    // bottom: 1.453333rem;
    // left: 50%;
    // transform: translateX(-50%);
    width: 7.84rem;
    height: 1.08rem;
    line-height: 1.08rem;
    // margin: 0 auto;
    // margin-bottom: .6rem;
    background: rgba(94, 117, 237, 1);
    border-radius: 0.546667rem;
    border: 0px;
    font-size: 0.4rem;
    color: #fff;
  }
}
</style>