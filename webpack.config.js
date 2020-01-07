const webpack = require('webpack') // 引入 webpack
const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 将 css 单独打包成文件

const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // 压缩 css





module.exports = {
  entry: {
    app: "./src/index.js" //需要打包的文件
  },
  output: {
    publicPath: "/", // js 应用的路径 或者CDN地址,
    path: path.resolve(__dirname, "dist"), //打包文件的输出目录
    filename: "[name].bundle.js", // 代码打包后的文件名
    chunkFilename: "[name].js" // 代码拆分后的文件名
  },
  mode: 'development', // 开发模式
  devtool: 'source-map', // 开启调试
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8000, // 本地服务器端口号
    hot: true, // 热重载
    overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
    proxy: {
      // 跨域代理转发
      '/comments': {
        target: 'https://m.weibo.cn',
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Cookie: ''
        }
      }
    },
    historyApiFallback: {
      // HTML5 history模式
      rewrites: [{ from: /.*/, to: '/index.html' }]
    }
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: "all",
  //     cacheGroups: {
  //       lodash: {
  //         name: "lodash",
  //         test: /[\\/]node_modules[\\/]lodash[\\/]/,
  //         priority: 5 // 优先级要大于 vendors 不然会被打包进 vendors
  //       },
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10
  //       },
  //       default: {
  //         minChunks: 2,
  //         priority: -20,
  //         reuseExistingChunk: true
  //       }
  //     }
  //   }
  // },
  plugins: [
    new CleanWebpackPlugin(), // 默认情况下，此插件将删除 webpack output.path目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: "自动生成HTML",
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: "index.html", // 生成后的文件名
      template: "index.html", // 根据此模版生成 HTML 文件
      chunks: ['app'] // entry中的 main 入口才会被打包
    }),
    new webpack.HotModuleReplacementPlugin(), // 热部署模块
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"), //用于优化\最小化 CSS 的 CSS 处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    }),

  ],
  module: {
    rules: [
      {
        test: /\.js$/, //使用正则表达来匹配 js 文件
        exclude: /node_modules/, //排除依赖包文件夹
        use: {
          loader: "babel-loader" //使用babel-loader
        }
      },
      {
        test: /\.(sa|sc|c)ss$/, // 针对 .scss 或者 .css 后缀的文件设置 loader
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          // 使用 postcss 为 css 加上浏览器前缀
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")]
            }
          },
          "sass-loader" // 使用 sass-loader 将 scss 转为 css
        ]
      }
    ]
  }
};


