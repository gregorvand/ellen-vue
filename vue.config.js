module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/styles/lib/foundation.scss";`,
      },
    },
  },
}
