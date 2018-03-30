
// 引入path路径
const path = require('path')

// 引入webpack
const webpack = require('webpack')

// 引入插件 对 Html 进行处理
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 对样式的提出插件
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// 命令行参数的提出
const args = process.argv.slice(2)

// 是否为 Debug 模式 有release 表示为生产模式，否则为开发模式
// 有release表示为false 没有表示为true
const DEBUG = !(args[0] === '--release')

// 获取到代码编译过程中的有用信息 决定什么内容打印到控制台
const VERBOSE = args[0] === '--verbose'

/**
 * Webpack configuration (core/main.js => build/bundle.js)
 * http://webpack.github.io/docs/configuration.html
 */
const config = {

  // 输出目录
  context: path.resolve(__dirname, './src'),

  // 输出文件
  entry: {

    //打包一个app.js文件 入口为main.js
    app: [
      './main.js',
    ],
    //打包一个vendor.js文件，入口为一堆js文件
    vendor: [ 
      'es5-shim',
      'es5-shim/es5-sham',
      'babel-polyfill',
      'es6-promise',
      'fetch-detector',
      'fetch-ie8',
      'fetch-jsonp',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'redux-thunk',
    ],
  },

  // 输出文件选项
  output: {

    // 本地构建以后的输出文件路径
    path: path.resolve(__dirname, 'build'),

    // 指定的是构建后在html里的路径，一般也是用这个来指定上线后的cdn域名
    publicPath: './',

    // 输出的文件名 这里没有使用 hash 技术
    filename: 'assets/[name].js',

    // 用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
    chunkFilename: 'assets/[name].js',

    // 每行包文件的资源的前缀都是字符串，使用一些缩进会看起来更美观
    sourcePrefix: '  ', 
  },

  // Switch loaders to debug or release mode
  // 开启loaders的调试模式， webapck2将loader调试移到了一个插件中
  debug: DEBUG,

  // 缓存生成的 webpack 模块和 chunk
  cache: DEBUG,

  // 增强调试
  devtool: DEBUG ? 'source-map' : false,

  // What information should be printed to the console
  //让你准确地控制显示哪些包的信息 如果你希望得到部分包的信息（而不是一股脑全部输出），而不想使用 quiet 或者 noInfo 模式的时候，这个选项是一个很好的折衷办法
  stats: {
    // `webpack --colors` 等同于
    colors: true,
    // 增加模块被引入的原因
    reasons: DEBUG,
    // 增加编译的哈希值
    hash: VERBOSE,
    // 增加 webpack 版本信息
    version: VERBOSE,
    // 增加时间信息
    timings: true,
    // 增加包信息（设置为 `false` 能允许较少的冗长输出）
    chunks: VERBOSE,
    // 将内置模块信息增加到包信息
    chunkModules: VERBOSE,
    // 增加缓存了的（但没构建）模块的信息
    cached: VERBOSE,
    //显示缓存的资产(将其设置为“false”只显示发出的文件)
    cachedAssets: VERBOSE,
    // 增加子级的信息
    children: false,
  },

  // The list of plugins for Webpack compiler
  plugins: [
    
    // OccurenceOrderPlugin 为组件和模块分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID，通过分析ID，用到次数更多的会出现在文件的前面
    //在之后的 webpack 版本中 已经删除了
    new webpack.optimize.OccurenceOrderPlugin(),

    //使用 CommonsChunkPlugin 去重和分离 chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),

    // 创建一个在编译时可以配置的全局常量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      __DEV__: DEBUG,
      __BASENAME__: JSON.stringify(process.env.BASENAME || ''),
    }),

    // 提出CSS
    new ExtractTextPlugin(
      'assets/styles.css',
      {
        minimize: !DEBUG,
        //从其它模块中提取
        allChunks: true,
      }
    ),
    // Html 的输出
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.ejs'),
      filename: 'index.html',
      minify: !DEBUG ? {
        collapseWhitespace: true,
      } : null,
      hash: true,
    }),

  ],

  // Options affecting the normal modules
  module: {
    loaders: [
      //jsx 文件的加载
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, './src'),
        ],
        loader: 'babel-loader',
        query: {
          plugins: [],
        },
      },
      // CSS文件的加载
      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?-autoprefixer&modules=true&localIdentName=[local]!postcss-loader'
        ),
      },
      // scss 文档加载
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?-autoprefixer!postcss-loader!sass-loader'
        ),
      },
      // JSON 文件加载
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      // 图片文件加载
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          name: 'assets/[path][name].[ext]',
          limit: 10000,
        },
      },
      //字体文件加载
      {
        test: /\.(eot|ttf|wav|mp3|ogg)$/,
        loader: 'file-loader',
        query: {
          name: 'assets/[path][name].[ext]',
        },
      },
    ],
  },



  // Alias 设置模块如何被解析
  resolve: {
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      components: path.resolve(__dirname, './src/components/'),
      routes: path.resolve(__dirname, './src/routes/'),
      services: path.resolve(__dirname, './src/services/'),
      store: path.resolve(__dirname, './src/store/'),
    },
  },

}

// Optimize the bundle in release (production) mode
// 在发布(生产)模式中优化捆绑包
if (!DEBUG) {

  // webpack.optimize.DedupePlugin 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块，比如可以用它去除依赖中重复的插件
  config.plugins.push(new webpack.optimize.DedupePlugin())

  //压缩JS ：screw_ie8是否去掉支持IE8的代码
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: VERBOSE, screw_ie8: false },
    mangle: { screw_ie8: false },
    output: { screw_ie8: false },
  }))

  //一个更具侵略性的块合并策略的插件 它把所有的chunkFile又合到一起了
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin())

  //label-loader加载相关的内容
  config.module.loaders
    .find(x => x.loader === 'babel-loader').query.plugins
    .unshift(
    'transform-react-remove-prop-types',
    'transform-react-constant-elements',
    'transform-react-inline-elements',
    'transform-es3-modules-literals',
    'transform-es3-member-expression-literals',
    'transform-es3-property-literals'
    )
}

module.exports = config
