import ajax from './ajax'
let isPro = process.env.NODE_ENV === 'production' // 开发环境是development
// axios.defaults.baseURL = baseURL
const BASE = isPro ? 'https://app.yiliao.ccb.com' : '/api'
// const BASE = '/api'

//1.1门诊快速缴费查询接口
export const reqPaymentBusinessFast = ({op,PUBLIC_SERVICE_TYPE,HOSPITALID_TREE,NAME,patientId,QUERY_TYPE,sign}) => ajax({
  method: 'GET',
  url: BASE+'/APP/payment/action/PaymentActionC.jspx',
  params: {
    op,
    PUBLIC_SERVICE_TYPE,
    HOSPITALID_TREE,
    // hospitalID,
    NAME,
    patientId,
    // ID_NO,
    QUERY_TYPE,
    sign
  }
})

//1.2支付方式查询接口 getPaymentMethod,暂时不用，固定写54
export const reqPaymentMethod = ({BUSINESSPAYTYPE,TRADE_NO,hospitalID}) => ajax({
  method: 'POST',
  url: BASE+'/APP/payment/bll/PaymentBllC.jspx',
  data: {
    BUSINESSPAYTYPE,
    TRADE_NO,
    hospitalID
  }
})

//1.3支付下单接口payHandle
export const reqPayHandle = ({loc,op,PAY_TYPE,PUBLIC_SERVICE_TYPE,USER_ID,USER_VS_ID,operateCurrent_UserId,operateUserSource,AMOUNT,hospitalID,TRADE_NO,TRANS_CODE}) => ajax({
  method: 'GET',
  url: BASE+'/APP/apppay/action/PayActionC.jspx',
  params: {
    loc,
    op,
    PAY_TYPE,
    PUBLIC_SERVICE_TYPE,
    USER_ID,
    USER_VS_ID,
    operateCurrent_UserId,
    operateUserSource,
    AMOUNT,
    hospitalID,
    TRADE_NO,
    TRANS_CODE
  }
})

//1.4支付结果查询接口
export const reqPayHandleResult = ({op,TRADE_NO,TRANS_CODE}) => ajax({
  method: 'GET',
  url: BASE+'/APP/apppay/action/PayActionC.jspx',
  params: {
    op,
    TRADE_NO,
    TRANS_CODE
  }
})

// 1.5 生成订单号，支持单选或者多选来支付OUT_TRADE_NO----/APP/ccb/payment/action/PaymentActionC.jspx
// {op,IS_CLINIC_FAST,USER_VS_ID,operateCurrent_UserId,MODEL_HOSPITAL_ID,details,MARK_DESC,AMOUNT,isLogin,loc,opVersion,isWebS,auth,hospitalID,TOTAL}
export const reqOutTradeNo = (val) => ajax({
  method: 'GET',
  url: BASE+'/APP/payment/action/PaymentActionC.jspx',
  params: val
})

// 1.6 查询历史缴费记录接口 /APP/ccb/payment/action/PaymentActionC.jspx  getPayHisFast
export const reqPayHisFast = ({op,HOSPITALID_TREE,INPUT_PATIENT_ID,SORT_RULE}) => ajax({
  method: 'GET',
  url: BASE+'/APP/payment/action/PaymentActionC.jspx',
  params: {
    op,
    HOSPITALID_TREE,
    INPUT_PATIENT_ID,
    SORT_RULE
  }
})