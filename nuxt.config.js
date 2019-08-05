
module.exports = {
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  plugins: [
    { src: '@@plugins/elementUI', ssr: true },
    { src: '@@plugins/axios' }
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
  }
}