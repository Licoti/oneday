const path = require('path');
const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const dev = process.env.NODE_ENV === "dev";
const prod = process.env.NODE_ENV === "production";

module.exports = {
  mode: 'development',
  watch: !prod,
  entry: {
    //index: './public/js/index.js',
    index: ['./public/scss/style.scss', './public/js/index.js'],
  },
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    static: './dist',
    compress: true,
    hot: true,
    watchFiles: ['views/*.twig'] //Permet de livereload les html
  },
  module: {
    rules: [
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(sass|scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
  resolve: {
    modules: ['../public', 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': '../',
      assets: '../dist',
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery":"jquery"
    }),

    new CopyPlugin({
      patterns: [
        { from: "manifest.webmanifest", to: "" },
        { from: 'public/icon', to: 'icon' }
      ],
    }),

    new WebpackManifestPlugin(true)
  ],
  output: {
    filename: 'javascripts/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '',
  },
};
