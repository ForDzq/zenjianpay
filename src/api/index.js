import ajax from './ajax'

let isPro = process.env.NODE_ENV === 'production' // 开发环境是development
// let baseURL = isPro ? 'http://1.3.4:8888/' : '/api'
// axios.defaults.baseURL = baseURL
const BASE = isPro ? 'https://app.yiliao.ccb.com' : '/api'
console.log(process.env.NODE_ENV,BASE)

//1.1门诊快速缴费查询接口
export const reqPaymentBusinessFast = ({HOSPITALID_TREE,hospitalID,patientId,ID_NO,NAME,QUERY_TYPE}) => ajax({
  method: 'POST',
  url: BASE+'/APP/ccb/payment/action/PaymentActionC.jspx',
  data: {
    HOSPITALID_TREE,
    hospitalID,
    patientId,
    ID_NO,
    NAME,
    QUERY_TYPE
  }
})

//1.2支付方式查询接口 getPaymentMethod
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
  method: 'POST',
  url: BASE+'/APP/apppay/action/PayActionC.jspx',
  data: {
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
export const reqPayHandleResult = ({TRADE_NO,TRANS_CODE}) => ajax({
  method: 'POST',
  url: BASE+'/APP/apppay/action/PayActionC.jspx',
  data: {
    TRADE_NO,
    TRANS_CODE
  }
})


// 根据经纬度获取位置详情
// export const reqAddress = () => ajax.get(
//   BASE
// )
// 获取食品分类列表
// export const reqCategorys = () => ajax({
//   method: 'GET',
//   url: BASE + '/index_category',
//   headers: {
//     needToken: true
//   }
// })

// 根据经纬度获取商铺列表
// export const reqShops = ({latitude, longitude}) => ajax({
//   method: 'GET',
//   url: BASE + '/shops',
//   params: { latitude, longitude },
//   headers: {
//     needToken: true
//   }
// })

// export const smsLogin = ({phone,code}) => ajax({
//   method: 'POST',
//   url: BASE+'/login_sms',
//   data: {
//     phone,
//     code
//   }
// })

// export const pwdLogin = ({name,pwd,captcha}) => ajax({
//   method: 'POST',
//   url: BASE+'/login_pwd',
//   data: {
//     name,
//     pwd,
//     captcha
//   }
// })