const HtmlWebPackPlugin = require('html-webpack-plugin');
// const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require('path');

/**
 * https://reactjs.org/docs/code-splitting.html
 * https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269
 * https://webpack.js.org/configuration/
 * https://www.toptal.com/javascript/a-guide-to-managing-webpack-dependencies
 */
module.exports = {
  entry: {
    main: {
      import: ['babel-polyfill', './src/index.js'],
      dependOn: ['vendors'],
    },
    vendors: ["react", "react-dom"]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].bundle.js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  optimization: {
    minimizer: [
      // https://webpack.js.org/plugins/css-minimizer-webpack-plugin/
      '...',
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html'
    }),
    // new WebpackBundleAnalyzer(),
    new MiniCssExtractPlugin({ filename: "[name].[contenthash:8].css"})
  ],
};
