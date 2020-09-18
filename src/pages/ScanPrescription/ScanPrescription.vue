<template>
  <div>
    <div class="loading" v-if="loading">
      <div class="isLoading" v-if="!isReqAgain">加载中...</div>
      <div class="reqAgain" v-else @click="reqAgain">加载失败，请重新加载</div>
    </div>
    <div class="container" v-else>
      <div class="historyPayment" @click="expandHistory">
        <img src="../../assets/images/ScanPrescription_historyPayment.png" />
      </div>
      <div class="history_container" v-if="showHistory">
        <div class="history_mask">
          <div class="list">
            <div class="title">历史订单<i class="iconfont icon-quxiao" @click="collectList"></i></div>
            <template v-if="historyPayRows && historyPayRows.length">
              <div class="prescriptionList_wrapper">
                <div
                  class="prescriptionList"
                  v-for="(item,index) in historyPayRows"
                  :key="index"
                  :class="{hasMargin: showArrHistory[index]}"
                >
                  <div class="prescriptionList_title">
                    <div class="title_num">缴费时间：{{item.PAYMENT_INFO[0].FORMAT_DATE}}</div>
                    <!-- <div class="title_num">单号：{{item[0].ORDER_NO}}</div> -->
                    <div class="title_price">
                      ￥{{item.TOTAL}}
                      <i
                        class="iconfont icon-up"
                        @click="clickExpand($event,index,'historyList')"
                      ></i>
                    </div>
                  </div>
                  <div class="prescriptionList_bar">
                    <img src="../../assets/images/ScanPrescription_bar.png" alt="条的图片" />
                  </div>
                  <div class="prescriptionList_frame" :ref="'aaa'+index" v-show="!showArrHistory[index]">
                    <!-- <div class="frame_title">{{item[0].ITEM_CLASS}}</div> -->
                    <!-- <div class="frame_time">开处方时间：{{item.VISIT_DATE}}</div> -->
                    <div class="frame_time">缴费单号：{{item.PAYMENT_INFO[0].ORDER_NO}}</div>
                    <div
                      class="frame_detail"
                      v-for="(smallItem,smallIndex) in item.PAYMENT_INFO"
                      :key="smallIndex"
                    >
                      <div class="detail detail_name">{{smallItem.ITEM_NAME}}</div>
                      <div class="detail detail_price">￥{{smallItem.ACCOUNT_SUM}}</div>
                      <!-- <div class="detail detail_order">{{smallItem.ITEM_AMOUNT}}</div>
                      <div class="detail detail_price">￥{{smallItem.ITEM_COSTS}}</div> -->
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="noHistory_wrapper" v-else>
              <div v-if="loadingHistory">
                <div v-if="!reqAgainHistory">加载中...</div>
                <div class="btn" v-else @click="reqHistoryAgain">加载失败，请重新加载</div>
              </div>
              <div v-else>暂无历史缴费信息</div>
          </div>
          </div>
        </div>
      </div>
      <div class="header">
        <header-title :headerTitle="headerTitle" :showReturn="false"></header-title>
      </div>
      <div class="hospital">
        <div class="hospital_img">
          <img src="../../assets/images/ScanPrescription_circle.png" alt="医院图片" />
        </div>
        <div class="hosipital_desc">
          <div class="title">{{HOSPITAL_NAME}}</div>
          <div class="level">{{HOSPITAL_LEVEL}}</div>
        </div>
      </div>
      <div class="collect_wrap" ref="wrapper">
        <div class="collect">
          <div class="collect_price">
            <div class="item">
              <div class="item_left">姓名</div>
              <div class="item_right">{{NAME}}</div>
            </div>
            <div class="item" v-if="hasPayment">
              <div class="item_left">总金额</div>
              <div class="item_right allPrice">￥{{ACCOUNT_SUM}}</div>
            </div>
            <div class="noPayment" v-else>
              暂无待缴费信息
            </div>
          </div>
          <template v-if="PAYMENT_INFO.length">
            <div
              class="prescriptionList"
              v-for="(item,index) in PAYMENT_INFO"
              :key="index"
              :class="{hasMargin: showArr[index]}"
            >
              <div class="prescriptionList_title">
                <div class="title_num">类别：{{item.ITEM_CLASS}}</div>
                <div class="title_price">
                  ￥{{item.ACCOUNT_SUM}}
                  <i
                    class="iconfont icon-up"
                    @click="clickExpand($event,index)"
                  ></i>
                </div>
              </div>
              <div class="prescriptionList_bar">
                <img src="../../assets/images/ScanPrescription_bar.png" alt="条的图片" />
              </div>
              <div class="prescriptionList_frame" :ref="'aaa'+index" v-show="!showArr[index]">
                <!-- <div class="frame_title">{{item.ITEM_CLASS}}</div> -->
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
              </div>
            </div>
          </template>
        </div>
        <div class="btn" @click="confirmPayment" v-if="hasPayment">确认支付</div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "../../components/HeaderTitle";
import { reqPaymentBusinessFast, reqPayHandle, reqOutTradeNo, reqPayHisFast} from "../../api";
export default {
  name: "ScanPrescription", // 使用路由缓存的时候需要在这里设置
  components: {
    HeaderTitle
  },
  data() {
    return {
      historyPayRows: '', // 历史缴费记录
      loading: true,
      loadingHistory: true, // 查询历史记录的loading
      reqAgainHistory: false, // 重新查询历史记录
      isReqAgain: false,
      headerTitle: "处方单扫码",
      NAME: '', // 显示的用户名，从扫码付的链接中拿
      PATIENT_NAME: "", // 用户名
      PATIENT_ID: "", // 用户id
      ID_NO: "", // 身份证号
      paramPayment: "", // 扫码跳转的链接中携带的参数
      showHistory: false, // 是否展示历史缴费列表
      showArrHistory: [], //历史缴费记录中控制点击时展开还是收起列表
      showArr: [], // 控制点击时展开还是收起列表
      payUrl: "", // 支付的url
      PUBLIC_SERVICE_TYPE: "", // 交易来源
      HOSPITAL_NAME: "", // 医院名称
      HOSPITAL_LEVEL: "", // 医院等级
      hasPayment: '', // 是否有代缴费的信息
      HOSPITAL_ID: "", // 医院id
      ACCOUNT_SUM: "", // 总金额
      OUT_TRADE_NO: "", // 支付订单号，可多项订单支付
      DETAIL_ORDER_NO: "", // 订单号的数组，用于获取支付url
      PAYMENT_INFO: []
    };
  },
  watch: {
    OUT_TRADE_NO: {
      handler(newVal) {
        localStorage.setItem("OUT_TRADE_NO", newVal);
      }
    },
    $route: {
      handler: function(to, from) {
        if (from && from.path == "/PayResults") {
          // console.log('路由监视----from,from.path',from && from.path == '/PayResults')
          this.reqPaymentBusiness();
        }
      }
    }
  },
  methods: {
    reqHistoryAgain () {
      this.reqHistoryList()
    },
    expandHistory() {
      this.showHistory = true
      this.reqHistoryList()
    },
    collectList () {
      this.showHistory = false
    },
    // 点击向上或向下箭头展开和收起列表
    clickExpand(event, index,historyList) {
      if (historyList && historyList == 'historyList') {
        this.$set(this.showArrHistory, index, !this.showArrHistory[index]);
      } else {
        this.$set(this.showArr, index, !this.showArr[index]);
      }
      if (
        event.target.className &&
        event.target.className.indexOf("icon-arrow") != -1
      ) {
        event.target.className = "iconfont icon-up";
      } else if (
        event.target.className &&
        event.target.className.indexOf("icon-up") != -1
      ) {
        event.target.className = "iconfont icon-arrow";
      }
    },
    // 点击确认支付
    async confirmPayment() {
      // if (!this.hasPayment) {
      //   alert('暂无待缴费的信息')
      //   return
      // }
      if (this.payUrl) {
        window.location.href = this.payUrl;
      } else {
        await this.reqTradeNo();
        if (this.OUT_TRADE_NO) {
          await this.requestPayUrl();
          if (this.payUrl) {
            window.location.href = this.payUrl;
          } else {
            alert("请求失败，请重新点击确认支付");
          }
        } else {
          alert("请求失败，请重新点击确认支付");
        }
      }
      // this.$router.push('/PayResults')
    },
    // 获取历史缴费信息
    reqHistoryList () {
      let param = {
        op:"getPayHisFast",
        HOSPITALID_TREE: this.paramPayment && this.paramPayment.HOSPITALID_TREE,
        INPUT_PATIENT_ID: this.paramPayment && this.paramPayment.patientId,
        SORT_RULE: 1,
      }
      this.loadingHistory = true
      return reqPayHisFast(param).then(({ data }) => {
          if (data.resultCode == "0000000") {
            this.loadingHistory = false
            let res = data.data
            this.historyPayRows = res.rows
            try {
              this.historyPayRows = res.rows
              if (this.historyPayRows && this.historyPayRows.length) {
                 this.historyPayRows.forEach((item) => {item.PAYMENT_INFO = JSON.parse(item.PAYMENT_INFO)})
              }
            } catch(e) {
              console.log('json.parse解析历史缴费记录错误',e)
            }
          } else {
            this.loadingHistory = true
            this.reqAgainHistory = true
            console.log("获取历史缴费数据错误----");
          }
        })
        .catch(e => {
          this.loadingHistory = true
          this.reqAgainHistory = true
          console.log("获取历史缴费数据错误----", e);
        });
    },
    // 获取页面的所有展示信息
    reqPaymentBusiness() {
      this.loading = true;
      // console.log("location.search-----------this.$route.query",location.search,this.$route.query);
      let paramPayment = this.paramPayment;
      if (!paramPayment) {
        if (this.$route.query) {
          this.NAME = this.$route.query.NAME
          let obj = this.$route.query
          obj.op = 'paymentBusinessFast'
          delete(obj.NAME)
          paramPayment = obj
          this.paramPayment = obj
        }
        // paramPayment = this.$route.query;
        // let search = this.$route.query || location.search;
        // if (Object.keys(this.$route.query).length == 0 &&location.search != "") {
        //   search.slice(1).split("&").forEach(item => {
        //       let arr = item.split("=");
        //       paramPayment[arr[0]] = arr[1];
        //     });
        //   this.paramPayment = paramPayment;
        // } else {
        //   this.paramPayment = paramPayment;
        // }
      }
      return reqPaymentBusinessFast(paramPayment)
        .then(({ data }) => {
          // console.log("获取页面所有数据的data", data);
          // data = {"success":true,"time":"2020-08-20 16:12:26","message":"null","resultCode":"0000000","data":{"ID_NO":"6105**********3237","PUBLIC_SERVICE_TYPE":"020025","PAY_TOTAL":1,"SEX":"男","PAY":[{"HOSPITAL_NAME":"郑州市管城中医院","HOSPITAL_ID":20104,"PAYMENT_INFO":"[{\"HOSPITAL_NAME\":\"郑州市管城中医院\",\"ITEM_CLASS\":\"西药\",\"PERFORMED_BY\":\"口腔科门诊\",\"PRESC_ATTR\":\"2020082010115\",\"SERIAL_NO\":\"57388-5004-10425\",\"CHOOSE_MODEL\":\"1\",\"T_RECORD_ID\":0,\"TOTAL\":0,\"SHOW_NAME\":\"流水号：57388-5004-10425\",\"DELETE_FLAG\":1,\"ENABLE_REFUND_FLAG\":\"0\",\"EQUAL_FLAG\":\"true\",\"REC_MASTER_ID\":128674185,\"HOSPITAL_ID\":20104,\"PATIENT_ID\":\"610524199112063237\",\"USER_VS_ID\":0,\"USER_ID\":0,\"USER_NAME\":\"李雪锋\",\"PAY_FLAG\":\"0\",\"PAYTYPE_FLAG\":\"\",\"ACCOUNT_SUM\":1.730,\"REMARK\":\"6\",\"PAYDETAIL\":[{\"APPLY_NAME\":\"阿莫西林胶囊\",\"IS_CONFIRM\":\"0\",\"REC_DETAIL_ID\":1,\"REC_MASTER_ID\":128674185,\"ITEM_NO\":\"10112002CP0\",\"ITEM_NAME\":\"阿莫西林胶囊(西药)\",\"ITEM_COSTS\":1.730,\"VISIT_DATE\":\"2020/08/20\",\"SERIAL_NO\":\"57388-5004-10425\",\"ITEM_CLASS\":\"西药\",\"ITEM_CODE\":\"10112002CP0\",\"PERFORMED_BY\":\"口腔科门诊\",\"DRUG_WINDOWS\":\"\",\"PRESC_ATTR\":\"2020082010115\",\"VISIT_NO\":\"10115\"}],\"UNIQUE_KEY\":\"af432e6580cdbb8108ef25158dc5a0a5\",\"VISIT_DATE\":\"2020/08/20\"},{\"HOSPITAL_NAME\":\"郑州市管城中医院\",\"ITEM_CLASS\":\"检查\",\"PERFORMED_BY\":\"口腔科门诊\",\"PRESC_ATTR\":\"2020082010115\",\"SERIAL_NO\":\"57391-3003-0\",\"CHOOSE_MODEL\":\"1\",\"T_RECORD_ID\":0,\"TOTAL\":0,\"SHOW_NAME\":\"流水号：57391-3003-0\",\"DELETE_FLAG\":1,\"ENABLE_REFUND_FLAG\":\"0\",\"EQUAL_FLAG\":\"true\",\"REC_MASTER_ID\":128674186,\"HOSPITAL_ID\":20104,\"PATIENT_ID\":\"610524199112063237\",\"USER_VS_ID\":0,\"USER_ID\":0,\"USER_NAME\":\"李雪锋\",\"PAY_FLAG\":\"0\",\"PAYTYPE_FLAG\":\"\",\"ACCOUNT_SUM\":72.000,\"REMARK\":\"6\",\"PAYDETAIL\":[{\"APPLY_NAME\":\"肝胆胰脾彩超\",\"IS_CONFIRM\":\"0\",\"REC_DETAIL_ID\":2,\"REC_MASTER_ID\":128674186,\"ITEM_NO\":\"CCGDYYD001\",\"ITEM_NAME\":\"肝胆胰脾彩超(检查)\",\"ITEM_COSTS\":72.000,\"VISIT_DATE\":\"2020/08/20\",\"SERIAL_NO\":\"57391-3003-0\",\"ITEM_CLASS\":\"检查\",\"ITEM_CODE\":\"CCGDYYD001\",\"PERFORMED_BY\":\"口腔科门诊\",\"DRUG_WINDOWS\":\"\",\"PRESC_ATTR\":\"2020082010115\",\"VISIT_NO\":\"10115\"}],\"UNIQUE_KEY\":\"9adc66d3db4dbd1465f3d7fc62c7c825\",\"VISIT_DATE\":\"2020/08/20\"},{\"HOSPITAL_NAME\":\"郑州市管城中医院\",\"ITEM_CLASS\":\"化验\",\"PERFORMED_BY\":\"口腔科门诊\",\"PRESC_ATTR\":\"2020082010115\",\"SERIAL_NO\":\"57393-3000-0\",\"CHOOSE_MODEL\":\"1\",\"T_RECORD_ID\":0,\"TOTAL\":0,\"SHOW_NAME\":\"流水号：57393-3000-0\",\"DELETE_FLAG\":1,\"ENABLE_REFUND_FLAG\":\"0\",\"EQUAL_FLAG\":\"true\",\"REC_MASTER_ID\":128674187,\"HOSPITAL_ID\":20104,\"PATIENT_ID\":\"610524199112063237\",\"USER_VS_ID\":0,\"USER_ID\":0,\"USER_NAME\":\"李雪锋\",\"PAY_FLAG\":\"0\",\"PAYTYPE_FLAG\":\"\",\"ACCOUNT_SUM\":29.700,\"REMARK\":\"6\",\"PAYDETAIL\":[{\"APPLY_NAME\":\"尿常规\",\"IS_CONFIRM\":\"0\",\"REC_DETAIL_ID\":3,\"REC_MASTER_ID\":128674187,\"ITEM_NO\":\"JYKXZ000009\",\"ITEM_NAME\":\"尿常规(化验)\",\"ITEM_COSTS\":7.200,\"VISIT_DATE\":\"2020/08/20\",\"SERIAL_NO\":\"57393-3000-0\",\"ITEM_CLASS\":\"化验\",\"ITEM_CODE\":\"JYKXZ000009\",\"PERFORMED_BY\":\"口腔科门诊\",\"DRUG_WINDOWS\":\"\",\"PRESC_ATTR\":\"2020082010115\",\"VISIT_NO\":\"10115\"},{\"APPLY_NAME\":\"血常规（五分类）\",\"IS_CONFIRM\":\"0\",\"REC_DETAIL_ID\":4,\"REC_MASTER_ID\":128674187,\"ITEM_NO\":\"JYKXZ00051\",\"ITEM_NAME\":\"血常规（五分类）(化验)\",\"ITEM_COSTS\":17.100,\"VISIT_DATE\":\"2020/08/20\",\"SERIAL_NO\":\"57393-3000-0\",\"ITEM_CLASS\":\"化验\",\"ITEM_CODE\":\"JYKXZ00051\",\"PERFORMED_BY\":\"口腔科门诊\",\"DRUG_WINDOWS\":\"\",\"PRESC_ATTR\":\"2020082010115\",\"VISIT_NO\":\"10115\"},{\"APPLY_NAME\":\"采血管\",\"IS_CONFIRM\":\"0\",\"REC_DETAIL_ID\":5,\"REC_MASTER_ID\":128674187,\"ITEM_NO\":\"CXG045\",\"ITEM_NAME\":\"采血管(材料)\",\"ITEM_COSTS\":0.450,\"VISIT_DATE\":\"2020/08/20\",\"SERIAL_NO\":\"57393-3000-0\",\"ITEM_CLASS\":\"材料\",\"ITEM_CODE\":\"CXG045\",\"PERFORMED_BY\":\"口腔科门诊\",\"DRUG_WINDOWS\":\"\",\"PRESC_ATTR\":\"2020082010115\",\"VISIT_NO\":\"10115\"},{\"APPLY_NAME\":\"静脉采血(检验科)\",\"IS_CONFIRM\":\"0\",\"REC_DETAIL_ID\":6,\"REC_MASTER_ID\":128674187,\"ITEM_NO\":\"12040000201\",\"ITEM_NAME\":\"静脉采血(检验科)(治疗)\",\"ITEM_COSTS\":4.950,\"VISIT_DATE\":\"2020/08/20\",\"SERIAL_NO\":\"57393-3000-0\",\"ITEM_CLASS\":\"治疗\",\"ITEM_CODE\":\"12040000201\",\"PERFORMED_BY\":\"口腔科门诊\",\"DRUG_WINDOWS\":\"\",\"PRESC_ATTR\":\"2020082010115\",\"VISIT_NO\":\"10115\"}],\"UNIQUE_KEY\":\"09fb8605abeb9b35aaceedbd415cd33d\",\"VISIT_DATE\":\"2020/08/20\"}]","CHOOSE_MODEL":"1","TOTAL":"3","ACCOUNT_SUM":103.430,"TOTAL_ROUND":"2","DELETE_FLAG":1,"REG_ID":"128674185,128674186,128674187","NEED_REMOVE":true}],"QUERY_PAY_TYPE":"2","PATIENT_NAME":"李雪锋","CLINIC_TOTAL_FEE_INFO":"已根据医院财务要求进行位数处理","PHONE_NUMBER":"","VISIT_NO":"10115","AGE":28}}
          if (data.resultCode == "0000000") {
            this.loading = false;
            let res = data.data;
            this.hasPayment = (res.PAY && res.PAY.length) ? true : false
            this.PATIENT_NAME = res.PATIENT_NAME;
            this.ID_NO = res.ID_NO;
            this.HOSPITAL_NAME = res.HOSPITAL_NAME;
            this.HOSPITAL_LEVEL = res.HOSPITAL_LEVEL
            this.HOSPITAL_ID = res.PAY[0] && res.PAY[0].HOSPITAL_ID;
            this.ACCOUNT_SUM = res.PAY[0] && res.PAY[0].ACCOUNT_SUM;
            this.PUBLIC_SERVICE_TYPE = res.PUBLIC_SERVICE_TYPE;
            this.PAYMENT_INFO =
              (res.PAY[0] &&
                res.PAY[0].PAYMENT_INFO &&
                JSON.parse(res.PAY[0].PAYMENT_INFO)) ||
              [];
            this.DETAIL_ORDER_NO =
              this.PAYMENT_INFO &&
              this.PAYMENT_INFO.map(item => {
                return { REC_MASTER_ID: item.REC_MASTER_ID };
              });
          } else {
            this.isReqAgain = true;
          }
        })
        .catch(e => {
          this.isReqAgain = true;
          console.log("获取页面所有数据错误----", e);
        });
    },
    // 获取订单号，可多选或者单选来支付 &isLogin=false&loc=c&opVersion=2.6.71&isWebS=1&auth=0&hospitalID=20104
    reqTradeNo() {
      let param = {
        op: "getOrderNoForFee",
        IS_CLINIC_FAST: 1,
        USER_VS_ID: -1,
        operateCurrent_UserId: -1,
        // USER_VS_ID: this.PAYMENT_INFO[0] && this.PAYMENT_INFO[0].USER_VS_ID,
        // operateCurrent_UserId: this.PAYMENT_INFO[0] && this.PAYMENT_INFO[0].USER_ID,
        MODEL_HOSPITAL_ID: this.HOSPITAL_ID,
        details:
          (this.DETAIL_ORDER_NO && JSON.stringify(this.DETAIL_ORDER_NO)) || [],
        // details: [{REC_MASTER_ID:128674185},{REC_MASTER_ID:128674186},{REC_MASTER_ID:128674187}],
        MARK_DESC: `${this.PATIENT_NAME}的缴费单`,
        AMOUNT: this.ACCOUNT_SUM,
        isLogin: false,
        loc: "c",
        opVersion: "2.6.71",
        isWebS: 1,
        auth: 0,
        hospitalID: this.HOSPITAL_ID
      };
      return reqOutTradeNo(param)
        .then(({ data }) => {
          if (data.resultCode == "0000000") {
            let res = data.data;
            this.OUT_TRADE_NO = res.OUT_TRADE_NO;
          }
        })
        .catch(e => {
          console.log("获取支付订单号错误(支持多个订单支付)----", e);
        });
    },
    // 获取支付url
    requestPayUrl() {
      let param = {
        loc: "c",
        op: "payHandle",
        PAY_TYPE: "54",
        PUBLIC_SERVICE_TYPE: this.PUBLIC_SERVICE_TYPE,
        AMOUNT: this.ACCOUNT_SUM,
        hospitalID: this.HOSPITAL_ID,
        TRADE_NO: this.OUT_TRADE_NO, //交易订单号
        TRANS_CODE: "01"
      };
      return reqPayHandle(param)
        .then(({ data }) => {
          if (data.resultCode == "0000000") {
            let res = data.data;
            if (res.html) {
              this.payUrl = res.html;
            }
          } else {
            console.log("获取支付url失败--data", data);
          }
        })
        .catch(e => {
          console.log("获取支付url失败----", e);
        });
    },
    async reqAgain() {
      await this.reqPaymentBusiness();
      await this.reqTradeNo();
      if (this.OUT_TRADE_NO) {
        this.requestPayUrl();
      }
    }
  },
  async created() {
    await this.reqPaymentBusiness();
    await this.reqTradeNo()
    if (this.OUT_TRADE_NO) {
      this.requestPayUrl()
    }
  }
};
</script>
<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .isLoading {
    color: rgba(56, 134, 233, 1);
    font-size: 0.533333rem;
  }
  .reqAgain {
    height: 0.72rem;
    line-height: 0.72rem;
    padding: 0 0.233333rem;
    background: rgba(94, 117, 237, 1);
    border-radius: 0.546667rem;
    border: 0px;
    font-size: 0.4rem;
    color: #fff;
  }
}
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  .historyPayment {
    position: absolute;
    z-index: 9999;
    right: 0;
    top: 50%;
    width: 2.36rem;
    height: 2.693333rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .history_container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10000;
    .history_mask {
      width: 100%;
      height: 100%;
      background-color: rgba(74, 74, 74, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      .list {
        box-sizing: border-box;
        width: 90%;
        height: 74%;
        background-color: #fff;
        .title {
          position: relative;
          height: 36px;
          line-height: 36px;
          text-align: center;
          margin-bottom: 20px;
          background-color: rgba(94, 117, 237, 1);
          color: #fff;
          font-size: 0.46rem;
          font-family: Source Han Sans CN;
          font-weight: bold;
          .icon-quxiao {
            position: absolute;
            right: .42rem;
            font-size: .373333rem;
            color: #fff;
          }
        }
        .noHistory_wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100% - 56px);
          font-size: 0.5rem;
          font-weight: bold;
          color: rgba(94, 117, 237, 1);
          .btn {
            width: 170px;
            height: 0.72rem;
            line-height: 0.72rem;
            padding: 0 0.233333rem;
            background: rgba(94, 117, 237, 1);
            border-radius: 0.546667rem;
            border: 0px;
            font-size: 0.4rem;
            color: #fff;
          }
        }
        .prescriptionList_wrapper {
          height: calc(100% - 56px);
          overflow: auto;
          .hasMargin {
            margin-bottom: 0.433333rem;
          }
          .prescriptionList {
            position: relative;
            // margin-bottom: 6px;
            .prescriptionList_title {
              display: flex;
              justify-content: space-between;
              // margin: 0 0.333333rem 0.133333rem 0.226667rem;
              margin: 0 0.48rem 0.226667rem;
              height: 0.44rem;
              line-height: 0.44rem;
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
              margin: 0 6px;
              img {
                vertical-align: top;
                width: 100%;
              }
            }
            .prescriptionList_frame {
              margin: 0px 20px 0px;
              box-sizing: border-box;
              background: url("../../assets/images/ScanPrescription_frame_expand.png")
                no-repeat;
              background-size: 100% auto;
              background-position: left bottom;
              padding: 0.586667rem 0.5rem 1.053333rem 0.5rem;
              box-shadow: -10px 0px 10px -10px rgb(233, 231, 231),
                10px 0px 10px -10px rgb(233, 231, 231);
              .frame_title {
                font-size: 0.48rem;
                color: rgba(51, 51, 51, 1);
                margin-bottom: 0.426667rem;
              }
              .frame_time {
                font-size: 0.32rem;
                color: rgba(98, 98, 98, 1);
                margin-bottom: 0.4rem;
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
                  margin-right: 10px;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
                // .detail_order {
                //   width: 25%;
                // }
                // .detail_price {
                //   width: 25%;
                // }
              }
            }
          }
        }
      }
    }
  }
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
      // margin: 0 0.546667rem;
      padding: 0 0.546667rem;
      .collect_price {
        width: 100%;
        margin-bottom: 0.613333rem;
        background-color: #fff;
        box-sizing: border-box;
        padding-bottom: 0.3rem;
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
        .noPayment {
          margin: 20px 0;
          text-align: center;
          font-size: 0.48rem;
          color: rgba(102, 102, 102, 1);
          font-family: Source Han Sans CN;
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
          margin: 0px 15px 0px;
          box-sizing: border-box;
          background: url("../../assets/images/ScanPrescription_frame_expand.png")
            no-repeat;
          background-size: 100% auto;
          background-position: left bottom;
          background-color: #fff;
          padding: 0.586667rem 0.5rem 1.053333rem 0.5rem;
          box-shadow: -10px 0px 10px -10px rgb(233, 231, 231),
            10px 0px 10px -10px rgb(233, 231, 231);
          .frame_title {
            font-size: 0.48rem;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 0.426667rem;
          }
          .frame_time {
            font-size: 0.32rem;
            color: rgba(98, 98, 98, 1);
            margin-bottom: 0.4rem;
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
              // width: 50%;
              margin-right: 10px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            // .detail_order {
            //   width: 25%;
            // }
            // .detail_price {
            //   width: 25%;
            // }
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
    text-align: center;
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