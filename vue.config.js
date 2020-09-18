module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/CCBQRCodePay/' : '/',
  devServer: {
    proxy: {
      // 如果你的前端应用和后端API服务器没有运行在同一个主机上你需要在开发环境下将API请求代理到API服务器
      '/api': {//解决跨域问题
        target: 'https://app.yiliao.ccb.com/',//代理服务器
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}