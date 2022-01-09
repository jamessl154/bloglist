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
    // https://webpack.js.org/guides/caching/
    // recommended to use contenthash in production for caching, the hash only changes when the asset's content changes
    // https://webpack.js.org/concepts/under-the-hood/#output
    // initial chunk: entry point
    filename: '[name].[contenthash:8].bundle.js',
    // non-initial chunk:
    chunkFilename: '[name].[contenthash:8].chunk.js',
    publicPath: '/',
    // after build, removes unused files in dist/
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
        // regex test
        test: /\.css$/,
        // do not use style-loader and mini-css-extract-plugin together
        // The loaders run in reverse array order
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
      // this line extends existing minimizers
      '...',
      // minifies css files
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      // which chunks will be selected for optimization
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
    // extracts css into its own file that is run before the js bundles are injected
    // which prevents styles flickering
    new MiniCssExtractPlugin({ filename: "[name].[contenthash:8].css"})
  ],
};
