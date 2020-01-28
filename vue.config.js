module.exports = {
  pluginOptions: {
    quasar: {
      theme: 'mat',
      importAll: true
    }
  },
  transpileDependencies: [/[\\\/]node_modules[\\\/]quasar-framework[\\\/]/],
  publicPath:
    process.env.EPA
      ? '/epa-open-data-metadata-editor/'
      : '/'
}
