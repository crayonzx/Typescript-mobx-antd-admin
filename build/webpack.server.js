'use strict';

/**
 * Created by x on 11/23/15.
 */
var webpack          = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config           = require('./webpack.config.dev');

config.entry = [
    'webpack-dev-server/client?http://localhost:9090',
    'webpack/hot/only-dev-server'
].concat(config.entry)

// "dev": "webpack-dev-server --devtool eval --progress --colors --hot  --content-base build",
new WebpackDevServer(webpack(config), {
    contentBase: config.output.path,
    publicPath: config.output.publicPath,
    quiet: false,
    noInfo: false,
    hot: true,
    historyApiFallback: true,
    proxy: {
            '/act': {
                target: 'http://192.168.1.160:8100/advert',
                secure: false,
            }
            },
    stats: {
        colors: true,
        progress: true
    }
}).listen(9090, '0.0.0.0', function (err, result) {
    if (err) {
        console.log(err);
    }

    console.log('Listening at 127.0.0.1:9090');
});
