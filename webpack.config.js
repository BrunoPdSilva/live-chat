const path = require('path')

module.exports = {
    mode:'development',
    entry: {
        index: './src/index'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    watch: true
}

