const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/ReactRelativeTimer',
    output: {
        path: path.resolve(),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    }
};
