const Webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const userStr = require("./webpack-config/user.json")

function getProjectInfo() {
    return `${userStr.copyright}
Project name:${userStr.project}
Version:${userStr.version}
Author:${userStr.author}/${userStr.name}
Recent edit by ${userStr.author}/${userStr.email} on ${new Date().toLocaleString()}`
}

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : './',
    outputDir: 'static',
    assetsDir: './',
    // eslint-loader 是否在保存的时候检查 安装@vue/cli-plugin-eslint有效
    lintOnSave: true,
    //是否使用包含运行时编译器的 Vue 构建版本。设置true后你就可以在使用template
    runtimeCompiler: true,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
    transpileDependencies: [],
    chainWebpack: config => {
        // 移除prefetch插件,因为不移除的话会默认开启 prefetch(预先加载模块)，提前获取用户未来可能会访问的内容在首屏会把这十几个路由文件，都一口气下载了
        config.plugins.delete('prefetch');
        config.optimization.minimizer('terser').tap((args) => {
            // 去除生产环境console
            args[0].terserOptions.compress.drop_console = true
            return args
        })
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.plugins.push(new Webpack.BannerPlugin(getProjectInfo()))
            config.plugins.push(new CompressionPlugin({ // gzip压缩配置
                algorithm: "gzip",
                test: /\.js$|\.html$|\.css/, // 匹配文件名
                threshold: 1024000, // 对超过1000kb的数据进行压缩
                minRatio: 0.8,
                deleteOriginalAssets: false // 是否删除原文件
            }))
        } else {
            // 为开发环境修改配置...
        }
    },
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin 生产环境下是true,开发环境下是false
        extract: true,
        // 开启 CSS source maps
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        },
        // 启用 CSS modules for all css / pre-processor files.
        // modules: true
    },
    // webpack-dev-server 相关配置
    devServer: { // 设置代理
        hot: true, //热加载
        host: '0.0.0.0',
        port: 8082, //端口
        https: false, //false关闭https，true为开启
        open: false, //自动打开浏览器 open: 'Google Chrome'-默认启动谷歌
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        proxy: {
            '/api': {
                //target: 'http://10.50.22.200:8080',
                //target:'http://10.51.23.23:8080',//志伟
                //target:'http://10.51.23.77:8080',//薄兴启
                target:'http://10.51.23.226:8080',//鲍卫东
                //target:'http://10.51.23.129:8080',//余兴田
                //target:'http://10.50.7.6:8080',
                //target:'http://10.50.7.48:8080',
                //ws: true, // 代理的WebSockets
                //secure:true,//https
                changeOrigin: true, // 允许websockets跨域
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    },
    pluginOptions: { // 第三方插件配置

    }
}