const { merge } = require("webpack-merge");
const path = require("path");

const common = require("./webpack.common.js");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

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
      reportFilename: path.join("..", "bundle-report.html"),
      openAnalyzer: false
    })
  ]
});
