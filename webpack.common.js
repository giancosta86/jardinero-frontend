const { resolve } = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const pkg = require("./package.json");

module.exports = {
  module: {
    rules: [
      {
        test: /\.module\.s?css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          "sass-loader"
        ]
      },

      {
        test: /\.s?css$/i,
        exclude: /\.module\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource"
      }
    ]
  },

  entry: "./src/web/main.tsx",

  output: {
    path: resolve(__dirname, "dist", "web"),
    filename: `${pkg.name}.[contenthash].js`
  },

  resolve: {
    extensions: [".ts", ".tsx", "..."]
  },

  performance: {
    assetFilter: asset => {
      return asset.match(`\.js$`);
    }
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Jardinero",
      filename: "index.html",
      favicon: "favicon.svg"
    })
  ]
};
