const CracoLessPlugin = require('craco-less')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  webpack: {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
      ],
    },
    configure: (webpackConfig) => {
      if (process.env.NODE_ENV === 'production') {
        // remove console in production
        const TerserPlugin = webpackConfig.optimization.minimizer.find(
          (i) => i.constructor.name === 'TerserPlugin'
        )
        if (TerserPlugin) {
          TerserPlugin.options.terserOptions.compress['drop_console'] = true
        }
      }

      return webpackConfig
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // '@table-row-hover-bg': 'unset',
              '@primary-color': '#2D9CAC',
              '@border-radius-base': '6px;',
              '@link-color': '#2D9CAC',
              '@font-size-base': '13px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
}
