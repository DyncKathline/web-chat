const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
    //例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 baseUrl 为 /my-app/。
    baseUrl: process.env.NODE_ENV === "production" ? "/" : "/",
    // baseUrl: "/",

    // outputDir: 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）
    outputDir: "dist",
    //用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    assetsDir: "static",
    //指定生成的 index.html 的输出路径  (打包之后，改变系统默认的index.html的文件名)
    // indexPath: "myIndex.html",
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,

    // 配置高于chainWebpack中关于css loader的配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // webpack配置
    // see https://cli.vuejs.org/zh/guide/webpack.html
    chainWebpack: config => {
        // url-loader
        // config.module
        //     .rule('url-loader')
        //     .test(/\.(eot|woff|woff2|ttf|svg|png|jpg)$/)
        //     .use('url-loader')
        //     .loader('url-loader?limit=30000&name=[name]-[hash].[ext]')
        //     .end()
    },
    configureWebpack: config => {
        //入口文件
        config.entry.app = ['babel-polyfill', './src/main.js'];
        //删除console插件
        let plugins = [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: true
                    },
                    output: {
                        // 去掉注释内容
                        comments: false,
                    }
                },
                sourceMap: false,
                parallel: true,
            })
        ];
        //只有打包生产环境才需要将console删除
        if (process.env.NODE_ENV === 'production') {
            config.plugins = [...config.plugins, ...plugins];
        }
    },
    // 它支持webPack-dev-server的所有选项
    devServer: {
        host: '0.0.0.0',
        port: 8080, // 端口号
        https: false, // https:{type:Boolean}
        open: process.platform === 'darwin',
        // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
        proxy: null
    }
};