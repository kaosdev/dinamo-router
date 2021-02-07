const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

const languages = ['it', 'en'];

const pages = languages.map((lang) => {
  return new HtmlPlugin({
    template: './src/index.html',
    inject: "body",
    filename: lang + '/index.html',
  });
})

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.ts',
    router: './src/router/router.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  devServer: {
    port: 8080,
    historyApiFallback: {
      rewrites: [{
          from: /^\/en\/(.*)/,
          to: "/en/index.html",
        },
        {
          from: /^\/it\/(.*)/,
          to: "/it/index.html",
        },
      ],
    },
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }, ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    ...pages,
    new CleanWebpackPlugin(),
  ]
};