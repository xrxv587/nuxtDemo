
module.exports = {
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  plugins: [
    { src: '@@plugins/elementUI', ssr: true }
  ],
  vendor: [
    'elementUI'
  ],
  build: {
    extend(config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.devtool = 'inline-source-map';
      }
    }
  },
  modules: [
    '@nuxtjs/axios'
  ],
  axios: {
    host: 'pcapi.ccuol.cn',
    port: 80
  }
}