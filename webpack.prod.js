const { join } = require("node:path");
const { merge } = require("webpack-merge");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /\/node_modules\//,
        use: "ts-loader"
      }
    ]
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: join("..", "..", "bundle-report.html"),
      openAnalyzer: false
    })
  ]
});
