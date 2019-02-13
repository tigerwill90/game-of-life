const path = require('path')

const options = {
    entry: path.join(__dirname, 'index.js'),
    output: {
        filename: process.env.NODE_ENV === 'production' ? 'lifegame.min.js' : 'lifegame.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'GameOfLife',
        libraryExport: 'default' // es6 export default
    },
    mode: process.env.NODE_ENV,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
}

if (process.env.NODE_ENV === 'production') {
    options.devtool = 'eval'
} else {
    options.devtool = 'source-map'
}

module.exports = options
